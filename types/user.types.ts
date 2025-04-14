import { Document } from 'mongoose';
import { Timestamps, SalaryRange, SocialMedia, JobSearchStatus } from './common';
import { JobType, WorkArrangement, UserAvailability } from '../models/types/enums';

export interface IUser extends Document, Timestamps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicture?: string;
  skills: string[];
  experience: number;
  education?: string;
  portfolioUrl?: string;
  resume?: string;
  location?: string;
  preferredLocations: string[];
  preferredJobTypes: JobType[];
  preferredWorkArrangement: WorkArrangement;
  salaryExpectation?: SalaryRange;
  socialMedia?: SocialMedia;
  availability: UserAvailability;
  jobSearchStatus: JobSearchStatus;
  profileComplete: boolean;
  lastLogin: Date;
  tokens: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
  save(): Promise<this>;
}

export interface IUserModel {
  findByCredentials(email: string, password: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findByRefreshToken(refreshToken: string): Promise<IUser | null>;
}

export interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicture?: string;
  skills?: string[];
  experience?: number;
  education?: string;
  portfolioUrl?: string;
  resume?: string;
  location?: string;
  preferredLocations?: string[];
  preferredJobTypes?: JobType[];
  preferredWorkArrangement?: WorkArrangement;
  salaryExpectation?: SalaryRange;
  socialMedia?: SocialMedia;
  availability?: UserAvailability;
  jobSearchStatus?: JobSearchStatus;
}

export interface UserUpdateInput {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  skills?: string[];
  experience?: number;
  education?: string;
  portfolioUrl?: string;
  resume?: string;
  location?: string;
  preferredLocations?: string[];
  preferredJobTypes?: JobType[];
  preferredWorkArrangement?: WorkArrangement;
  salaryExpectation?: SalaryRange;
  socialMedia?: SocialMedia;
  availability?: UserAvailability;
  jobSearchStatus?: JobSearchStatus;
  profileComplete?: boolean;
}

export interface UserResponse {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicture?: string;
  skills: string[];
  experience: number;
  education?: string;
  portfolioUrl?: string;
  resume?: string;
  location?: string;
  preferredLocations: string[];
  preferredJobTypes: JobType[];
  preferredWorkArrangement: WorkArrangement;
  salaryExpectation?: SalaryRange;
  socialMedia?: SocialMedia;
  availability: UserAvailability;
  jobSearchStatus: JobSearchStatus;
  profileComplete: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
} 