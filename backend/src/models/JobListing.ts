import mongoose, { Document, Schema } from 'mongoose';

export interface IJobListing extends Document {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  postedAt: Date;
  expiresAt: Date;
  status: 'active' | 'expired' | 'filled';
  source: string;
  url: string;
}

const jobListingSchema = new Schema<IJobListing>(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [String],
    skills: [String],
    location: {
      type: String,
      required: true,
      index: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: true,
      index: true,
    },
    remote: {
      type: Boolean,
      default: false,
      index: true,
    },
    postedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'filled'],
      default: 'active',
      index: true,
    },
    source: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
jobListingSchema.index({ status: 1, expiresAt: 1 });
jobListingSchema.index({ type: 1, remote: 1, location: 1 });
jobListingSchema.index({ skills: 1, status: 1 });

export const JobListing = mongoose.model<IJobListing>('JobListing', jobListingSchema); 