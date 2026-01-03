import { Controller, Route, Post, Body, Tags, Request, Delete } from 'tsoa';
import { Request as ExpressRequest } from 'express';
import AuthService from './auth.service';
import { ValidateBody } from '../../common/decorators';
import Joi from 'joi';
import { LoginBody, LoginResponse } from './auth.model';
import { JwtService } from '../../services/jwt.service';

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
    private readonly authService: AuthService;

    constructor() {
        super();
        this.authService = new AuthService();
    }

    @Post()
    @ValidateBody(
        Joi.object({
            username: Joi.string().required().label('Username'),
            password: Joi.string().required().label('Password'),
        }),
    )
    public async login(
        @Body() body: LoginBody,
        @Request() req: ExpressRequest,
    ): Promise<Omit<LoginResponse, 'token'>> {
        const response = await this.authService.login(body);
        // Access Express response through req.res (Express provides this reference)
        if (req.res) {
            JwtService.setSessionCookie(req.res, response.token);
        }
        return response;
    }

    @Delete()
    public async logout(@Request() req: ExpressRequest): Promise<void> {
        if (req.res) {
            JwtService.clearSessionCookie(req.res);
        }
    }
}
