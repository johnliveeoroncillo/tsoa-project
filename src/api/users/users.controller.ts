import { Request as ExpressRequest } from 'express';
import Joi from 'joi';
import {
    Controller,
    Route,
    Post,
    Get,
    Security,
    Request,
    Body,
    Tags,
    Put,
    Path,
    Response,
} from 'tsoa';
import { UsersService } from './users.service';
import { Users } from '@prisma/client';
import type {
    UsersCreateInput,
    UsersLoginInput,
    UsersLoginResponse,
    SendTestEmailInput,
    UsersUpdateInput,
} from './users.model';
import { ValidateBody } from '../../common/decorators';
import {
    DuplicateException,
    UnauthorizedException,
} from '../../common/exceptions';

@Route('users')
@Tags('Users')
export class UsersController extends Controller {
    private readonly usersService: UsersService;
    constructor() {
        super();
        this.usersService = new UsersService();
    }

    /**
     * @summary Create a new user
     */
    @Post()
    @ValidateBody(
        Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    )
    @Response<DuplicateException>('409')
    public async createUser(
        @Body() requestBody: UsersCreateInput,
    ): Promise<Users> {
        return this.usersService.create(requestBody);
    }

    /**
     * @summary Login a user
     */
    @Post('/login')
    @ValidateBody(
        Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    )
    @Response<UnauthorizedException>('401')
    public async loginUser(
        @Body() requestBody: UsersLoginInput,
    ): Promise<UsersLoginResponse> {
        const data = await this.usersService.login(requestBody);
        return data;
    }

    /**
     * @summary Get a user
     */
    @Get()
    @Security('bearer')
    @Response<UnauthorizedException>('401')
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

    @Put('{id}')
    @ValidateBody(
        Joi.object({
            password: Joi.string().required(),
            name: Joi.string().allow('', null),
        }),
    )
    @Security('bearer')
    public async updateUser(
        @Path() id: string,
        @Body() requestBody: UsersUpdateInput,
    ): Promise<Users> {
        return this.usersService.update(id, requestBody);
    }
}
