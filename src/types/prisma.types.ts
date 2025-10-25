
// Extend Prisma argument types to include includeDeleted
declare module '@prisma/client/runtime/library' {
    export namespace Prisma {
        interface FindFirstArgs {
            includeDeleted?: boolean;
        }
        interface FindManyArgs {
            includeDeleted?: boolean;
        }
        interface FindUniqueArgs {
            includeDeleted?: boolean;
        }
        interface CountArgs {
            includeDeleted?: boolean;
        }
    }
}
