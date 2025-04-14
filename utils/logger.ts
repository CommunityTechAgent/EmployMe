import { AppError } from './app.error';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: AppError | Error;
  metadata?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(level: LogLevel, message: string, error?: AppError | Error, metadata?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        ...(error instanceof AppError ? {
          statusCode: error.statusCode,
          isOperational: error.isOperational,
        } : {}),
      } : undefined,
      metadata,
    };
  }

  private log(level: LogLevel, message: string, error?: AppError | Error, metadata?: Record<string, unknown>): void {
    const logEntry = this.formatLog(level, message, error, metadata);
    
    // In development, log to console with colors
    if (this.isDevelopment) {
      const colors = {
        [LogLevel.ERROR]: '\x1b[31m', // Red
        [LogLevel.WARN]: '\x1b[33m',  // Yellow
        [LogLevel.INFO]: '\x1b[36m',  // Cyan
        [LogLevel.DEBUG]: '\x1b[35m', // Magenta
      };
      
      console.log(
        `${colors[level]}[${level.toUpperCase()}] ${logEntry.timestamp}\x1b[0m`,
        message,
        error ? `\nError: ${error.message}` : '',
        metadata ? `\nMetadata: ${JSON.stringify(metadata, null, 2)}` : ''
      );
    } else {
      // In production, log to a file or external service
      // TODO: Implement production logging (e.g., Winston, Loggly, etc.)
      console.log(JSON.stringify(logEntry));
    }
  }

  public error(message: string, error?: AppError | Error, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, error, metadata);
  }

  public warn(message: string, error?: AppError | Error, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, error, metadata);
  }

  public info(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, undefined, metadata);
  }

  public debug(message: string, metadata?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, undefined, metadata);
    }
  }
}

export const logger = Logger.getInstance(); 