import { NextApiRequest, NextApiResponse } from 'next';
import { jwtService } from '../../../utils/jwt';
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

    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // TODO: Implement actual user authentication
    // This is a mock implementation
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'user'
    };

    if (email !== mockUser.email || password !== 'password') {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = jwtService.generateTokens({
      userId: mockUser.id,
      email: mockUser.email,
      role: mockUser.role
    });

    logger.info('User signed in', { userId: mockUser.id });

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        },
        tokens
      }
    });
  } catch (error) {
    errorHandler(error as Error, req, res);
  }
} 