/**
 * Base exception class for HTTP exceptions
 */
export abstract class HttpException extends Error {
  public readonly statusCode: number;
  public readonly message: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * 400 Bad Request Exception
 */
export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized Exception
 */
export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * 402 Payment Required Exception
 */
export class PaymentRequiredException extends HttpException {
  constructor(message: string = 'Payment Required') {
    super(message, 402);
  }
}

/**
 * 403 Forbidden Exception
 */
export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * 404 Not Found Exception
 */
export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}

/**
 * 405 Method Not Allowed Exception
 */
export class MethodNotAllowedException extends HttpException {
  constructor(message: string = 'Method Not Allowed') {
    super(message, 405);
  }
}

/**
 * 406 Not Acceptable Exception
 */
export class NotAcceptableException extends HttpException {
  constructor(message: string = 'Not Acceptable') {
    super(message, 406);
  }
}

/**
 * 407 Proxy Authentication Required Exception
 */
export class ProxyAuthenticationRequiredException extends HttpException {
  constructor(message: string = 'Proxy Authentication Required') {
    super(message, 407);
  }
}

/**
 * 408 Request Timeout Exception
 */
export class RequestTimeoutException extends HttpException {
  constructor(message: string = 'Request Timeout') {
    super(message, 408);
  }
}

/**
 * 409 Conflict Exception
 */
export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}

/**
 * 410 Gone Exception
 */
export class GoneException extends HttpException {
  constructor(message: string = 'Gone') {
    super(message, 410);
  }
}

/**
 * 411 Length Required Exception
 */
export class LengthRequiredException extends HttpException {
  constructor(message: string = 'Length Required') {
    super(message, 411);
  }
}

/**
 * 412 Precondition Failed Exception
 */
export class PreconditionFailedException extends HttpException {
  constructor(message: string = 'Precondition Failed') {
    super(message, 412);
  }
}

/**
 * 413 Payload Too Large Exception
 */
export class PayloadTooLargeException extends HttpException {
  constructor(message: string = 'Payload Too Large') {
    super(message, 413);
  }
}

/**
 * 414 URI Too Long Exception
 */
export class URITooLongException extends HttpException {
  constructor(message: string = 'URI Too Long') {
    super(message, 414);
  }
}

/**
 * 415 Unsupported Media Type Exception
 */
export class UnsupportedMediaTypeException extends HttpException {
  constructor(message: string = 'Unsupported Media Type') {
    super(message, 415);
  }
}

/**
 * 416 Range Not Satisfiable Exception
 */
export class RangeNotSatisfiableException extends HttpException {
  constructor(message: string = 'Range Not Satisfiable') {
    super(message, 416);
  }
}

/**
 * 417 Expectation Failed Exception
 */
export class ExpectationFailedException extends HttpException {
  constructor(message: string = 'Expectation Failed') {
    super(message, 417);
  }
}

/**
 * 418 I'm a teapot Exception (RFC 2324)
 */
export class ImATeapotException extends HttpException {
  constructor(message: string = "I'm a teapot") {
    super(message, 418);
  }
}

/**
 * 421 Misdirected Request Exception
 */
export class MisdirectedRequestException extends HttpException {
  constructor(message: string = 'Misdirected Request') {
    super(message, 421);
  }
}

/**
 * 422 Unprocessable Entity Exception
 */
export class UnprocessableEntityException extends HttpException {
  constructor(message: string = 'Unprocessable Entity') {
    super(message, 422);
  }
}

/**
 * 423 Locked Exception
 */
export class LockedException extends HttpException {
  constructor(message: string = 'Locked') {
    super(message, 423);
  }
}

/**
 * 424 Failed Dependency Exception
 */
export class FailedDependencyException extends HttpException {
  constructor(message: string = 'Failed Dependency') {
    super(message, 424);
  }
}

/**
 * 425 Too Early Exception
 */
export class TooEarlyException extends HttpException {
  constructor(message: string = 'Too Early') {
    super(message, 425);
  }
}

/**
 * 426 Upgrade Required Exception
 */
export class UpgradeRequiredException extends HttpException {
  constructor(message: string = 'Upgrade Required') {
    super(message, 426);
  }
}

/**
 * 428 Precondition Required Exception
 */
export class PreconditionRequiredException extends HttpException {
  constructor(message: string = 'Precondition Required') {
    super(message, 428);
  }
}

/**
 * 429 Too Many Requests Exception
 */
export class TooManyRequestsException extends HttpException {
  constructor(message: string = 'Too Many Requests') {
    super(message, 429);
  }
}

/**
 * 431 Request Header Fields Too Large Exception
 */
export class RequestHeaderFieldsTooLargeException extends HttpException {
  constructor(message: string = 'Request Header Fields Too Large') {
    super(message, 431);
  }
}

/**
 * 451 Unavailable For Legal Reasons Exception
 */
export class UnavailableForLegalReasonsException extends HttpException {
  constructor(message: string = 'Unavailable For Legal Reasons') {
    super(message, 451);
  }
}

/**
 * 500 Internal Server Error Exception
 */
export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500);
  }
}

/**
 * 501 Not Implemented Exception
 */
export class NotImplementedException extends HttpException {
  constructor(message: string = 'Not Implemented') {
    super(message, 501);
  }
}

/**
 * 502 Bad Gateway Exception
 */
export class BadGatewayException extends HttpException {
  constructor(message: string = 'Bad Gateway') {
    super(message, 502);
  }
}

/**
 * 503 Service Unavailable Exception
 */
export class ServiceUnavailableException extends HttpException {
  constructor(message: string = 'Service Unavailable') {
    super(message, 503);
  }
}

/**
 * 504 Gateway Timeout Exception
 */
export class GatewayTimeoutException extends HttpException {
  constructor(message: string = 'Gateway Timeout') {
    super(message, 504);
  }
}

/**
 * 505 HTTP Version Not Supported Exception
 */
export class HTTPVersionNotSupportedException extends HttpException {
  constructor(message: string = 'HTTP Version Not Supported') {
    super(message, 505);
  }
}

/**
 * 506 Variant Also Negotiates Exception
 */
export class VariantAlsoNegotiatesException extends HttpException {
  constructor(message: string = 'Variant Also Negotiates') {
    super(message, 506);
  }
}

/**
 * 507 Insufficient Storage Exception
 */
export class InsufficientStorageException extends HttpException {
  constructor(message: string = 'Insufficient Storage') {
    super(message, 507);
  }
}

/**
 * 508 Loop Detected Exception
 */
export class LoopDetectedException extends HttpException {
  constructor(message: string = 'Loop Detected') {
    super(message, 508);
  }
}

/**
 * 510 Not Extended Exception
 */
export class NotExtendedException extends HttpException {
  constructor(message: string = 'Not Extended') {
    super(message, 510);
  }
}

/**
 * 511 Network Authentication Required Exception
 */
export class NetworkAuthenticationRequiredException extends HttpException {
  constructor(message: string = 'Network Authentication Required') {
    super(message, 511);
  }
}
