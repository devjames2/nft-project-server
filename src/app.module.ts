import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';

dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'prod') ? '.prod.env'
      : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.dev.env'
  )
});

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URL),
    ItemModule,
    // UserModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule {}
