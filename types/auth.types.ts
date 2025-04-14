import { IUser } from './user.types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: IUser;
  tokens: AuthTokens;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TokenPayload {
  userId: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: IUser;
  token?: string;
}

export interface AuthConfig {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  jwtSecret: string;
  refreshTokenSecret: string;
}

export interface TokenValidationResult {
  isValid: boolean;
  payload?: TokenPayload;
  error?: string;
} 