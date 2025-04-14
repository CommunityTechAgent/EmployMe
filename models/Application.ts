import mongoose, { Document, Schema } from 'mongoose';
import { Timestamps } from './types/common';

export interface IApplication extends Document, Timestamps {
  user: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  resume: mongoose.Types.ObjectId;
  coverLetter?: string;
  status: 'new' | 'reviewed' | 'applied' | 'interviewing' | 'offered' | 'accepted' | 'rejected' | 'withdrawn';
  statusHistory: {
    status: string;
    date: Date;
    notes?: string;
  }[];
  interviews?: {
    type: string;
    date: Date;
    interviewer?: string;
    feedback?: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }[];
  messages?: {
    sender: mongoose.Types.ObjectId;
    content: string;
    date: Date;
    read: boolean;
  }[];
  notes?: string;
  applicationDate: Date;
  lastUpdated: Date;
  viewedBy: mongoose.Types.ObjectId[];
}

const ApplicationSchema = new Schema<IApplication>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  resume: {
    type: Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'applied', 'interviewing', 'offered', 'accepted', 'rejected', 'withdrawn'],
    default: 'new',
    index: true
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  interviews: [{
    type: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    interviewer: {
      type: String,
      trim: true
    },
    feedback: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  }],
  messages: [{
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  applicationDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  viewedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

// Create a compound index to ensure unique applications per user and job
ApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

// Index for finding applications by status
ApplicationSchema.index({ status: 1, applicationDate: -1 });

// Index for finding applications by user
ApplicationSchema.index({ user: 1, status: 1 });

// Index for finding applications by job
ApplicationSchema.index({ job: 1, status: 1 });

// Index for finding applications with interviews
ApplicationSchema.index({ 'interviews.date': 1 });

const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
export default Application; 