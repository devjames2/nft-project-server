import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dto/user-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findUser(@Query('accountAddress') publicAddress: string) {
    return this.authService.findUser(publicAddress)
  }

  @Post()
  login(@Body() userAuthDto: UserAuthDto){
    return this.authService.loginUser(userAuthDto)
  }
}
