import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { BookService } from './book/book.service';
import { BookController } from './book/book.controller';
import { BookModule } from './book/book.module';

@Module({
    imports: [ConfigModule.forRoot({
        envFilePath: process.env.NODE_ENV === 'test' ? ['.env.test', '.env'] : '.env'
    }), AuthModule, UsersModule, PrismaModule, BookModule],
    controllers: [AppController, BookController],
    providers: [BookService],
})
export class AppModule {}
