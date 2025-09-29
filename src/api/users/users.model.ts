import { Users } from '@prisma/client';

/**
 * @example {
 *  "name": "John Doe",
 *  "email": "test@test.com",
 *  "password": "password"
 * }
 */
export type UsersCreateInput = Pick<Users, 'name' | 'email' | 'password'>;

/**
 * @example {
 *  "email": "test@test.com",
 *  "password": "password"
 * }
 */
export type UsersLoginInput = Pick<Users, 'email' | 'password'>;

/**
 * @example {
 *  "user": {
 *    "id": "1",
 *    "name": "John Doe",
 *    "email": "test@test.com"
 *  },
 *  "token": "token"
 * }
 */
export interface UsersLoginResponse {
    user: Users;
    token: string;
}

/**
 * @example {
 *  "to": "test@test.com",
 *  "subject": "Test Email",
 *  "template": "test",
 *  "data": { "name": "John Doe", "from": "John Doe" }
 * }
 */
export interface SendTestEmailInput {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
}
