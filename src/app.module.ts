import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [ConfigModule.forRoot(), AuthModule, UsersModule, PrismaModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
