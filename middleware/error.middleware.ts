import { NextApiRequest, NextApiResponse } from 'next';
import { AppError } from '../utils/app.error';
import { logger } from '../utils/logger';

interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
  errors?: unknown[];
}

export const errorHandler = (
  err: Error | AppError,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Default error response
  const errorResponse: ErrorResponse = {
    status: 'error',
    message: err.message || 'Something went wrong',
  };

  // Log the error
  logger.error('Error occurred', err, {
    path: req.url,
    method: req.method,
    query: req.query,
    body: req.body,
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ...errorResponse,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values((err as any).errors).map(
      (error: any) => error.message
    );
    return res.status(400).json({
      ...errorResponse,
      message: 'Validation Error',
      errors: validationErrors,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      ...errorResponse,
      message: 'Invalid token. Please log in again!',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      ...errorResponse,
      message: 'Your token has expired! Please log in again.',
    });
  }

  // Handle duplicate key errors
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(400).json({
      ...errorResponse,
      message: `Duplicate ${field} value. Please use another value!`,
    });
  }

  // Handle CastError (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      ...errorResponse,
      message: `Invalid ${(err as any).path}: ${(err as any).value}`,
    });
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      ...errorResponse,
      stack: err.stack,
    });
  }

  // Production error response
  return res.status(500).json({
    ...errorResponse,
    message: 'Something went wrong!',
  });
}; 