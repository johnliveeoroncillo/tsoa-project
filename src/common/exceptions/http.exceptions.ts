/**
 * Base exception class for HTTP exceptions
 */
export abstract class HttpException extends Error {
    public readonly statusCode: number;
    public readonly message: string;
    public readonly errors?: Record<string, string>;
    constructor(
        message: string,
        statusCode: number,
        errors?: Record<string, string>,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.name = this.constructor.name;
        this.errors = errors;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * 400 Bad Request Exception
 * @example {
 *  "message": "Bad Request",
 *  "statusCode": 400
 * }
 */
export class BadRequestException extends HttpException {
    static statusCode = 400;
    constructor(message: string = 'Bad Request') {
        super(message, BadRequestException.statusCode);
    }
}

/**
 * 401 Unauthorized Exception
 * @example {
 *  "message": "Unauthorized",
 *  "statusCode": 401
 * }
 */
export class UnauthorizedException extends HttpException {
    static statusCode = 401;
    constructor(message: string = 'Unauthorized') {
        super(message, UnauthorizedException.statusCode);
    }
}

/**
 * 402 Payment Required Exception
 * @example {
 *  "message": "Payment Required",
 *  "statusCode": 402
 * }
 */
export class PaymentRequiredException extends HttpException {
    static statusCode = 402;
    constructor(message: string = 'Payment Required') {
        super(message, PaymentRequiredException.statusCode);
    }
}

/**
 * 403 Forbidden Exception
 * @example {
 *  "message": "Forbidden",
 *  "statusCode": 403
 * }
 */
export class ForbiddenException extends HttpException {
    static statusCode = 403;
    constructor(message: string = 'Forbidden') {
        super(message, ForbiddenException.statusCode);
    }
}

/**
 * 404 Not Found Exception
 * @example {
 *  "message": "Not Found",
 *  "statusCode": 404
 * }
 */
export class NotFoundException extends HttpException {
    static statusCode = 404;
    constructor(message: string = 'Not Found') {
        super(message, NotFoundException.statusCode);
    }
}

/**
 * 405 Method Not Allowed Exception
 * @example {
 *  "message": "Method Not Allowed",
 *  "statusCode": 405
 * }
 */
export class MethodNotAllowedException extends HttpException {
    static statusCode = 405;
    constructor(message: string = 'Method Not Allowed') {
        super(message, MethodNotAllowedException.statusCode);
    }
}

/**
 * 406 Not Acceptable Exception
 * @example {
 *  "message": "Not Acceptable",
 *  "statusCode": 406
 * }
 */
export class NotAcceptableException extends HttpException {
    static statusCode = 406;
    constructor(message: string = 'Not Acceptable') {
        super(message, NotAcceptableException.statusCode);
    }
}

/**
 * 407 Proxy Authentication Required Exception
 * @example {
 *  "message": "Proxy Authentication Required",
 *  "statusCode": 407
 * }
 */
export class ProxyAuthenticationRequiredException extends HttpException {
    static statusCode = 407;
    constructor(message: string = 'Proxy Authentication Required') {
        super(message, ProxyAuthenticationRequiredException.statusCode);
    }
}

/**
 * 408 Request Timeout Exception
 * @example {
 *  "message": "Request Timeout",
 *  "statusCode": 408
 * }
 */
export class RequestTimeoutException extends HttpException {
    static statusCode = 408;
    constructor(message: string = 'Request Timeout') {
        super(message, RequestTimeoutException.statusCode);
    }
}

/**
 * 409 Conflict Exception
 * @example {
 *  "message": "Conflict",
 *  "statusCode": 409
 * }
 */
export class ConflictException extends HttpException {
    static statusCode = 409;
    constructor(message: string = 'Conflict') {
        super(message, ConflictException.statusCode);
    }
}

/**
 * 409 Duplicate Exception
 * @example {
 *  "message": "Duplicate email",
 *  "statusCode": 409
 * }
 */
export class DuplicateException extends HttpException {
    static statusCode = 409;
    constructor(message: string = 'Duplicate') {
        super(message, DuplicateException.statusCode);
    }
}

/**
 * 410 Gone Exception
 * @example {
 *  "message": "Gone",
 *  "statusCode": 410
 * }
 */
export class GoneException extends HttpException {
    static statusCode = 410;
    constructor(message: string = 'Gone') {
        super(message, GoneException.statusCode);
    }
}

/**
 * 411 Length Required Exception
 * @example {
 *  "message": "Length Required",
 *  "statusCode": 411
 * }
 */
export class LengthRequiredException extends HttpException {
    static statusCode = 411;
    constructor(message: string = 'Length Required') {
        super(message, LengthRequiredException.statusCode);
    }
}

/**
 * 412 Precondition Failed Exception
 * @example {
 *  "message": "Precondition Failed",
 *  "statusCode": 412
 * }
 */
export class PreconditionFailedException extends HttpException {
    static statusCode = 412;
    constructor(message: string = 'Precondition Failed') {
        super(message, PreconditionFailedException.statusCode);
    }
}

/**
 * 413 Payload Too Large Exception
 * @example {
 *  "message": "Payload Too Large",
 *  "statusCode": 413
 * }
 */
export class PayloadTooLargeException extends HttpException {
    static statusCode = 413;
    constructor(message: string = 'Payload Too Large') {
        super(message, PayloadTooLargeException.statusCode);
    }
}

/**
 * 414 URI Too Long Exception
 * @example {
 *  "message": "URI Too Long",
 *  "statusCode": 414
 * }
 */
export class URITooLongException extends HttpException {
    static statusCode = 414;
    constructor(message: string = 'URI Too Long') {
        super(message, URITooLongException.statusCode);
    }
}

/**
 * 415 Unsupported Media Type Exception
 * @example {
 *  "message": "Unsupported Media Type",
 *  "statusCode": 415
 * }
 */
export class UnsupportedMediaTypeException extends HttpException {
    static statusCode = 415;
    constructor(message: string = 'Unsupported Media Type') {
        super(message, UnsupportedMediaTypeException.statusCode);
    }
}

/**
 * 416 Range Not Satisfiable Exception
 * @example {
 *  "message": "Range Not Satisfiable",
 *  "statusCode": 416
 * }
 */
export class RangeNotSatisfiableException extends HttpException {
    static statusCode = 416;
    constructor(message: string = 'Range Not Satisfiable') {
        super(message, RangeNotSatisfiableException.statusCode);
    }
}

/**
 * 417 Expectation Failed Exception
 * @example {
 *  "message": "Expectation Failed",
 *  "statusCode": 417
 * }
 */
export class ExpectationFailedException extends HttpException {
    static statusCode = 417;
    constructor(message: string = 'Expectation Failed') {
        super(message, ExpectationFailedException.statusCode);
    }
}

/**
 * 418 I'm a teapot Exception (RFC 2324)
 * @example {
 *  "message": "I'm a teapot",
 *  "statusCode": 418
 * }
 */
export class ImATeapotException extends HttpException {
    static statusCode = 418;
    constructor(message: string = "I'm a teapot") {
        super(message, ImATeapotException.statusCode);
    }
}

/**
 * 421 Misdirected Request Exception
 * @example {
 *  "message": "Misdirected Request",
 *  "statusCode": 421
 * }
 */
export class MisdirectedRequestException extends HttpException {
    static statusCode = 421;
    constructor(message: string = 'Misdirected Request') {
        super(message, MisdirectedRequestException.statusCode);
    }
}

/**
 * 422 Unprocessable Entity Exception
 * @example {
 *  "message": "Unprocessable Entity",
 *  "statusCode": 422
 * }
 */
export class UnprocessableEntityException extends HttpException {
    static statusCode = 422;
    constructor(
        message: string = 'Unprocessable Entity',
        errors?: Record<string, string>,
    ) {
        super(message, UnprocessableEntityException.statusCode, errors);
    }
}

/**
 * 423 Locked Exception
 * @example {
 *  "message": "Locked",
 *  "statusCode": 423
 * }
 */
export class LockedException extends HttpException {
    static statusCode = 423;
    constructor(message: string = 'Locked') {
        super(message, LockedException.statusCode);
    }
}

/**
 * 424 Failed Dependency Exception
 * @example {
 *  "message": "Failed Dependency",
 *  "statusCode": 424
 * }
 */
export class FailedDependencyException extends HttpException {
    static statusCode = 424;
    constructor(message: string = 'Failed Dependency') {
        super(message, FailedDependencyException.statusCode);
    }
}

/**
 * 425 Too Early Exception
 * @example {
 *  "message": "Too Early",
 *  "statusCode": 425
 * }
 */
export class TooEarlyException extends HttpException {
    static statusCode = 425;
    constructor(message: string = 'Too Early') {
        super(message, TooEarlyException.statusCode);
    }
}

/**
 * 426 Upgrade Required Exception
 * @example {
 *  "message": "Upgrade Required",
 *  "statusCode": 426
 * }
 */
export class UpgradeRequiredException extends HttpException {
    static statusCode = 426;
    constructor(message: string = 'Upgrade Required') {
        super(message, UpgradeRequiredException.statusCode);
    }
}

/**
 * 428 Precondition Required Exception
 * @example {
 *  "message": "Precondition Required",
 *  "statusCode": 428
 * }
 */
export class PreconditionRequiredException extends HttpException {
    static statusCode = 428;
    constructor(message: string = 'Precondition Required') {
        super(message, PreconditionRequiredException.statusCode);
    }
}

/**
 * 429 Too Many Requests Exception
 * @example {
 *  "message": "Too Many Requests",
 *  "statusCode": 429
 * }
 */
export class TooManyRequestsException extends HttpException {
    static statusCode = 429;
    constructor(message: string = 'Too Many Requests') {
        super(message, TooManyRequestsException.statusCode);
    }
}

/**
 * 431 Request Header Fields Too Large Exception
 * @example {
 *  "message": "Request Header Fields Too Large",
 *  "statusCode": 431
 * }
 */
export class RequestHeaderFieldsTooLargeException extends HttpException {
    static statusCode = 431;
    constructor(message: string = 'Request Header Fields Too Large') {
        super(message, RequestHeaderFieldsTooLargeException.statusCode);
    }
}

/**
 * 451 Unavailable For Legal Reasons Exception
 * @example {
 *  "message": "Unavailable For Legal Reasons",
 *  "statusCode": 451
 * }
 */
export class UnavailableForLegalReasonsException extends HttpException {
    static statusCode = 451;
    constructor(message: string = 'Unavailable For Legal Reasons') {
        super(message, UnavailableForLegalReasonsException.statusCode);
    }
}

/**
 * 500 Internal Server Error Exception
 * @example {
 *  "message": "Internal Server Error",
 *  "statusCode": 500
 * }
 */
export class InternalServerErrorException extends HttpException {
    static statusCode = 500;
    constructor(message: string = 'Internal Server Error') {
        super(message, InternalServerErrorException.statusCode);
    }
}

/**
 * 501 Not Implemented Exception
 * @example {
 *  "message": "Not Implemented",
 *  "statusCode": 501
 * }
 */
export class NotImplementedException extends HttpException {
    static statusCode = 501;
    constructor(message: string = 'Not Implemented') {
        super(message, NotImplementedException.statusCode);
    }
}

/**
 * 502 Bad Gateway Exception
 * @example {
 *  "message": "Bad Gateway",
 *  "statusCode": 502
 * }
 */
export class BadGatewayException extends HttpException {
    static statusCode = 502;
    constructor(message: string = 'Bad Gateway') {
        super(message, BadGatewayException.statusCode);
    }
}

/**
 * 503 Service Unavailable Exception
 * @example {
 *  "message": "Service Unavailable",
 *  "statusCode": 503
 * }
 */
export class ServiceUnavailableException extends HttpException {
    static statusCode = 503;
    constructor(message: string = 'Service Unavailable') {
        super(message, ServiceUnavailableException.statusCode);
    }
}

/**
 * 504 Gateway Timeout Exception
 * @example {
 *  "message": "Gateway Timeout",
 *  "statusCode": 504
 * }
 */
export class GatewayTimeoutException extends HttpException {
    static statusCode = 504;
    constructor(message: string = 'Gateway Timeout') {
        super(message, GatewayTimeoutException.statusCode);
    }
}

/**
 * 505 HTTP Version Not Supported Exception
 * @example {
 *  "message": "HTTP Version Not Supported",
 *  "statusCode": 505
 * }
 */
export class HTTPVersionNotSupportedException extends HttpException {
    static statusCode = 505;
    constructor(message: string = 'HTTP Version Not Supported') {
        super(message, HTTPVersionNotSupportedException.statusCode);
    }
}

/**
 * 506 Variant Also Negotiates Exception
 * @example {
 *  "message": "Variant Also Negotiates",
 *  "statusCode": 506
 * }
 */
export class VariantAlsoNegotiatesException extends HttpException {
    static statusCode = 506;
    constructor(message: string = 'Variant Also Negotiates') {
        super(message, VariantAlsoNegotiatesException.statusCode);
    }
}

/**
 * 507 Insufficient Storage Exception
 * @example {
 *  "message": "Insufficient Storage",
 *  "statusCode": 507
 * }
 */
export class InsufficientStorageException extends HttpException {
    static statusCode = 507;
    constructor(message: string = 'Insufficient Storage') {
        super(message, InsufficientStorageException.statusCode);
    }
}

/**
 * 508 Loop Detected Exception
 * @example {
 *  "message": "Loop Detected",
 *  "statusCode": 508
 * }
 */
export class LoopDetectedException extends HttpException {
    static statusCode = 508;
    constructor(message: string = 'Loop Detected') {
        super(message, LoopDetectedException.statusCode);
    }
}

/**
 * 510 Not Extended Exception
 * @example {
 *  "message": "Not Extended",
 *  "statusCode": 510
 * }
 */
export class NotExtendedException extends HttpException {
    static statusCode = 510;
    constructor(message: string = 'Not Extended') {
        super(message, NotExtendedException.statusCode);
    }
}

/**
 * 511 Network Authentication Required Exception
 * @example {
 *  "message": "Network Authentication Required",
 *  "statusCode": 511
 * }
 */
export class NetworkAuthenticationRequiredException extends HttpException {
    static statusCode = 511;
    constructor(message: string = 'Network Authentication Required') {
        super(message, NetworkAuthenticationRequiredException.statusCode);
    }
}
