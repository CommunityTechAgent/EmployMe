import mongoose, { Document, Schema } from 'mongoose';
import { Timestamps } from './types/common';

export interface IJobMatch extends Document, Timestamps {
  user: mongoose.Types.ObjectId;
  resume: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchDate: Date;
  applied: boolean;
  coverLetter?: string;
  applicationDate?: Date;
  status: 'new' | 'reviewed' | 'applied' | 'rejected';
  notes?: string;
  lastUpdated: Date;
  viewedByUser: boolean;
  viewedByEmployer: boolean;
}

const JobMatchSchema = new Schema<IJobMatch>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  resume: {
    type: Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    validate: {
      validator: (v: number) => v >= 0 && v <= 1,
      message: 'Score must be between 0 and 1'
    }
  },
  matchedSkills: [{
    type: String,
    trim: true
  }],
  missingSkills: [{
    type: String,
    trim: true
  }],
  matchDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  applied: {
    type: Boolean,
    default: false,
    index: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  applicationDate: {
    type: Date,
    index: true
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'applied', 'rejected'],
    default: 'new',
    index: true
  },
  notes: {
    type: String,
    trim: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  viewedByUser: {
    type: Boolean,
    default: false
  },
  viewedByEmployer: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create a compound index to ensure unique job matches per user
JobMatchSchema.index({ user: 1, job: 1 }, { unique: true });

// Index for sorting by score
JobMatchSchema.index({ score: -1 });

// Index for filtering by status and date
JobMatchSchema.index({ status: 1, matchDate: -1 });

// Index for finding unviewed matches
JobMatchSchema.index({ user: 1, viewedByUser: 1 });

const JobMatch = mongoose.model<IJobMatch>('JobMatch', JobMatchSchema);
export default JobMatch; 