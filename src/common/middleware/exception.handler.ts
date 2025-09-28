import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../common/exceptions/http.exceptions';
import { ApiResponse } from '../../types/response.types';

/**
 * Exception handler middleware that catches HttpExceptions and other errors
 * and formats them according to the generic response structure
 */
export function exceptionHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
): Response | void {
    // If it's an HttpException, handle it with our generic response format
    if (err instanceof HttpException) {
        const response: ApiResponse = {
            status: err.statusCode,
            message: err.message,
            data: null,
            ...(err.errors && { errors: err.errors }),
        };

        return res.status(err.statusCode).json(response);
    }

    // If it's a regular Error, handle it as 500
    if (err instanceof Error) {
        console.error(`Unhandled Error for ${req.path}:`, err.message);

        const response: ApiResponse = {
            status: 500,
            message: err.message ?? 'Internal Server Error',
            data: null,
        };

        return res.status(500).json(response);
    }

    // If it's an unknown error type, pass it to the next error handler
    next(err);
}
