import { v4 as uuidv4 } from 'uuid';
import { AppError } from './app.error';
import { logger } from './logger';

interface ResetToken {
  token: string;
  expiresAt: Date;
  userId: string;
}

export class PasswordResetService {
  private static instance: PasswordResetService;
  private resetTokens: Map<string, ResetToken>;
  private readonly tokenExpiryHours: number;

  private constructor() {
    this.resetTokens = new Map();
    this.tokenExpiryHours = 1; // Tokens expire after 1 hour
  }

  public static getInstance(): PasswordResetService {
    if (!PasswordResetService.instance) {
      PasswordResetService.instance = new PasswordResetService();
    }
    return PasswordResetService.instance;
  }

  public generateResetToken(userId: string): string {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.tokenExpiryHours);

    this.resetTokens.set(token, {
      token,
      expiresAt,
      userId,
    });

    logger.info('Password reset token generated', { userId });

    return token;
  }

  public validateResetToken(token: string): string {
    const resetToken = this.resetTokens.get(token);

    if (!resetToken) {
      throw new AppError('Invalid reset token', 400);
    }

    if (resetToken.expiresAt < new Date()) {
      this.resetTokens.delete(token);
      throw new AppError('Reset token has expired', 400);
    }

    return resetToken.userId;
  }

  public invalidateResetToken(token: string): void {
    this.resetTokens.delete(token);
    logger.info('Password reset token invalidated', { token });
  }

  public cleanupExpiredTokens(): void {
    const now = new Date();
    for (const [token, resetToken] of this.resetTokens.entries()) {
      if (resetToken.expiresAt < now) {
        this.resetTokens.delete(token);
      }
    }
  }
}

export const passwordResetService = PasswordResetService.getInstance(); 