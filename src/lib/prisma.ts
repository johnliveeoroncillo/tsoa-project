import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-var
    var prisma: any;
}

function createPrismaClient() {
    return new PrismaClient().$extends({
        query: {
            $allModels: {
                async $allOperations({ operation, args, query }) {
                    // Only apply to operations that support where clause
                    if (['findMany', 'findFirst', 'findUnique', 'count'].includes(operation)) {
                        const argsWithWhere = args as any;
                        if (argsWithWhere.where) {
                            argsWithWhere.where.deletedAt = null;
                        } else {
                            argsWithWhere.where = { deletedAt: null };
                        }
                    }
                    return query(args);
                },
            },
        },
    });
}

// Prevent multiple instances of Prisma Client in development
const prisma = createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

export default prisma;
