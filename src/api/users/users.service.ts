import { Users } from '@prisma/client';
import {
    UsersCreateInput,
    UsersLoginInput,
    UsersLoginResponse,
} from './users.model';
import {
    DuplicateException,
    UnauthorizedException,
} from '../../common/exceptions/http.exceptions';
import { JwtService } from '../../services/jwt.service';
import prisma from '../../lib/prisma';
import { EmailService } from '../../services/email.service';

export class UsersService {
    private readonly emailService: EmailService;
    constructor() {
        this.emailService = new EmailService();
    }

    public async create(user: UsersCreateInput): Promise<Users> {
        const existingUser = await this.findByEmail(user.email);
        if (existingUser) {
            throw new DuplicateException('User with this email already exists');
        }

        user.password = await JwtService.hashPassword(user.password);
        const createdUser = await prisma.users.create({
            data: user,
        });
        return createdUser;
    }

    public async login(user: UsersLoginInput): Promise<UsersLoginResponse> {
        const existingUser = await this.findByEmail(user.email);
        if (!existingUser) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await JwtService.comparePassword(
            user.password,
            existingUser.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const token = JwtService.generateToken({
            id: existingUser.id,
            meta: existingUser,
            role: 'user',
        });
        return {
            user: existingUser,
            token,
        };
    }

    public async findById(id: string): Promise<Users | null> {
        return await prisma.users.findUnique({
            where: { id },
        });
    }

    public async findByEmail(email: string): Promise<Users | null> {
        return await prisma.users.findUnique({
            where: { email },
        });
    }

    public async findAll(): Promise<Users[]> {
        return await prisma.users.findMany();
    }

    public async update(
        id: string,
        data: Partial<UsersCreateInput>,
    ): Promise<Users> {
        return await prisma.users.update({
            where: { id },
            data,
        });
    }

    public async delete(id: string): Promise<Users> {
        return await prisma.users.delete({
            where: { id },
        });
    }

    public async sendTestEmail(requestBody: {
        to: string;
        subject: string;
        template: string;
        data: Record<string, any>;
    }): Promise<void> {
        const { to, subject, template, data } = requestBody;
        return await this.emailService.sendTemplatedEmail(
            to,
            subject,
            template,
            data,
        );
    }
}
