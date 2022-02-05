import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';

@Module({
  imports: [
    JwtModule.register({
    // secret: process.env.JWT_SECRET,
    secret: "secret",
    signOptions: { expiresIn: '30d' },
  }), 
  EmailModule,
  MongooseModule.forFeature([
    { name: Users.name, schema: UsersSchema }
  ])
],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, EmailModule]
})
export class UsersModule {}
