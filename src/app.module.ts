import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { ExceptionModule } from './exception/exception.module';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { CreatorsModule } from './creators/creators.module';
import { DropsModule } from './drops/drops.module';

dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'prod') ? '.prod.env'
      : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.dev.env'
  )
});

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URL,{
    dbName: 'label'}),
    ItemModule,
    UsersModule,
    AuthModule,
    ExceptionModule,
    CreatorsModule,
    DropsModule],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule {}
