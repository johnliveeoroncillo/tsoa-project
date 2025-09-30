import { Request as ExpressRequest } from 'express';
import Joi from 'joi';
import { Controller, Route, Post, Get, Security, Request, Body, Tags } from 'tsoa';
import { UsersService } from './users.service';
import { Users } from '@prisma/client';
import type {
    UsersCreateInput,
    UsersLoginInput,
    UsersLoginResponse,
    SendTestEmailInput,
} from './users.model';
import { ValidateBody } from '../../common/decorators';

@Route('users')
@Tags('Users')
export class UsersController extends Controller {
    private readonly usersService: UsersService;
    constructor() {
        super();
        this.usersService = new UsersService();
    }

    /**
     *
     * @param DuplicateException - Duplicate email
     */
    @Post()
    @ValidateBody(
        Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    )
    public async createUser(
        @Body() requestBody: UsersCreateInput,
    ): Promise<Users> {
        return this.usersService.create(requestBody);
    }

    /**
     *
     * @param UnauthorizedException - Invalid email or password
     */
    @Post('/login')
    @ValidateBody(
        Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    )
    public async loginUser(
        @Body() requestBody: UsersLoginInput,
    ): Promise<UsersLoginResponse> {
        return this.usersService.login(requestBody);
    }

    @Get()
    @Security('bearer')
    public async getUser(
        @Request() request: ExpressRequest,
    ): Promise<Users | null> {
        return this.usersService.findById(request.context.id);
    }

    /**
     * @summary Send a test email
     */
    @Post('/send-test-email')
    @ValidateBody(
        Joi.object({
            to: Joi.string().email().required(),
            subject: Joi.string().required(),
            template: Joi.string().required(),
            data: Joi.object().required(),
        }),
    )
    public async sendTestEmail(
        @Body() requestBody: SendTestEmailInput,
    ): Promise<{ message: string }> {
        await this.usersService.sendTestEmail(requestBody);
        return { message: 'Email sent successfully' };
    }
}
