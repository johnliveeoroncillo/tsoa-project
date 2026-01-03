import type { Response as ExpressResponse } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface JwtPayload {
    id: string;
    meta?: Record<string, unknown>;
    role?: string;
    iat?: number;
    exp?: number;
}

export class JwtService {
    private static readonly SECRET_KEY =
        process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    // JWT_EXPIRES_IN in hours (e.g., 24 for 24 hours = 1 day)
    private static readonly EXPIRES_IN_HOURS = parseInt(
        process.env.JWT_EXPIRES_IN || '24',
        10,
    );

    // Convert hours to 'Xh' format for jwt.sign (e.g., '24h' for 24 hours)
    private static readonly EXPIRES_IN = `${this.EXPIRES_IN_HOURS}h`;

    // Convert hours to milliseconds for cookie maxAge
    private static readonly COOKIE_MAX_AGE_MS =
        this.EXPIRES_IN_HOURS * 60 * 60 * 1000;

    private static readonly COOKIE_NAME = process.env.COOKIE_NAME || 'token';

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
        if (!authHeader?.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.replace('Bearer ', ''); // Remove 'Bearer ' prefix
    }

    static setSessionCookie(res: ExpressResponse, token: string): void {
        // Use setHeader directly - this works regardless of cookie-parser
        // TSOA's TsoaResponse is the Express Response at runtime
        const maxAgeSeconds = Math.floor(this.COOKIE_MAX_AGE_MS / 1000);
        const cookieOptions = [
            `${this.COOKIE_NAME}=${encodeURIComponent(token)}`,
            'HttpOnly',
            `Max-Age=${maxAgeSeconds}`,
            'Path=/',
        ];
        if (process.env.NODE_ENV === 'production') {
            cookieOptions.push('Secure');
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
