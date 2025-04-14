import jwt from 'jsonwebtoken';
import { AppError } from './app.error';
import { logger } from './logger';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class JWTService {
  private static instance: JWTService;
  private readonly secret: string;
  private readonly expiresIn: string;
  private readonly refreshExpiresIn: string;

  private constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    if (!process.env.JWT_SECRET) {
      logger.warn('JWT_SECRET not set, using default secret key');
    }
  }

  public static getInstance(): JWTService {
    if (!JWTService.instance) {
      JWTService.instance = new JWTService();
    }
    return JWTService.instance;
  }

  public generateTokens(payload: TokenPayload): { accessToken: string; refreshToken: string } {
    try {
      const accessToken = jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
      const refreshToken = jwt.sign(payload, this.secret, { expiresIn: this.refreshExpiresIn });

      return { accessToken, refreshToken };
    } catch (error) {
      logger.error('Error generating tokens', error as Error);
      throw new AppError('Failed to generate tokens', 500);
    }
  }

  public verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 401);
      }
      logger.error('Error verifying token', error as Error);
      throw new AppError('Failed to verify token', 500);
    }
  }

  public refreshToken(refreshToken: string): { accessToken: string; refreshToken: string } {
    try {
      const payload = this.verifyToken(refreshToken);
      return this.generateTokens(payload);
    } catch (error) {
      logger.error('Error refreshing token', error as Error);
      throw new AppError('Failed to refresh token', 401);
    }
  }
}

export const jwtService = JWTService.getInstance(); 