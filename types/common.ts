import { Document } from 'mongoose';

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface SocialMedia {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface JobSearchStatus {
  isSearching: boolean;
  lastSearchUpdate?: Date;
  preferredIndustries: string[];
}

export interface Location {
  type: 'remote' | 'hybrid' | 'onsite';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseDocument extends Document, Timestamps {} 