import rateLimit from 'express-rate-limit';
import { AppError } from './error.middleware';

export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    handler: (req, res) => {
      throw new AppError(
        429,
        'RATE_LIMIT_EXCEEDED',
        options.message || 'Too many requests, please try again later'
      );
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Common rate limiters
export const rateLimiters = {
  // Strict limiter for authentication endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts, please try again later'
  }),

  // General API limiter
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
  }),

  // Strict limiter for sensitive operations
  sensitive: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: 'Too many attempts, please try again later'
  })
}; 