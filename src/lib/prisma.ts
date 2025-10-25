const { PrismaClient } = require('@prisma/client');
import { omit } from '../utils/object.utils';

declare global {
    // eslint-disable-next-line no-var
    var prisma: any;
}

function createPrismaClient() {
    const baseClient = new PrismaClient();
    
    const extendedClient = baseClient.$extends({
        query: {
            $allModels: {
                async $allOperations({ operation, args, query }: { operation: string; args: any; query: any }) {
                    // Only apply to operations that support where clause
                    if (['findMany', 'findFirst', 'findUnique', 'count'].includes(operation)) {
                        const argsWithWhere = args as any;
                        // Only add deletedAt filter if includeDeleted is not true
                        if (!argsWithWhere.includeDeleted) {
                            if (argsWithWhere.where) {
                                argsWithWhere.where.deletedAt = null;
                            } else {
                                argsWithWhere.where = { deletedAt: null };
                            }
                        }
                    }
                    return query(omit(args, ['includeDeleted']));
                },
            },
        },
    });

    return extendedClient;
}

// Prevent multiple instances of Prisma Client in development
const prisma = createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

export default prisma;
