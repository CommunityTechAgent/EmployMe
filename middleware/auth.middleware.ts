import { NextApiRequest, NextApiResponse } from 'next';
import { jwtService } from '../utils/jwt';
import { AppError } from '../utils/app.error';
import { logger } from '../utils/logger';

export const authenticate = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = jwtService.verifyToken(token);

    // Attach user info to request
    (req as any).user = payload;

    logger.info('User authenticated', { userId: payload.userId });
    next();
  } catch (error) {
    logger.error('Authentication failed', error as Error);
    throw error;
  }
};

export const authorize = (roles: string[]) => {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ) => {
    try {
      const user = (req as any).user;

      if (!user) {
        throw new AppError('User not authenticated', 401);
      }

      if (!roles.includes(user.role)) {
        throw new AppError('Insufficient permissions', 403);
      }

      logger.info('User authorized', { userId: user.userId, role: user.role });
      next();
    } catch (error) {
      logger.error('Authorization failed', error as Error);
      throw error;
    }
  };
}; 