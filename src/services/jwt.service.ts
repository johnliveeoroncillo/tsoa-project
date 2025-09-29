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

    private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

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
}
