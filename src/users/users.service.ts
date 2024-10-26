import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync } from 'bcryptjs';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(data: Omit<User, 'id'>) {
        // Check if email exists in the database
        const existingUser = await this.prisma.user.findFirst({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        return await this.prisma.user
            .create({
                data: {
                    email: data.email,
                    name: data.name,
                    pseudonym: data.pseudonym,
                    password: hashSync(data.password),
                },
            });
    }

    async findOne(email: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: {
                email: email,
            },
        });
    }
}
