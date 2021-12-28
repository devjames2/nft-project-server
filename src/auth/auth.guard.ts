import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable, Module, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
// import { JwtUser } from './auth/interfaces/jwt-user.interface';

// @Module({
//   imports: [ UserModule ]
// })

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  // constructor(private readonly jwtService: JwtService,) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    console.log(`VALID #1 ${JSON.stringify(request.headers)}`)
    // const jwtString:string = request.headers.Authorization[0];
    const jwtString:string = request.headers.authorization;
    if(!jwtString) {
      return false
    }
    // const jwtString = auth.split('Bearer ')[1];

    console.log(jwtString)
    this.authService.verify(jwtString);
    // this.verify(jwtString);

    return true;
  }

  // private verify(jwtString: string) {
  //   try {
  //     const payload = this.jwtService.verify(jwtString, process.env.JWT_SECRET as JwtVerifyOptions) as unknown as string & JwtUser;
  //     const { accountAddress } = payload;
  //     return {
  //       accountAddress
  //     }

  //   } catch (e) {
  //     throw new UnauthorizedException()
  //   }
  // }
}
