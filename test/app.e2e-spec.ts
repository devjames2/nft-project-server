import { Connection } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import express from 'express';
import { personalSign } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { DatabaseService } from './../src/database/database.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;

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
    dbConnection = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
  });

  afterAll(async () => {
    try {
      await dbConnection.collection('creators').deleteMany({});
      await dbConnection.collection('userauthinfos').deleteMany({});
    } catch (error) {
      console.log(error);
    }
    await app.close();
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
    it('(NFT-130) should return 201 /creators (POST) called', async () => {
      // Given
      const URL = '/creators';
      const createCreatorDto = {
        accountAddress: '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd5A',
        nickName: 'TestNickName',
      };

      // When
      return await request
        .default(app.getHttpServer())
        .post(URL)
        .send(createCreatorDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('nickName');
          expect(res.body).toHaveProperty('accountAddress');
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('__v');
          expect(res.body.status).toEqual('HIDE');
          expect(res.body.nickName).toEqual(createCreatorDto.nickName);
          expect(res.body.accountAddress).toEqual(
            createCreatorDto.accountAddress,
          );
          return request
            .default(app.getHttpServer())
            .delete(`${URL}/${res.body._id}`)
            .expect(200);
        });
    });

    it('(NFT-130) should return 422 /creators (POST) called when creator already exists', async () => {
      // Given
      const URL = '/creators';
      const duplicatedNickNameCreateCreatorDto = {
        accountAddress: '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd5B',
        nickName: 'TestNickName',
      };
      const duplicatedAccountAddressCreateCreatorDto = {
        accountAddress: '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd5A',
        nickName: 'TestNickName2',
      };

      // When
      await request
        .default(app.getHttpServer())
        .post(URL)
        .send(duplicatedNickNameCreateCreatorDto)
        .expect(422)
        .expect((err, res) => {
          expect(JSON.parse(err.text)).toHaveProperty('message');
          expect(JSON.parse(err.text)).toHaveProperty('error');
          expect(JSON.parse(err.text).message).toEqual(
            'Creator already exists',
          );
          expect(JSON.parse(err.text).error).toEqual('Unprocessable Entity');
        });

      await request
        .default(app.getHttpServer())
        .post(URL)
        .send(duplicatedAccountAddressCreateCreatorDto)
        .expect(422)
        .expect((err, res) => {
          expect(JSON.parse(err.text)).toHaveProperty('message');
          expect(JSON.parse(err.text)).toHaveProperty('error');
          expect(JSON.parse(err.text).message).toEqual(
            'Creator already exists',
          );
          expect(JSON.parse(err.text).error).toEqual('Unprocessable Entity');
        });
    });

    it('(NFT-130) should return 200 /creators (GET) called', async () => {
      // Given
      const URL = '/creators';
      const page = 0;
      const limit = 10;

      // When
      await request
        .default(app.getHttpServer())
        .get(`${URL}?page=${page}&limit=${limit}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('docs');
          expect(res.body).toHaveProperty('totalDocs');
          expect(res.body).toHaveProperty('limit');
          expect(res.body).toHaveProperty('totalPages');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('pagingCounter');
          expect(res.body).toHaveProperty('hasPrevPage');
          expect(res.body).toHaveProperty('hasNextPage');
          expect(res.body).toHaveProperty('prevPage');
          expect(res.body).toHaveProperty('nextPage');
        });
    });

    it('(NFT-130) should return 200 /creator/:_id (GET) called', async () => {
      // Given
      const URL = '/creators';
      const res = await request
        .default(app.getHttpServer())
        .get(URL)
        .expect(200);
      const _id = res.body.docs[0]._id;

      // When
      await request
        .default(app.getHttpServer())
        .get(`${URL}/${_id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('nickName');
          expect(res.body).toHaveProperty('accountAddress');
          expect(res.body._id).toEqual(_id);
        });
    });

    it('(NFT-130) should return 404 /creator/:_id (PATCH) called with id is not exist', async () => {
      // Given
      const URL = '/creators';
      const invalidId = '61ffcc1aedfd9e0a8cfd8aaa';

      // When
      await request
        .default(app.getHttpServer())
        .get(`${URL}/${invalidId}`)
        .expect(404)
        .expect((err, res) => {
          console.log(err);
          expect(err.body.message).toEqual('creator not found');
        });
    });

    it('(NFT-130) should return 200 /creator (PATCH) called', async () => {
      // Given
      const URL = '/creators';
      const res = await request
        .default(app.getHttpServer())
        .get(URL)
        .expect(200);
      const _id = res.body.docs[0]._id;
      const updateCreatorDto = {
        _id,
        accountAddress: '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd5A',
        nickName: 'UpdatedTestNickName',
      };

      // When
      await request
        .default(app.getHttpServer())
        .patch(URL)
        .send(updateCreatorDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.modifiedCount).toEqual(1);
          expect(res.body.matchedCount).toEqual(1);
        });
    });

    it('(NFT-130) should return 200 /creator (PATCH) called with _id is not exist', async () => {
      // Given
      const URL = '/creators';
      const invalidId = '61ffcc1aedfd9e0a8cfd8aaa';
      const updateCreatorDto = {
        _id: invalidId,
        accountAddress: '0x5E4E12042cbe7EFCFcCd235265b2a8b190b5Fd5A',
        nickName: 'UpdatedTestNickName',
      };

      // When
      await request
        .default(app.getHttpServer())
        .patch(URL)
        .send(updateCreatorDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.modifiedCount).toEqual(0);
          expect(res.body.matchedCount).toEqual(0);
        });
    });

    it('(NFT-130) should return 404 /creator/:_id (DELETE) called with _id is not exist', async () => {
      // Given
      const URL = '/creators';
      const invalidId = '61ffcc1aedfd9e0a8cfd8aaa';

      // When
      await request
        .default(app.getHttpServer())
        .patch(`${URL}/${invalidId}`)
        .expect(404)
        .expect((err, res) => {
          expect(err.body.error).toEqual('Not Found');
        });
    });

    it('(NFT-130) should return 200 /creator/:_id (DELETE) called', async () => {
      // Given
      const URL = '/creators';
      const res = await request
        .default(app.getHttpServer())
        .get(URL)
        .expect(200);
      const _id = res.body.docs[0]._id;

      // When
      await request
        .default(app.getHttpServer())
        .delete(`${URL}/${_id}`)
        .expect(200)
        .expect((res) => {
          expect(res.text).toEqual(`removes a creator with id : ${_id}`);
        });
    });
  });
});
