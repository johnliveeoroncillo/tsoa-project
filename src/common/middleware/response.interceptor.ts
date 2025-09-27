import { Request, Response, NextFunction } from 'express';

/**
 * Response interceptor middleware that wraps all responses in a generic format
 * This allows controllers to return their original data types while ensuring
 * all HTTP responses follow the {status, message, data} structure
 */
export function responseInterceptor(req: Request, res: Response, next: NextFunction) {
  // Store the original json method
  const originalJson = res.json;

  // Override the json method to wrap responses
  res.json = function(body: any) {
    // Don't wrap if it's already an ApiResponse
    if (isApiResponse(body)) {
      return originalJson.call(this, body);
    }

    // Handle void responses - wrap them in generic format
    if (body === undefined || body === null) {
      const wrappedResponse: ApiResponse = {
        status: res.statusCode,
        message: getSuccessMessage(res.statusCode, req.method, req.path),
        data: null
      };
      return originalJson.call(this, wrappedResponse);
    }

    // Create the generic response wrapper for non-void responses
    const wrappedResponse: ApiResponse = {
      status: res.statusCode,
      message: getSuccessMessage(res.statusCode, req.method, req.path),
      data: body
    };

    return originalJson.call(this, wrappedResponse);
  };

  next();
}

/**
 * Check if the response body is already an ApiResponse
 */
function isApiResponse(body: any): boolean {
  return body && 
         typeof body === 'object' && 
         'status' in body && 
         'message' in body && 
         'data' in body;
}

/**
 * Generate appropriate success messages based on status code and endpoint
 */
function getSuccessMessage(statusCode: number, method: string, path: string): string {
  const statusMessages: { [key: number]: string } = {
    200: 'Success',
    201: 'Created successfully',
    202: 'Accepted',
    204: 'No content'
  };

  // Default message based on status code
  let message = statusMessages[statusCode] || 'Success';

  // Customize message based on endpoint
  if (path.includes('/users')) {
    if (method === 'GET' && path.includes('{')) {
      message = 'User retrieved successfully';
    } else if (method === 'GET') {
      message = 'Users retrieved successfully';
    } else if (method === 'POST') {
      message = 'User created successfully';
    } else if (method === 'PUT') {
      message = 'User updated successfully';
    } else if (method === 'DELETE') {
      message = 'User deleted successfully';
    }
  }

  return message;
}
