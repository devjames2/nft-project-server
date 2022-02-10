import { Logger, Module } from '@nestjs/common';
import { DropsService } from './drops.service';
import { DropsController } from './drops.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Drops, DropsSchema } from './schemas/drops.schema';

@Module({
  imports: [
    JwtModule.register({
      // secret: process.env.JWT_SECRET,
      secret: "secret",
      signOptions: { expiresIn: '30d' },
    }), 
    MongooseModule.forFeature([
      { name: Drops.name, schema: DropsSchema }
    ])
  ],
  controllers: [DropsController],
  providers: [DropsService, Logger]
})
export class DropsModule {}
