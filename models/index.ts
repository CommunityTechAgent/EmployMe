import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// User Interface and Schema
export interface IUser extends Document {
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
  preferredJobTypes: string[];
  preferredWorkArrangement: string;
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
  socialMedia?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  availability: string;
  jobSearchStatus: {
    isSearching: boolean;
    lastSearchUpdate?: Date;
    preferredIndustries: string[];
  };
  profileComplete: boolean;
  lastLogin: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: String,
  profilePicture: String,
  skills: [String],
  experience: {
    type: Number,
    default: 0
  },
  education: String,
  portfolioUrl: String,
  resume: String,
  location: String,
  preferredLocations: [String],
  preferredJobTypes: [{
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance']
  }],
  preferredWorkArrangement: {
    type: String,
    enum: ['remote', 'hybrid', 'on-site', 'flexible'],
    default: 'flexible'
  },
  salaryExpectation: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  socialMedia: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String
  },
  availability: {
    type: String,
    enum: ['actively-looking', 'open-to-offers', 'not-looking'],
    default: 'open-to-offers'
  },
  jobSearchStatus: {
    isSearching: {
      type: Boolean,
      default: true
    },
    lastSearchUpdate: Date,
    preferredIndustries: [String]
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Job Interface and Schema
export interface IJob extends Document {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  type: string;
  status: string;
  numberOfOpenings: number;
  location?: string;
  workArrangement: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    isNegotiable: boolean;
  };
  benefits: string[];
  applicationDeadline?: Date;
  applicationProcess: Array<{
    step: string;
    description: string;
    estimatedTime: string;
  }>;
  requiredDocuments: string[];
  companyWebsite?: string;
  companyDescription?: string;
  companyLogo?: string;
  postedBy: mongoose.Types.ObjectId;
  views: number;
  applications: number;
}

const jobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  skills: [String],
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  numberOfOpenings: {
    type: Number,
    default: 1
  },
  location: String,
  workArrangement: {
    type: String,
    enum: ['remote', 'hybrid', 'on-site', 'flexible'],
    default: 'flexible'
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    isNegotiable: {
      type: Boolean,
      default: false
    }
  },
  benefits: [{
    type: String,
    enum: ['health-insurance', 'dental-insurance', 'vision-insurance', '401k',
           'stock-options', 'paid-time-off', 'flexible-hours', 'remote-work',
           'professional-development', 'gym-membership', 'free-lunch', 'snacks']
  }],
  applicationDeadline: Date,
  applicationProcess: [{
    step: String,
    description: String,
    estimatedTime: String
  }],
  requiredDocuments: [String],
  companyWebsite: String,
  companyDescription: String,
  companyLogo: String,
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Application Interface and Schema
export interface IApplication extends Document {
  user: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  status: string;
  statusHistory: Array<{
    status: string;
    date: Date;
    notes?: string;
  }>;
  coverLetter?: string;
  resume?: string;
  portfolio?: string;
  additionalDocuments: Array<{
    name: string;
    url: string;
    uploadedAt: Date;
  }>;
  interviews: Array<{
    type: string;
    scheduledDate: Date;
    completedDate?: Date;
    interviewer: string;
    notes?: string;
    feedback?: string;
    status: string;
  }>;
  messages: Array<{
    sender: mongoose.Types.ObjectId;
    content: string;
    sentAt: Date;
    read: boolean;
  }>;
  source: string;
  referral?: {
    name: string;
    relationship: string;
    contact: string;
  };
  applicationDate: Date;
  lastUpdated: Date;
  viewedBy: Array<{
    user: mongoose.Types.ObjectId;
    date: Date;
  }>;
  notes?: string;
}

const applicationSchema = new Schema<IApplication>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interviewing', 'offered', 'rejected', 'accepted', 'withdrawn'],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'interviewing', 'offered', 'rejected', 'accepted', 'withdrawn']
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  coverLetter: String,
  resume: String,
  portfolio: String,
  additionalDocuments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  interviews: [{
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'technical', 'behavioral', 'final']
    },
    scheduledDate: Date,
    completedDate: Date,
    interviewer: String,
    notes: String,
    feedback: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    }
  }],
  messages: [{
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    sentAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  source: {
    type: String,
    enum: ['direct', 'referral', 'recruiter', 'job-board', 'company-website'],
    default: 'direct'
  },
  referral: {
    name: String,
    relationship: String,
    contact: String
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  viewedBy: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  notes: String
}, { timestamps: true });

// Skill Interface and Schema
export interface ISkill extends Document {
  name: string;
  category: string;
  description?: string;
}

const skillSchema = new Schema<ISkill>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  description: String
}, { timestamps: true });

// Create models
export const User = mongoose.model<IUser>('User', userSchema);
export const Job = mongoose.model<IJob>('Job', jobSchema);
export const Application = mongoose.model<IApplication>('Application', applicationSchema);
export const Skill = mongoose.model<ISkill>('Skill', skillSchema); 