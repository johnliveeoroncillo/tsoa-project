import type { Response as ExpressResponse } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface JwtPayload {
    id: string;
    username: string;
    meta?: Record<string, unknown>;
    role?: {
        id: string;
        name: string;
    };
    iat?: number;
    exp?: number;
}

export class JwtService {
    private static readonly SECRET_KEY =
        process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    // JWT_EXPIRES_IN in hours (e.g., 24 for 24 hours = 1 day)
    // 60 * 60 = 1 hour (3600 seconds)
    private static readonly EXPIRES_IN = +(process.env.JWT_EXPIRES_IN || 3600); // 1 hour

    // Convert hours to milliseconds for cookie maxAge
    private static readonly COOKIE_MAX_AGE = this.EXPIRES_IN;

    static readonly COOKIE_NAME = process.env.COOKIE_NAME || 'token';

    /**
     * Generate JWT token
     * @param payload User data to encode in token
     * @returns JWT token string
     */
    static generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
        return jwt.sign(payload, this.SECRET_KEY, {
            expiresIn: this.EXPIRES_IN,
        } as jwt.SignOptions);
    }

    /**
     * Verify JWT token
     * @param token JWT token string
     * @returns Decoded payload or null if invalid
     */
    static verifyToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this.SECRET_KEY) as JwtPayload;
        } catch {
            return null;
        }
    }

    /**
     * Hash password using bcrypt
     * @param password Plain text password
     * @returns Hashed password
     */
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }

    /**
     * Compare password with hash
     * @param password Plain text password
     * @param hash Hashed password
     * @returns True if passwords match
     */
    static async comparePassword(
        password: string,
        hash: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Extract token from Authorization header
     * @param authHeader Authorization header value
     * @returns Token string or null
     */
    static extractTokenFromHeader(authHeader: string): string | null {
        return authHeader.replace('Bearer ', ''); // Remove 'Bearer ' prefix
    }

    static setSessionCookie(res: ExpressResponse, token: string, maxAgeSeconds?: number): void {
        // Use setHeader directly - this works regardless of cookie-parser
        // TSOA's TsoaResponse is the Express Response at runtime
        const cookieOptions = [
            `${this.COOKIE_NAME}=${encodeURIComponent(token)}`,
            'HttpOnly',
            `Max-Age=${this.COOKIE_MAX_AGE}`,
            'Path=/',
        ];

        // Set SameSite attribute for cross-origin requests
        // SameSite=None requires Secure flag
        if (process.env.NODE_ENV === 'production') {
            cookieOptions.push('Secure');
            cookieOptions.push('SameSite=None');
        } else {
            // In development, use Lax for same-site or None if cross-origin
            cookieOptions.push('SameSite=Lax');
        }

        const cookieValue = cookieOptions.join('; ');
        res.setHeader('Set-Cookie', cookieValue);
    }

    static clearSessionCookie(res: ExpressResponse): void {
        // Clear cookie by setting expired cookie header
        const cookieValue = `${this.COOKIE_NAME}=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
        res.setHeader('Set-Cookie', cookieValue);
    }
}
