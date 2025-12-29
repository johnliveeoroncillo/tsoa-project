export interface Pagination {
    page: number;
    limit: number;
    offset: number;
    total: number;
    totalPages: number;
    currentPage: number;
    nextPage: boolean;
    previousPage: boolean;
}

export interface PaginatedResponse<T> {
    pagination: Pagination;
    data: T[];
}
