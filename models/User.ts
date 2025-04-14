import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Timestamps, SalaryRange, SocialMedia, JobSearchStatus } from './types/common';
import { JobType, WorkArrangement, UserAvailability } from './types/enums';
import { AppError } from '../utils/app.error';
import { logger } from '../utils/logger';
import crypto from 'crypto';

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
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): Promise<string>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
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
    enum: Object.values(JobType)
  }],
  preferredWorkArrangement: {
    type: String,
    enum: Object.values(WorkArrangement),
    default: WorkArrangement.FLEXIBLE
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
    enum: Object.values(UserAvailability),
    default: UserAvailability.OPEN_TO_OFFERS
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
  },
  tokens: [{
    type: String,
    required: true
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    logger.error('Error hashing password', error as Error);
    next(error as Error);
  }
});

// Middleware to update passwordChangedAt when password is modified
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    logger.error('Error comparing passwords', error as Error);
    throw new AppError('Error comparing passwords', 500);
  }
};

// Method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to create password reset token
userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

// Generate auth token
userSchema.methods.generateAuthToken = async function(): Promise<string> {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET || 'your-secret-key');
  this.tokens = this.tokens.concat(token);
  await this.save();
  return token;
};

// Static method to find user by email
userSchema.statics.findByEmail = async function (email: string) {
// Static method to find user by credentials
userSchema.static('findByCredentials', async function(email: string, password: string): Promise<IUser> {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }
  return user;
});

const User = mongoose.model<IUser>('User', userSchema);
export default User; 