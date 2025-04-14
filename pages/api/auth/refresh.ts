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

    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const tokens = jwtService.refreshToken(refreshToken);

    logger.info('Tokens refreshed');

    res.status(200).json({
      status: 'success',
      data: { tokens }
    });
  } catch (error) {
    errorHandler(error as Error, req, res);
  }
} 