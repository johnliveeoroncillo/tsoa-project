import { Pagination } from '../common/interface/pagination.interface';

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export interface SortValue {
    orderBy?: Record<string, SortOrder>;
}

export function calculatePagination(
    total: number,
    page: number = 1,
    limit: number = 10,
): Pagination {
    const totalPages = Math.ceil(total / limit);
    const currentPage = page;
    const nextPage = currentPage < totalPages;
    const previousPage = currentPage > 1 ? true : false;
    return {
        page: currentPage,
        limit,
        offset: (currentPage - 1) * limit,
        total,
        totalPages,
        currentPage,
        nextPage,
        previousPage,
    };
}

export function sortValue(sort?: string): SortValue {
    if (!sort) {
        return {
            orderBy: undefined,
        };
    }
    const [sortKey, sortOrder] = sort.split(':');
    if (!sortKey) {
        return {
            orderBy: undefined,
        };
    }
    return {
        orderBy: {
            [sortKey]: (sortOrder ?? SortOrder.ASC).toLowerCase() as SortOrder,
        },
    };
}

export function searchValue(search?: string): Record<string, string> {
    if (!search) {
        return {};
    }
    const [searchKey, searchValue] = search.split(':');
    if (!searchKey || !searchValue) {
        return {};
    }
    return {
        [searchKey]: searchValue,
    } as Record<string, string>;
}
