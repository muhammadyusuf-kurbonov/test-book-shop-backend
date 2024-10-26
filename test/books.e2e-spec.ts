import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { SignUpDTO } from 'src/auth/auth.dto';
import { Book, Prisma, PrismaClient, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { CreateBookDto } from 'src/book/book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { before } from 'node:test';
import { BookService } from 'src/book/book.service';

describe('Books (e2e)', () => {
    let app: INestApplication;
    let token: string;

    beforeAll(async () => {
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

    afterEach(async () => {
        const prisma = new PrismaClient();
        await prisma.book.deleteMany();
    });

    afterAll(async () => {
        const prisma = new PrismaClient();
        await prisma.user.deleteMany();
    });

    it('publish is protected', async () => {
        await request(app.getHttpServer())
            .post('/book')
            .send()
            .expect(401);
    });

    it('/book publish success (POST)', async () => {
        await app.get(UsersService).create({
            email: 'publisher@bookshop.com',
            name: 'Julie',
            password: 'test-pass',
            pseudonym: 'MsJ',
        });
        const authResponse = await request(app.getHttpServer())
            .post('/auth/login') // Ensure this matches your login route
            .send({ email: 'publisher@bookshop.com', password: 'test-pass' }) // replace with test credentials
            .expect(201);

        token = authResponse.body.access_token;
        const response = await request(app.getHttpServer())
            .post('/book')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({
                title: 'My FavBook',
                description: 'The best book of XXI century',
                price: 200,
                coverImage: 'https://images.google.com/any_img.jpeg',
            } satisfies CreateBookDto)
            .expect(201);
        expect(response.body.title).toBe('My FavBook');
        expect(response.body.author.email).toBe('publisher@bookshop.com');
    });

    describe('find and get tests', () => {
        let users: User[];
        beforeAll(async () => {
            const [user1, user2] = await Promise.all([
                app.get(UsersService).create({
                    email: 'test1@bookshop.com',
                    name: 'Julie',
                    password: 'test-pass',
                    pseudonym: 'MsJ',
                }),
                app.get(UsersService).create({
                    email: 'test2@bookshop.com',
                    name: 'Margaret',
                    password: 'test-margaret',
                    pseudonym: 'MsM',
                }),
            ]);
            users = [user1, user2];

            await app.get(PrismaService).book.createMany({
                data: Array(5)
                    .fill(0)
                    .map((index) => ({
                        coverImage: 'https://images.google.com/any_img.jpeg',
                        description: 'Book of #' + index,
                        title: 'Book #' + index,
                        price: 100,
                        authorId: index >= 3 ? user2.id : user1.id,
                    })),
            });
        });

        it('find books', async () => {
            const books = await request(app.getHttpServer())
                .get('/book')
                .expect(200);
            expect(books.body.length).toBe(5);
        });

        it('get book', async () => {
            const dummyBook = {
                coverImage: 'https://images.google.com/any_img.jpeg',
                description: 'Book of mine friend secret author',
                title: 'Book of Mistery',
                price: 100,
                authorId: users[0].id,
            };
            const book = await app.get(PrismaService).book.create({
                data: dummyBook,
            });

            await request(app.getHttpServer())
                .get('/book/' + book.id)
                .expect(200)
                .expect((response) => {
                    return response.body == dummyBook;
                });
        });

        it('search book', async () => {
            const dummyBook = {
                coverImage: 'https://images.google.com/any_img.jpeg',
                description: 'Book of mine friend secret author',
                title: 'Book of Mistery',
                price: 100,
                authorId: users[0].id,
            };
            const book = await app.get(PrismaService).book.create({
                data: dummyBook,
            });

            await request(app.getHttpServer())
                .get('/book/?search=Mistery')
                .expect(200)
                .expect((response) => {
                    return (
                        response.body.length === 1 &&
                        response.body[0] == dummyBook
                    );
                });
        });
    });

    describe('unpublish book (only author can)', () => {
        let book: Book;
        beforeAll(async () => {
            await app.get(UsersService).create({
                email: 'unpublish-test@bookshop.com',
                name: 'Julie',
                password: 'test-pass',
                pseudonym: 'MsJ',
            });
        });
        beforeEach(async () => {
            book = await app.get(PrismaService).book.create({
                data: {
                    coverImage: 'https://images.google.com/any_img.jpeg',
                    description: 'Book of bad author, that want unpublish',
                    title: 'Bad book',
                    price: 100,
                    author: {
                        connect: { email: 'unpublish-test@bookshop.com' },
                    },
                },
            });
        });

        it('author can unpublish book', async () => {
            const authResponse = await request(app.getHttpServer())
                .post('/auth/login') // Ensure this matches your login route
                .send({
                    email: 'unpublish-test@bookshop.com',
                    password: 'test-pass',
                }) // replace with test credentials
                .expect(201);

            const token = authResponse.body.access_token;

            await request(app.getHttpServer())
                .delete('/book/' + book.id)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const books = await app.get(BookService).search();
            expect(books.length).toBe(0);
        });

        it('unpublish is protected', async () => {
            await request(app.getHttpServer())
                .delete('/book/' + book.id)
                .expect(401);
        });

        it('other author can not unpublish book', async () => {
            await app.get(UsersService).create({
                email: 'other-test@bookshop.com',
                name: 'Julie',
                password: 'test-pass',
                pseudonym: 'MsJ',
            });
            const authResponse = await request(app.getHttpServer())
                .post('/auth/login') // Ensure this matches your login route
                .send({
                    email: 'other-test@bookshop.com',
                    password: 'test-pass',
                }) // replace with test credentials
                .expect(201);

            const token = authResponse.body.access_token;

            await request(app.getHttpServer())
                .delete('/book/' + book.id)
                .set('Authorization', `Bearer ${token}`)
                .expect(403);

            const books = await app.get(BookService).search();
            expect(books.length).toBe(1);
        });
    });
});
