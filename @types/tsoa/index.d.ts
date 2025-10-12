// Global TSOA Request interface extension
declare global {
  namespace Tsoa {
    interface Request<T = any> {
      context?: T;
      requestId?: string;
      user?: T;
    }
  }
}

// Re-export TSOA types with extensions
declare module '@tsoa/runtime' {
  interface Request<T = any> {
    context?: T;
    requestId?: string;
    user?: T;
  }
}

export {};
