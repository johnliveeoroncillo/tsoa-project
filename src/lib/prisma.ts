import { Prisma, PrismaClient } from '@prisma/client';

type ArgsWithIncludeDeleted<T> = T & { includeDeleted?: boolean };

function parseSoftDeleteArgs<T extends object>(
    args: ArgsWithIncludeDeleted<T>,
) {
    const { includeDeleted, ...rest } = args as ArgsWithIncludeDeleted<T> & {
        includeDeleted?: boolean;
    };
    return {
        includeDeleted: includeDeleted === true,
        rest: rest as T,
    };
}

function withNotDeletedWhere<T extends { where?: object | null }>(args: T): T {
    return {
        ...args,
        where: {
            ...(args.where ?? {}),
            deletedAt: null,
        },
    };
}

function toClientDelegateName(model: string): string {
    return model.charAt(0).toLowerCase() + model.slice(1);
}

const softDeleteExtension = Prisma.defineExtension(client =>
    client.$extends({
        name: 'softDelete',
        model: {
            $allModels: {
                async softDelete<T>(
                    this: T,
                    args: {
                        where: Prisma.Args<T, 'update'>['where'];
                    },
                ): Promise<
                    Prisma.Result<
                        T,
                        {
                            where: Prisma.Args<T, 'update'>['where'];
                            data: { deletedAt: Date };
                        },
                        'update'
                    >
                > {
                    const ctx = Prisma.getExtensionContext(this);
                    return (ctx as any).update({
                        where: args.where,
                        data: { deletedAt: new Date() },
                    });
                },

                async softDeleteMany<T>(
                    this: T,
                    args: {
                        where?: Prisma.Args<T, 'updateMany'>['where'];
                    } = {},
                ): Promise<Prisma.BatchPayload> {
                    const ctx = Prisma.getExtensionContext(this);
                    return (ctx as any).updateMany({
                        where: args.where,
                        data: { deletedAt: new Date() },
                    });
                },
            },
        },
        query: {
            $allModels: {
                async findMany({ args, query }) {
                    const { includeDeleted, rest } = parseSoftDeleteArgs(args);
                    if (includeDeleted) {
                        return query(rest);
                    }
                    return query(withNotDeletedWhere(rest));
                },

                async findFirst({ args, query }) {
                    const { includeDeleted, rest } = parseSoftDeleteArgs(args);
                    if (includeDeleted) {
                        return query(rest);
                    }
                    return query(withNotDeletedWhere(rest));
                },

                async findFirstOrThrow({ args, query }) {
                    const { includeDeleted, rest } = parseSoftDeleteArgs(args);
                    if (includeDeleted) {
                        return query(rest);
                    }
                    return query(withNotDeletedWhere(rest));
                },

                async count({ args, query }) {
                    const { includeDeleted, rest } = parseSoftDeleteArgs(args);
                    if (includeDeleted) {
                        return query(rest);
                    }
                    return query(withNotDeletedWhere(rest));
                },

                async findUnique({ model, args, query }) {
                    const { includeDeleted, rest } = parseSoftDeleteArgs(args);
                    if (includeDeleted) {
                        return query(rest);
                    }

                    // deletedAt is not part of unique constraints — use findFirst.
                    const delegate = toClientDelegateName(model);
                    return (client as any)[delegate].findFirst(
                        withNotDeletedWhere(rest),
                    );
                },

                async findUniqueOrThrow({ model, args, query }) {
                    const { includeDeleted, rest } = parseSoftDeleteArgs(args);
                    if (includeDeleted) {
                        return query(rest);
                    }

                    const delegate = toClientDelegateName(model);
                    return (client as any)[delegate].findFirstOrThrow(
                        withNotDeletedWhere(rest),
                    );
                },
            },
        },
    }),
);

function createPrismaClient() {
    return new PrismaClient().$extends(softDeleteExtension);
}

export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: ExtendedPrismaClient;
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;

/**
 * Pass read args with optional includeDeleted without breaking Prisma Exact types.
 * Runtime extension strips this flag and skips deletedAt filtering when true.
 */
export type WithIncludeDeleted<T> = T & { includeDeleted?: boolean };
