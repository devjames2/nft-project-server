import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonModuleUtilities, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { HttpExceptionFilter } from './exception/http-exception.filter';

dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'prod') ? '.prod.env'
      : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.dev.env'
  )
});

async function bootstrap() {

const app = await NestFactory.create(AppModule, {
  logger: WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('LABEL', { prettyPrint: true }),
        ),
      }),
    ],
  })
});
  // app.use(compression());


  const options = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  };

  app.enableCors(options);
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalFilters(new HttpExceptionFilter()); 
  await app.listen(process.env.PORT);
}
bootstrap();
