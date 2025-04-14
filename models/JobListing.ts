import mongoose, { Document, Schema } from 'mongoose';
import { AppError } from '../utils/app.error';
import { logger } from '../utils/logger';
import { Timestamps, SalaryRange, Location } from './types/common';
import { JobType, WorkArrangement, ExperienceLevel } from './types/enums';

export interface IJobListing extends Document, Timestamps {
  title: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
    description?: string;
    size?: string;
    industry?: string;
  };
  location: Location;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: SalaryRange;
  url: string;
  source: 'linkedin' | 'indeed' | 'ziprecruiter' | 'glassdoor' | 'company_website' | 'other';
  postedDate: Date;
  scrapedDate: Date;
  expiresAt?: Date;
  jobType: JobType;
  workArrangement: WorkArrangement;
  experienceLevel: ExperienceLevel;
  skills: string[];
  benefits?: string[];
  applicationProcess?: {
    deadline?: Date;
    steps?: string[];
    requirements?: string[];
  };
  status: 'active' | 'expired' | 'filled' | 'closed';
  views: number;
  applications: number;
  embedding?: number[];
  metadata?: {
    lastUpdated: Date;
    isRemote: boolean;
    isFeatured: boolean;
    isUrgent: boolean;
    isVerified: boolean;
    verificationSource?: string;
  };
  postedBy: mongoose.Types.ObjectId;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'temporary';
  postedAt: Date;
}

const JobListingSchema = new Schema<IJobListing>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
    index: true,
  },
  company: {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+']
    },
    industry: {
      type: String,
      trim: true
    }
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
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  requirements: [{
    type: String,
    required: true,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  salary: {
    min: {
      type: Number,
      required: [true, 'Minimum salary is required'],
      min: [0, 'Minimum salary cannot be negative'],
    },
    max: {
      type: Number,
      required: [true, 'Maximum salary is required'],
      min: [0, 'Maximum salary cannot be negative'],
      validate: {
        validator: function(this: IJobListing, value: number) {
          return value >= this.salary.min;
        },
        message: 'Maximum salary must be greater than or equal to minimum salary',
      },
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      uppercase: true,
    },
    period: {
      type: String,
      required: [true, 'Salary period is required'],
      enum: {
        values: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
        message: 'Invalid salary period',
      },
      default: 'yearly',
    }
  },
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  source: {
    type: String,
    enum: ['linkedin', 'indeed', 'ziprecruiter', 'glassdoor', 'company_website', 'other'],
    required: true,
    index: true
  },
  postedDate: {
    type: Date,
    required: true,
    index: true
  },
  scrapedDate: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required'],
    validate: {
      validator: function(this: IJobListing, value: Date) {
        return value > this.postedDate;
      },
      message: 'Expiration date must be after posting date',
    },
    index: true
  },
  jobType: {
    type: String,
    enum: Object.values(JobType),
    required: true,
    index: true
  },
  workArrangement: {
    type: String,
    enum: Object.values(WorkArrangement),
    required: true,
    index: true
  },
  experienceLevel: {
    type: String,
    enum: Object.values(ExperienceLevel),
    required: true,
    index: true
  },
  skills: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  applicationProcess: {
    deadline: Date,
    steps: [{
      type: String,
      trim: true
    }],
    requirements: [{
      type: String,
      trim: true
    }]
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['active', 'expired', 'filled', 'closed'],
      message: 'Invalid status',
    },
    default: 'active',
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  embedding: [{
    type: Number,
    required: false
  }],
  metadata: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    isRemote: {
      type: Boolean,
      default: false,
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    isUrgent: {
      type: Boolean,
      default: false,
      index: true
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    verificationSource: {
      type: String,
      trim: true
    }
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Poster ID is required'],
    index: true,
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: {
      values: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
      message: 'Invalid job type',
    },
    index: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Create composite index on title, company and location for better search performance
JobListingSchema.index({ title: 'text', company: 'text', location: 'text' });

// Index for finding active jobs
JobListingSchema.index({ status: 1, postedDate: -1 });

// Index for finding jobs by type and arrangement
JobListingSchema.index({ jobType: 1, workArrangement: 1 });

// Index for finding jobs by experience level
JobListingSchema.index({ experienceLevel: 1 });

// Index for finding featured jobs
JobListingSchema.index({ 'metadata.isFeatured': 1 });

// Index for finding urgent jobs
JobListingSchema.index({ 'metadata.isUrgent': 1 });

// Index for finding remote jobs
JobListingSchema.index({ 'metadata.isRemote': 1 });

// Index for finding jobs by skills
JobListingSchema.index({ skills: 1 });

// Indexes for efficient querying
JobListingSchema.index({ title: 'text', description: 'text', 'company.name': 'text' });
JobListingSchema.index({ 'location.city': 1, 'location.state': 1, 'location.country': 1 });
JobListingSchema.index({ 'salary.min': 1, 'salary.max': 1 });
JobListingSchema.index({ status: 1, expiresAt: 1 });
JobListingSchema.index({ type: 1, 'location.remote': 1 });

// Middleware to validate job listing before saving
JobListingSchema.pre('save', function(next) {
  if (this.status === 'active' && this.expiresAt < new Date()) {
    this.status = 'closed';
    logger.info('Job listing automatically closed due to expiration', {
      jobId: this._id,
      expiresAt: this.expiresAt,
    });
  }
  next();
});

// Method to increment views
JobListingSchema.methods.incrementViews = async function(): Promise<void> {
  try {
    this.views += 1;
    await this.save();
  } catch (error) {
    logger.error('Error incrementing job views', error as Error);
    throw new AppError('Failed to increment views', 500);
  }
};

// Static method to find active job listings
JobListingSchema.statics.findActive = async function(
  filters: {
    title?: string;
    location?: string;
    type?: string;
    remote?: boolean;
    minSalary?: number;
    maxSalary?: number;
  } = {}
) {
  const query: any = {
    status: 'active',
    expiresAt: { $gt: new Date() },
  };

  if (filters.title) {
    query.$text = { $search: filters.title };
  }

  if (filters.location) {
    query['location.city'] = new RegExp(filters.location, 'i');
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.remote !== undefined) {
    query['location.remote'] = filters.remote;
  }

  if (filters.minSalary) {
    query['salary.min'] = { $gte: filters.minSalary };
  }

  if (filters.maxSalary) {
    query['salary.max'] = { $lte: filters.maxSalary };
  }

  return this.find(query)
    .sort({ postedAt: -1 })
    .populate('postedBy', 'firstName lastName email');
};

// Static method to find similar job listings
JobListingSchema.statics.findSimilar = async function(
  jobId: string,
  limit: number = 5
) {
  const job = await this.findById(jobId);
  if (!job) {
    throw new AppError('Job listing not found', 404);
  }

  return this.find({
    _id: { $ne: jobId },
    status: 'active',
    expiresAt: { $gt: new Date() },
    $or: [
      { skills: { $in: job.skills } },
      { type: job.type },
      { 'location.city': job.location.city },
    ],
  })
    .limit(limit)
    .sort({ postedAt: -1 });
};

const JobListing = mongoose.model<IJobListing>('JobListing', JobListingSchema);
export default JobListing; 