import { PrismaClient } from '@prisma/client';

export default async function () {
    const prisma = new PrismaClient();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
}
