import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { SignUpDTO } from 'src/auth/auth.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

describe('Auth (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
            }),
        );
        await app.init();
    });

    it('/signup success (POST)', () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: 'test@bookshop.com',
                name: 'Julie',
                password: 'test-pass',
                pseudonym: 'MsJ',
            } satisfies SignUpDTO)
            .expect(201);
    });

    it('/signup email unique (POST)', async () => {
        await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: 'test-unique@bookshop.com',
                name: 'Julie',
                password: 'test-pass',
                pseudonym: 'MsJ',
            } satisfies SignUpDTO)
            .expect(201);

        await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: 'test-unique@bookshop.com',
                name: 'Julie',
                password: 'test-pass',
                pseudonym: 'MsJ',
            } satisfies SignUpDTO)
            .expect(400);
    });

    it('/signup email validation (POST)', async () => {
        await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: 'test',
                name: 'Julie',
                password: 'test-pass',
                pseudonym: 'MsJ',
            } satisfies SignUpDTO)
            .expect(400);
    });
});
