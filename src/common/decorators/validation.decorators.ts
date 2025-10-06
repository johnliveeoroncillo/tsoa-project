import { UnprocessableEntityException } from '../exceptions/http.exceptions';
import Joi from 'joi';

// Function Decorator Factory
export function ValidateBody(validationSchema: Joi.Schema) {
    return function (
        _target: object,
        _propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: unknown[]) {
            // Find the first plain object among parameters as the request body
            const requestBody = args.find(
                arg =>
                    arg !== null &&
                    typeof arg === 'object' &&
                    !Array.isArray(arg),
            );

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
