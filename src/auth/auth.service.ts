import { HttpException, Inject, Injectable, Logger, LoggerService, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { Model } from 'mongoose';
// import { Logger, loggers } from 'winston';
import { UserAuthDto } from './dto/user-auth.dto';
import { JwtUser } from './interfaces/jwt-user.interface';
import { UserAuthInfo, UserAuthInfoDocument } from './schemas/auth.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserAuthInfo.name)
    private readonly userAuthInfoModel: Model<UserAuthInfoDocument>,
    private readonly jwtService: JwtService,
    private readonly logger: Logger
  ) { }

  async loginUser(userAuthDto: UserAuthDto): Promise<string> {
    const { accountAddress, signature, nonce } = userAuthDto;

    if (!signature || !accountAddress)
      throw new HttpException('Request should have signature and accountAddress', 400);

    ////////////////////////////////////////////////////
    // Step 1: Get the user with the given accountAddress
    ////////////////////////////////////////////////////
    let userAuthInfo: UserAuthInfo
    try {
      userAuthInfo = await this.userAuthInfoModel.findOne({ where: { accountAddress: accountAddress } });
    } catch (err) {
      throw new HttpException('Problem with getting user auth info.', 403);
    }

    // console.log(`Step 1: ${userAuthInfo}`)

    ////////////////////////////////////////////////////
    // Step 2: Verify digital signature
    ////////////////////////////////////////////////////
    const msg = `I am signing my one-time nonce: ${userAuthInfo.nonce}`;
    let recovered_address;
    try {
      const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
      recovered_address = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature,
      });
      console.log(`Step 2: ${recovered_address}`)
    } catch (err) {
      console.error(err)
      throw new HttpException('Problem with signature verification.', 403);
    }

    // The signature verification is successful if the address found with
    // sigUtil.recoverPersonalSignature matches the initial accountAddress
    if (recovered_address.toLowerCase() !== accountAddress.toLowerCase()) {
      throw new HttpException('Signature verification failed', 401);
    }

    ////////////////////////////////////////////////////
    // Step 3: Generate a new nonce for the user
    ////////////////////////////////////////////////////
    try {
      this.createUserAuthInfo(accountAddress);
    } catch (err) {
      throw new HttpException('Generating a new nonce for the user failed', 401);
    }


    ////////////////////////////////////////////////////
    // Step 4: Create JWT
    ////////////////////////////////////////////////////

    const payload: JwtUser = {
      accountAddress: accountAddress
    };
    let access_token: String;
    try {
      access_token = this.jwtService.sign(payload);
    } catch (err) {
      throw new HttpException('Creating JWT failed', 401);
    }

    return JSON.stringify({ access_token });
  }

  // private async createUserAuthInfo(loginDto:LoginDto | UserAuthInfo) : Promise<UserAuthInfo> {
  private async createUserAuthInfo(accountAddress: string): Promise<UserAuthInfo> {
    // const nonce = Math.floor(Math.random() * 1000000000);
    await this.userAuthInfoModel.deleteOne({ accountAddress: accountAddress })

    const newUserAuthDto = new UserAuthDto();
    newUserAuthDto.accountAddress = accountAddress;
    newUserAuthDto.nonce = Math.floor(Math.random() * 10000000000);


    // const newUserAuthInfo = new UserAuthDto(accountAddress, nonce);

    const newUserAuth = await new this.userAuthInfoModel(newUserAuthDto);;
    return newUserAuth.save();

  }

  async findUser(accountAddress: string): Promise<UserAuthInfo> {
    const result = await this.userAuthInfoModel.findOne({ accountAddress }).exec();
    if (!result) {
      return this.createUserAuthInfo(accountAddress);
    }
    return result;
  }

  verify(jwtString: string) {
    try {
      const payload = this.jwtService.verify(jwtString, process.env.JWT_SECRET as JwtVerifyOptions) as unknown as string & JwtUser;
      const { accountAddress } = payload;
      return {
        accountAddress
      }

    } catch (e) {
      console.log(e)
      throw new UnauthorizedException()
    }
  }

}


