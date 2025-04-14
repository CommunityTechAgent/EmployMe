import mongoose, { Document, Schema } from 'mongoose';
import { Timestamps, SalaryRange, Location } from './types/common';
import { JobType, WorkArrangement, ExperienceLevel } from './types/enums';

export interface IJob extends Document, Timestamps {
  title: string;
  description: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
    description?: string;
  };
  location: Location;
  jobType: JobType;
  workArrangement: WorkArrangement;
  experienceLevel: ExperienceLevel;
  salary: SalaryRange;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  status: 'active' | 'closed' | 'draft';
  postedBy: mongoose.Types.ObjectId;
  applications: mongoose.Types.ObjectId[];
  views: number;
  expiresAt?: Date;
}

const jobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    logo: String,
    website: String,
    description: String
  },
  location: {
    type: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      required: true
    },
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  jobType: {
    type: String,
    enum: Object.values(JobType),
    required: true
  },
  workArrangement: {
    type: String,
    enum: Object.values(WorkArrangement),
    required: true
  },
  experienceLevel: {
    type: String,
    enum: Object.values(ExperienceLevel),
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  skills: [String],
  requirements: [String],
  responsibilities: [String],
  benefits: [String],
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'draft'
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [{
    type: Schema.Types.ObjectId,
    ref: 'Application'
  }],
  views: {
    type: Number,
    default: 0
  },
  expiresAt: Date
}, { timestamps: true });

// Indexes for better query performance
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ 'company.name': 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ expiresAt: 1 });

const Job = mongoose.model<IJob>('Job', jobSchema);
export default Job; 