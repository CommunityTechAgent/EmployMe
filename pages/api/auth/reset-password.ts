import { NextApiRequest, NextApiResponse } from 'next';
import { passwordResetService } from '../../../utils/password-reset';
import { AppError } from '../../../utils/app.error';
import { logger } from '../../../utils/logger';
import { errorHandler } from '../../../middleware/error.middleware';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      throw new AppError('Method not allowed', 405);
    }

    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      throw new AppError('Token, password, and confirm password are required', 400);
    }

    if (password !== confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }

    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400);
    }

    const userId = passwordResetService.validateResetToken(token);

    // TODO: Implement actual password update
    // This is a mock implementation
    logger.info('Password reset successful', { userId });

    // Invalidate the reset token after successful password reset
    passwordResetService.invalidateResetToken(token);

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    errorHandler(error as Error, req, res);
  }
} 