import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../types/response.types';

/**
 * Response interceptor middleware that wraps all responses in a generic format
 * This allows controllers to return their original data types while ensuring
 * all HTTP responses follow the {status, message, data} structure
 */
export function responseInterceptor(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    // Store the original json and send methods
    const originalJson = res.json;
    const originalSend = res.send;

    // Override the json method to wrap responses
    res.json = function (body: unknown) {
        // If the body is a Buffer/stream, send it as-is to avoid JSON serialization
        if (Buffer.isBuffer(body)) {
            return originalSend.call(this, body);
        }

        // Skip wrapping if response is already sent (e.g., file downloads using res.send())
        if (res.headersSent) {
            return originalJson.call(this, body);
        }

        // Skip wrapping if this is a file download response
        // Check for file download indicators in headers
        const contentType = res.getHeader('Content-Type');
        const contentDisposition = res.getHeader('Content-Disposition');
        const isFileDownload =
            (contentType &&
                typeof contentType === 'string' &&
                (contentType.includes('application/vnd.openxmlformats') ||
                    contentType.includes('application/octet-stream') ||
                    contentType.includes('application/pdf') ||
                    contentType.includes('application/zip'))) ||
            (contentDisposition &&
                typeof contentDisposition === 'string' &&
                contentDisposition.includes('attachment'));

        if (isFileDownload) {
            return originalJson.call(this, body);
        }

        // Don't wrap if it's already an ApiResponse
        if (isApiResponse(body)) {
            return originalJson.call(this, body);
        }

        // Ensure status is 200 for all responses
        if (res.statusCode === 204) {
            res.statusCode = 200;
        }

        // Handle undefined responses - wrap them in generic format
        if (body === undefined) {
            const wrappedResponse: ApiResponse = {
                status: 200,
                message: getSuccessMessage(200),
                data: null,
            };
            return originalJson.call(this, wrappedResponse);
        }

        // Create the generic response wrapper for all responses
        const wrappedResponse: ApiResponse = {
            status: 200,
            message: getSuccessMessage(200),
            data: body,
        };

        return originalJson.call(this, wrappedResponse);
    };

    next();
}

/**
 * Check if the response body is already an ApiResponse
 */
function isApiResponse(body: unknown): boolean {
    return (
        body !== null &&
        typeof body === 'object' &&
        'status' in body &&
        'message' in body &&
        'data' in body
    );
}

/**
 * Generate appropriate success messages based on status code and endpoint
 */
function getSuccessMessage(statusCode: number): string {
    const statusMessages: { [key: number]: string } = {
        200: 'Success',
        201: 'Created successfully',
        202: 'Accepted',
        204: 'Success',
    };

    const message = statusMessages[statusCode] || 'Success';
    return message;
}
