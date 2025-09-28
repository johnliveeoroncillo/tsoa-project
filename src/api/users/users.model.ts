import { Users } from '@prisma/client';

export type UsersCreateInput = Pick<Users, 'name' | 'email' | 'password'>;

export type UsersLoginInput = Pick<Users, 'email' | 'password'>;
export interface UsersLoginResponse {
    user: Users;
    token: string;
}
