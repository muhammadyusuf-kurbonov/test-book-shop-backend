import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(data: Omit<User, 'id'>) {
        return await this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                pseudonym: data.pseudonym,
                password: hashSync(data.password),
            }
        })
    }

    async findOne(email: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: {
                email: email
            }
        });
    }
}
