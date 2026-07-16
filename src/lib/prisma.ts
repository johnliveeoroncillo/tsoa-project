import { PrismaClient } from '@prisma/client';
import { omit } from '../utils/object.utils';

const READ_OPERATIONS = new Set([
    'findMany',
    'findFirst',
    'findUnique',
    'count',
]);

function createPrismaClient() {
    const baseClient = new PrismaClient();

    return baseClient.$extends({
        query: {
            $allModels: {
                async $allOperations({
                    operation,
                    args,
                    query,
                }: {
                    operation: string;
                    args: Record<string, any>;
                    query: (args: Record<string, any>) => Promise<unknown>;
                }) {
                    const includeDeleted = args?.includeDeleted === true;

                    const cleanArgs = omit(args ?? {}, ['includeDeleted']);

                    if (READ_OPERATIONS.has(operation) && !includeDeleted) {
                        return query({
                            ...cleanArgs,
                            where: {
                                ...(cleanArgs.where ?? {}),
                                deletedAt: null,
                            },
                        });
                    }

                    return query(cleanArgs);
                },
            },
        },
    });
}

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: ExtendedPrismaClient;
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
