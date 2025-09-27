/**
 * Generic API response structure
 * @template T The type of data being returned
 */
export interface ApiResponse<T = unknown> {
    /**
     * HTTP status code
     * @isInt
     */
    status: number;

    /**
     * Response message
     * @isString
     */
    message: string;

    /**
     * Response data
     */
    data: T;

    /**
     * Response errors
     */
    errors?: Record<string, string>;
}
