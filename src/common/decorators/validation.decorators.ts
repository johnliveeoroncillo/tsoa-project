import { UnprocessableEntityException } from '../exceptions/http.exceptions';
import Joi from 'joi';

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** TSOA passes `@Request()` as a plain object; pick JSON body, not the Express request. */
function isExpressLikeRequest(value: unknown): boolean {
    if (!isPlainObject(value)) return false;
    return typeof (value as { get?: unknown }).get === 'function';
}

export type ValidateBodyOptions = {
    /** 0-based index of `@Body()` if you need to override detection */
    bodyArgIndex?: number;
};

// Function Decorator Factory
export function ValidateBody(
    validationSchema: Joi.Schema,
    options?: ValidateBodyOptions,
) {
    return function (
        _target: object,
        _propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: unknown[]) {
            let requestBody: unknown;
            if (options?.bodyArgIndex !== undefined) {
                requestBody = args[options.bodyArgIndex];
            } else {
                requestBody = args.find(
                    arg => isPlainObject(arg) && !isExpressLikeRequest(arg),
                );
            }

            if (requestBody === undefined) {
                throw new UnprocessableEntityException('Validation failed', {
                    body: 'Missing request body',
                });
            }

            // Validate the request body against the Joi schema
            const { error } = validationSchema.validate(requestBody, {
                abortEarly: false,
                allowUnknown: false,
            });
            if (error) {
                const errors: Record<string, string> = {};
                error.details.forEach((detail: Joi.ValidationErrorItem) => {
                    const field = detail.path.join('.');
                    errors[field] = detail.message;
                });

                throw new UnprocessableEntityException(
                    'Validation failed',
                    errors,
                );
            }

            // Validation passed, call the original method
            return originalMethod.apply(this, args);
        };
    };
}
