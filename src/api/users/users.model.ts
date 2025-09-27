import { Users } from '@prisma/client';

export interface UsersCreateInput {
    /**
     * @minLength 1 User name is required
     * @maxLength 100 User name must be less than 100 characters
     * @example "John Doe"
     */
    name: string;

    /**
     * @minLength 1 Email is required
     * @maxLength 255 Email must be less than 255 characters
     * @example "john@example.com"
     */
    email: string;

    /**
     * @minLength 6 Password must be at least 6 characters
     * @maxLength 100 Password must be less than 100 characters
     * @example "password123"
     */
    password: string;
}

export interface UsersLoginInput {
    /**
     * @isEmail Must be a valid email address
     * @pattern ^(.+)@(.+)$ please provide correct email
     * @minLength 1 Email is required
     * @maxLength 255 Email must be less than 255 characters
     * @example "john@example.com"
     */
    email: string;

    /**
     * @minLength 1 Password is required
     * @example "password123"
     */
    password: string;
}

export interface UsersLoginResponse {
    user: Users;
    token: string;
}
