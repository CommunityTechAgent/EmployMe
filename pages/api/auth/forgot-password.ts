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

    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    // TODO: Implement actual user lookup
    // This is a mock implementation
    const mockUser = {
      id: '1',
      email: 'test@example.com'
    };

    if (email !== mockUser.email) {
      // For security reasons, we don't reveal if the email exists
      logger.info('Password reset requested for non-existent email', { email });
      return res.status(200).json({
        status: 'success',
        message: 'If an account exists with this email, a password reset link has been sent'
      });
    }

    const resetToken = passwordResetService.generateResetToken(mockUser.id);

    // TODO: Implement email sending
    // This is a mock implementation
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    logger.info('Password reset link generated', { 
      userId: mockUser.id,
      resetUrl 
    });

    res.status(200).json({
      status: 'success',
      message: 'If an account exists with this email, a password reset link has been sent'
    });
  } catch (error) {
    errorHandler(error as Error, req, res);
  }
} 