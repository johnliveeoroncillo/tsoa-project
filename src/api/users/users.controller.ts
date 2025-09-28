import { Request as ExpressRequest } from 'express';
import Joi from 'joi';
import { Controller, Route, Post, Get, Security, Request, Body } from 'tsoa';
import { UsersService } from './users.service';
import { Users } from '@prisma/client';
import {
    UsersCreateInput,
    UsersLoginInput,
    UsersLoginResponse,
} from './users.model';
import { ValidateBody } from '../../common/decorators';

@Route('users')
export class UsersController extends Controller {
    private readonly usersService: UsersService;
    constructor() {
        super();
        this.usersService = new UsersService();
    }

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
        return this.usersService.findById(request.user.userId);
    }
}
