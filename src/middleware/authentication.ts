import { Request } from 'express';
import { JwtService } from '../services/jwt.service';
import { UnauthorizedException } from '../common/exceptions/http.exceptions';

export function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[],
): Promise<unknown> {
    return new Promise((resolve, reject) => {
        console.log('TSOA Authentication middleware');
        console.log('Security name:', securityName);
        console.log('Scopes:', scopes);

        switch (securityName) {
            case 'bearer': {
                const authHeader = request.headers.authorization;
                if (!authHeader) {
                    reject(
                        new UnauthorizedException(
                            'Authorization header is required',
                        ),
                    );
                    return;
                }

                const token = JwtService.extractTokenFromHeader(authHeader);
                if (!token) {
                    reject(
                        new UnauthorizedException(
                            'Invalid authorization format. Use Bearer token',
                        ),
                    );
                    return;
                }

                const payload = JwtService.verifyToken(token);
                if (!payload) {
                    reject(
                        new UnauthorizedException('Invalid or expired token'),
                    );
                    return;
                }

                // Set user data on request object
                request.context = payload;

                // Check scopes if provided
                const userRole = request.context.role;
                const hasRequiredScope =
                    userRole && scopes && scopes.includes(userRole);
                if (!hasRequiredScope) {
                    reject(
                        new UnauthorizedException(
                            'Insufficient permissions. You are not authorized to access this resource.',
                        ),
                    );
                    return;
                }

                resolve(payload);
                break;
            }
            case 'api_key': {
                const apiKey = request.headers['x-api-key'];
                const isAuthenticated = apiKey === process.env.API_KEY;
                if (!isAuthenticated) {
                    reject(new UnauthorizedException());
                    return;
                }
                resolve({});
                break;
            }
            default:
                reject(new UnauthorizedException('Unknown security scheme'));
                break;
        }
    });
}
