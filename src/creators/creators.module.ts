import { Module } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { CreatorsController } from './creators.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Creators, CreatorsSchema } from './schemas/creators.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      // secret: process.env.JWT_SECRET,
      secret: 'secret',
      signOptions: { expiresIn: '30d' },
    }),
    MongooseModule.forFeature([
      { name: Creators.name, schema: CreatorsSchema },
    ]),
  ],
  controllers: [CreatorsController],
  providers: [CreatorsService],
})
export class CreatorsModule {}
