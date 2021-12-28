import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAuthInfo, UserAuthInfoSchema } from './schemas/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { loggers } from 'winston';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserAuthInfo.name, schema: UserAuthInfoSchema }]),
    JwtModule.register({
      // secret: process.env.JWT_SECRET,
      secret: "secret",
      signOptions: { expiresIn: '30d' },
    })],
  controllers: [AuthController],
  providers: [AuthService, Logger, AuthGuard],
  exports: [AuthService, AuthGuard]
})
export class AuthModule { }
