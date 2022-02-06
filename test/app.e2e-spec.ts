import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import express from 'express';
import { personalSign } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
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
    it('should return 200 when /auth?accountAddress=`accountAddress` (GET) called', async () => {
      // Given
      const URL =
        '/auth?accountAddress=0x264D6BF791f6Be6F001A95e895AE0a904732d473';

      // When
      const res = await request
        .default(app.getHttpServer())
        .get(URL)
        .expect(200);
      expect(res.body).toHaveProperty('nonce');
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

    it('should return 201 when /auth (POST) called with matched accountAddress and nonce', async () => {
      // Given
      const accountAddress = '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd5A';
      const privateKey =
        '84aee955437a675c564e0e481efa3fbd1859795161e936d82e75010cc61e0e1d';
      const URLForGettingNonce = `/auth?accountAddress=${accountAddress}`;
      const URL = '/auth';
      const data = {
        accountAddress,
      };
      const res = await request
        .default(app.getHttpServer())
        .get(URLForGettingNonce)
        .expect(200);
      const pk = Buffer.from(privateKey, 'hex');
      const msg = `I am signing my one-time nonce: ${res.body.nonce}`;
      const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
      const sig = personalSign(pk, { data: msgBufferHex });

      // When
      return await request
        .default(app.getHttpServer())
        .post(URL)
        .send({
          ...data,
          signature: sig,
          nonce: res.body.nonce,
        })
        .expect(201)
        .expect((res) => {
          expect(JSON.parse(res.text)).toHaveProperty('accessToken');
        });
    });

    it('should return 403 /auth (POST) called by invalid accountAddress', async () => {
      // Given
      const invalidAccountAddress =
        '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd6B';
      const accountAddress = '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd5A';
      const privateKey =
        '84aee955437a675c564e0e481efa3fbd1859795161e936d82e75010cc61e0e1d';
      const URLForGettingNonce = `/auth?accountAddress=${accountAddress}`;
      const URL = '/auth';
      const data = {
        accountAddress: invalidAccountAddress,
      };
      const res = await request
        .default(app.getHttpServer())
        .get(URLForGettingNonce)
        .expect(200);
      const pk = Buffer.from(privateKey, 'hex');
      const msg = `I am signing my one-time nonce: ${res.body.nonce}`;
      const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
      const sig = personalSign(pk, { data: msgBufferHex });

      // When
      return await request
        .default(app.getHttpServer())
        .post(URL)
        .send({
          ...data,
          signature: sig,
          nonce: res.body.nonce,
        })
        .expect(403)
        .expect((err, res) => {
          expect(err.text).toEqual('"Problem with getting user auth info."');
        });
    });

    it.todo(
      'should return 403 when /auth (POST) called with "Problem with signature verification."',
    );

    // it('should return 403 when /auth (POST) called with matched accountAddress and nonce', async () => {
    //   // Given
    //   const accountAddress = '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd5A';
    //   const privateKey =
    //     '84aee955437a675c564e0e481efa3fbd1859795161e936d82e75010cc61e0e1d';
    //   const URLForGettingNonce = `/auth?accountAddress=${accountAddress}`;
    //   const URL = '/auth';
    //   const data = {
    //     accountAddress,
    //   };
    //   const res = await request
    //     .default(app.getHttpServer())
    //     .get(URLForGettingNonce)
    //     .expect(200);
    //   const pk = Buffer.from(privateKey, 'hex');
    //   const msg = `This is not valid sign message: ${res.body.nonce}`;
    //   const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    //   const sig = personalSign(pk, { data: msgBufferHex });

    //   // When
    //   return await request
    //     .default(app.getHttpServer())
    //     .post(URL)
    //     .send({
    //       accountAddress: '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd5B', // This is not exists.
    //       signature: sig,
    //       nonce: res.body.nonce,
    //     })
    //     .expect(403)
    //     .expect((err, res) => {
    //       expect(err.text).toEqual('"Problem with signature verification."');
    //     });
    // });

    it('should return 401 /auth (POST) called by invalid signature', async () => {
      // Given
      const accountAddress = '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd5A';
      const privateKey =
        '84aee955437a675c564e0e481efa3fbd1859795161e936d82e75010cc61e0e1d';
      const invalidNonce = 100;
      const URL = '/auth';
      const data = {
        accountAddress,
      };
      const pk = Buffer.from(privateKey, 'hex');
      const msg = `I am signing my one-time nonce: ${invalidNonce}`;
      const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
      const sig = personalSign(pk, { data: msgBufferHex });

      // When
      return await request
        .default(app.getHttpServer())
        .post(URL)
        .send({
          ...data,
          signature: sig,
          nonce: invalidNonce,
        })
        .expect(401)
        .expect((err, res) => {
          expect(err.text).toEqual('"Signature verification failed"');
        });
    });
  });

  describe('Creators Test', () => {
    it.todo('should return 201 /creators (POST) called');
    it.todo(
      'should return 422 /creators (POST) called when creator already exists',
    );
    it.todo('should return 200 /creators (GET) called');
    it.todo(
      'should return 401 /creators (GET) called when the request is wrong',
    );
    it.todo('should return 200 /creator/:accountAddress (GET) called');
    it.todo('should return 200 /creator (PATCH) called');
    it.todo('should return 200 /creator/:accountAddress (DELETE) called');
  });
});
