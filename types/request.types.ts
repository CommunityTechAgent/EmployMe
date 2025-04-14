import { Request } from 'express';
import { Document } from 'mongoose';
import { IUser } from './user.types';
import { ParsedQs } from 'qs';
import { Multer } from 'multer';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  role: 'job_seeker' | 'employer' | 'admin';
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    skills?: string[];
    experience?: string;
    education?: string;
  };
  company?: {
    name?: string;
    description?: string;
    website?: string;
    industry?: string;
    size?: string;
    location?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

export interface PaginationQuery extends ParsedQs {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | string[] | undefined;
}

export interface PaginatedRequest extends Request {
  query: PaginationQuery;
}

export interface ErrorRequest extends Request {
  error?: Error;
}

export interface ValidationRequest extends Request {
  validatedData?: any;
}

export interface FileUploadRequest extends Request {
  file?: Multer.File;
  files?: Multer.File[];
}

export interface SearchQuery extends PaginationQuery {
  q?: string;
  filters?: string;
}

export interface SearchRequest extends Request {
  query: SearchQuery;
} 