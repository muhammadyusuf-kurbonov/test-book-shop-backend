import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto, UpdateBookDto } from './book.dto';

@Injectable()
export class BookService {
    constructor(private prisma: PrismaService) {}

    async create(
        createBookDto: CreateBookDto,
        author: User,
        coverImage?: Express.Multer.File,
    ) {
        return await this.prisma.book.create({
            data: {
                description: createBookDto.description,
                title: createBookDto.title,
                price: createBookDto.price,
                coverImage: coverImage?.filename ?? createBookDto.coverImage,
                author: {
                    connect: {
                        id: author.id,
                    },
                },
            },
            include: {
                author: true
            }
        });
    }

    async search(search?: string) {
        if (!search) {
            return await this.prisma.book.findMany({
                include: {
                    author: true,
                },
            });
        }

        return await this.prisma.book.findMany({
            where: {
                OR: [
                    { title: { contains: search } },
                    { description: { contains: search } },
                ],
            },
            include: {
                author: true,
            },
        });
    }

    async findOne(id: string) {
        return await this.prisma.book.findFirst({
            where: {
                id,
            },
            include: {
                author: true,
            },
        });
    }

    async update(
        id: string,
        updateBookDto: UpdateBookDto,
        coverImage: Express.Multer.File | undefined,
        user: User,
    ) {
        const book = await this.findOne(id);

        if (book?.authorId !== user.id) {
            throw new ForbiddenException();
        }

        return await this.prisma.book.update({
            where: {
                id,
                authorId: user.id,
            },
            data: {
                ...updateBookDto,
                coverImage: coverImage?.filename,
            },
            include: { author: true },
        });
    }

    async remove(id: string, user: User) {
        const book = await this.findOne(id);

        if (book?.authorId !== user.id) {
            throw new ForbiddenException();
        }

        return await this.prisma.book.delete({
            where: {
                id,
                authorId: user.id,
            },
        });
    }
}
