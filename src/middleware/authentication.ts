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

        if (securityName === 'bearer') {
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
                reject(new UnauthorizedException('Invalid or expired token'));
                return;
            }

            // Set user data on request object
            request.context = {
                id: payload.id,
                role: 'user',
            };

            // Check scopes if provided
            if (scopes && scopes.length > 0) {
                const userRole = request.context?.role;
                const hasRequiredScope = userRole && scopes.includes(userRole);
                if (!hasRequiredScope) {
                    reject(
                        new UnauthorizedException(
                            `Insufficient permissions. Required: ${scopes.join(', ')}`,
                        ),
                    );
                    return;
                }
            }

            resolve(payload);
        } else {
            reject(new UnauthorizedException('Unknown security scheme'));
        }
    });
}
