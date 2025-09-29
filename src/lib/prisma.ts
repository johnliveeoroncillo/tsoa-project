import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-var, no-undef
    var prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

// Make prisma globally accessible as 'prisma' (not 'globalThis.prisma')
globalThis.prisma = prisma;

export default prisma;
