import { Types } from 'mongoose';

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  isNegotiable?: boolean;
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

export interface StatusHistory {
  status: string;
  date: Date;
  notes?: string;
  updatedBy?: Types.ObjectId;
}

export interface Document {
  name: string;
  url: string;
  uploadedAt: Date;
}

export interface Interview {
  type: string;
  scheduledDate: Date;
  completedDate?: Date;
  interviewer: string;
  notes?: string;
  feedback?: string;
  status: string;
}

export interface Message {
  sender: Types.ObjectId;
  content: string;
  sentAt: Date;
  read: boolean;
}

export interface Referral {
  name: string;
  relationship: string;
  contact: string;
}

export interface ViewRecord {
  user: Types.ObjectId;
  date: Date;
} 