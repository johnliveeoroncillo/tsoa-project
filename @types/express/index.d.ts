// Global Express Request interface extension
declare global {
  namespace Express {
    interface Request<T = any> {
      user?: T;
      headers?: {
        requestId?: string;
      }
    }
  }
}

// Global API Response interface
declare global {
  interface ApiResponse<T = any> {
    /**
     * HTTP status code
     */
    status: number;
    
    /**
     * Response message
     */
    message: string;
    
    /**
     * Response data
     */
    data: T;

    /**
     * Response errors
     */
    errors?: any;
  }
}

export {};