import { Connection } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import express from 'express';
import { personalSign } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { DatabaseService } from '../src/database/database.service';

describe('NFT-136 Admin은 아직 시작되지 않은 Drops 를 삭제할 수 있다.', () => {
  let app: INestApplication;
  let dbConnection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const options = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    };

    app = moduleFixture.createNestApplication();
    app.enableCors(options);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    // app.use(express.static(join(process.cwd(), '../client/dist/')));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    dbConnection = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
  });

  afterAll(async () => {
    try {
      await dbConnection.collection('drops').deleteMany({});
    } catch (error) {
      console.log(error);
    }
    await app.close();
  });


  it('should return 200 /drops/_id (DELETE) called', async () => {
    // Given
    const URL = '/drops';
    const createDropDto = {
      "dropName": "drop1",
      "dropSalesType": "ON_AUCTION",
      "shortDescription": "test1",
      "longDescription": "long description!!",
      "mainThumbnail": "YWJj",
      "mainBannerThumbnailPC": "YWJj",
      "mainBannerThumbnailMobile": "YWJj",
      "dropNFTs": [
        {
          "tokenAddress": "0x8eb9f52858d830aC99011eB1Bdf7095B0eE3B958",
          "tokenId": "10",
          "unit": "LBL_BEP20",
          "value": 10000000000,
          "volume": 10
        }
      ],
      "creators": ["0xcEA695c0F108833f347239bB2f05CEF06F6a7658"]
    };
    const result = await request
      .default(app.getHttpServer())
      .post(URL)
      .send(createDropDto)
    const dropId = result.body._id;

    // When
    return await request
      .default(app.getHttpServer())
      .delete(URL + '/' + dropId)
      .expect(200)
      .expect((res) => {
        expect(res.text).toEqual(`removes a ${dropId} drop`);
      });
  });

  it('should return 422 when drop status is not REGISTERING,NOT_SCHEDULED, /drops/_id (DELETE) called', async () => {
    // Given
    const URL = '/drops';
    const createDropDto = {
      "dropName": "drop1",
      "dropSalesType": "ON_AUCTION",
      "status": "ON_AUCTION",
      "shortDescription": "test1",
      "longDescription": "long description!!",
      "mainThumbnail": "YWJj",
      "mainBannerThumbnailPC": "YWJj",
      "mainBannerThumbnailMobile": "YWJj",
      "dropNFTs": [
        {
          "tokenAddress": "0x8eb9f52858d830aC99011eB1Bdf7095B0eE3B958",
          "tokenId": "10",
          "unit": "LBL_BEP20",
          "value": 10000000000,
          "volume": 10
        }
      ],
      "creators": ["0xcEA695c0F108833f347239bB2f05CEF06F6a7658"]
    };
    const result = await request
      .default(app.getHttpServer())
      .post(URL)
      .send(createDropDto)
    const dropId = result.body._id;

    // When
    return await request
      .default(app.getHttpServer())
      .delete(URL + '/' + dropId)
      .expect(422)
      .expect((res) => {
        expect(res.body.message).toEqual(`Drop can be modified only when status is registering or not scheduled`);
      });
  });
});
