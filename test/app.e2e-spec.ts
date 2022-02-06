import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import express from 'express';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
  });

  describe('Auth Test', () => {
    it('should return 200 when /auth?accountAddress=test (GET) called', () => {
      // Given
      const URL = '/auth?accountAddress=test';

      // When
      return request
        .default(app.getHttpServer())
        .get(URL)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('nonce');
        });
    });

    it('should return 400 when /auth (POST) called without accountAddress and signature', () => {
      // Given
      const URL = '/auth';
      const data = {};

      // When
      return request
        .default(app.getHttpServer())
        .post(URL)
        .send(data)
        .expect(400);
    });

    it.todo(
      'should return 403 when /auth (POST) called with unmatched accountAddress and nonce',
    );

    // it('should return 403 when /auth (POST) called with unmatched accountAddress and nonce', async (done) => {
    //   // Given
    //   const URLForGettingNonce =
    //     '/auth?accountAddress=0x264D6BF791f6Be6F001A95e895AE0a904732d473';
    //   const URL = '/auth';
    //   const data = {
    //     accountAddress: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    //     signature:
    //       '0xc5f30a1b7b9a036f8e92b8f4105129bdc29520c6d22f04a1c9e474b47a2c5ead35f2027143eb932cde364f9cc9259fe268afa94f947ce31e8082180a55120fe01b',
    //     nonce: '',
    //   };

    //   const nonceResp = await request
    //     .default(app.getHttpServer())
    //     .get(URLForGettingNonce)
    //     .expect(200);
    //   const createAccountResp = await request
    //     .default(app.getHttpServer())
    //     .post(URL)
    //     .send({
    //       ...data,
    //       nonce: nonceResp.body.nonce,
    //     })
    //     .expect(403);

    //   done();
    // });
  });
});
