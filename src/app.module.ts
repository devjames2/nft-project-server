import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'prod') ? '.prod.env'
      : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.dev.env'
  )
});

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URL),
    ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
