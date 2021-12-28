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
    let recoveredAddress;
    try {
      const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
      recoveredAddress = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature,
      });
      console.log(`Step 2: ${recoveredAddress}`)
    } catch (err) {
      console.error(err)
      throw new HttpException('Problem with signature verification.', 403);
    }

    // The signature verification is successful if the address found with
    // sigUtil.recoverPersonalSignature matches the initial accountAddress
    if (recoveredAddress.toLowerCase() !== accountAddress.toLowerCase()) {
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
    let accessToken: String;
    try {
      accessToken = this.jwtService.sign(payload);
    } catch (err) {
      throw new HttpException('Creating JWT failed', 401);
    }

    return JSON.stringify({ accessToken: accessToken });
  }

  private async createUserAuthInfo(accountAddress: string): Promise<UserAuthInfo> {
    await this.userAuthInfoModel.deleteOne({ accountAddress: accountAddress })

    const newUserAuthDto = new UserAuthDto();
    newUserAuthDto.accountAddress = accountAddress.toLowerCase();
    newUserAuthDto.nonce = Math.floor(Math.random() * 10000000000);

    const newUserAuth = await new this.userAuthInfoModel(newUserAuthDto);
    await newUserAuth.save();

    // TODO: DB 조회해서 할 필요 있는지 고민 필요
    const result = await this.userAuthInfoModel.findOne().where('accountAddress').equals(accountAddress.toLowerCase()).select({nonce: 1, _id: 0})
    return result

  }

  async findUser(accountAddress: string): Promise<UserAuthInfo> {
    const result = await this.userAuthInfoModel.findOne().where('accountAddress').equals(accountAddress.toLowerCase()).select({nonce: 1, _id: 0})
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


