import { PrismaClient } from '@prisma/client';
const prismaClienteSingleton = () => {
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClienteSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClienteSingleton();
export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
