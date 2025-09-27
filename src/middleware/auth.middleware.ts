import * as express from "express";
import { NextFunction } from "express";
// import { JwtService } from '../services/jwt.service';
// import { UnauthorizedException } from '../exceptions/http.exceptions';


export async function BearerAuth(req: express.Request, _res: express.Response, next: NextFunction) {
    console.log("BearerAuth middleware");

    // const authHeader = req.headers.authorization;
    
    // if (!authHeader) {
    //     throw new UnauthorizedException('Authorization header is required');
    // }

    // const token = JwtService.extractTokenFromHeader(authHeader);
    
    // if (!token) {
    //     throw new UnauthorizedException('Invalid authorization format. Use Bearer token');
    // }

    // const payload = JwtService.verifyToken(token);
    
    // if (!payload) {
    //     throw new UnauthorizedException('Invalid or expired token');
    // }

    // Add user data to request object
    req.user = {
        id: '1',
        name: "John Doe", // In real app, get from database
        email: 'john.doe@example.com',
    };
    
    next();
}