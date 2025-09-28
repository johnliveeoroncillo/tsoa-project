import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function requestLogger(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const { headers } = req;

    const requestId = headers.requestId || randomUUID();

    // Log incoming request
    console.log(
        `[${timestamp}] [${requestId}] ${req.method} ${req.originalUrl} - [START] >>>> Incoming request`,
    );
    console.log(`[${timestamp}] [${requestId}] Headers:`, {
        'user-agent': req.get('User-Agent'),
        'content-type': req.get('Content-Type'),
        authorization: req.get('Authorization') ? 'Bearer ***' : 'None',
        'x-forwarded-for': req.get('X-Forwarded-For'),
        'x-real-ip': req.get('X-Real-IP'),
    });

    // Log request body (if present and not too large)
    if (req.body && Object.keys(req.body).length > 0) {
        const bodySize = JSON.stringify(req.body).length;
        if (bodySize < 1000) {
            // Only log small bodies to avoid spam
            console.log(
                `[${timestamp}] [${requestId}] Request body:`,
                req.body,
            );
        } else {
            console.log(
                `[${timestamp}] [${requestId}] Request body: [${bodySize} characters - too large to log]`,
            );
        }
    }

    // Log query parameters
    if (req.query && Object.keys(req.query).length > 0) {
        console.log(`[${timestamp}] [${requestId}] Query params:`, req.query);
    }

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any, cb?: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const timestamp = new Date().toISOString();

        console.log(
            `[${timestamp}] [${requestId}] ${req.method} ${req.originalUrl} - Response: ${res.statusCode} (${duration}ms)`,
        );

        // Log response body if it's JSON and not too large
        if (chunk && res.get('Content-Type')?.includes('application/json')) {
            try {
                const responseBody = JSON.parse(chunk.toString());
                const bodySize = JSON.stringify(responseBody).length;
                if (bodySize < 1000) {
                    console.log(
                        `[${timestamp}] [${requestId}] Response body:`,
                        responseBody,
                    );
                } else {
                    console.log(
                        `[${timestamp}] [${requestId}] Response body: [${bodySize} characters - too large to log]`,
                    );
                }
            } catch {
                // Not JSON or parsing failed, just log size
                console.log(
                    `[${timestamp}] [${requestId}] Response body: [${chunk?.length || 0} characters]`,
                );
            }
        }

        console.log(
            `[${timestamp}] [${requestId}] ${req.method} ${req.originalUrl} - [END] <<<< Response: ${res.statusCode} (${duration}ms)`,
        );

        // Call original end method and return its result
        return originalEnd.call(this, chunk, encoding, cb);
    };

    next();
}
