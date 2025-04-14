import mongoose, { Document, Schema } from 'mongoose';
import { AppError } from '../utils/app.error';
import { logger } from '../utils/logger';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  parsedData?: {
    skills: string[];
    experience: {
      title: string;
      company: string;
      startDate: Date;
      endDate?: Date;
      description: string;
    }[];
    education: {
      degree: string;
      institution: string;
      fieldOfStudy: string;
      startDate: Date;
      endDate?: Date;
    }[];
    certifications: {
      name: string;
      issuer: string;
      date: Date;
      expiryDate?: Date;
    }[];
  };
  isPublic: boolean;
  isDefault: boolean;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be greater than 0'],
      max: [5 * 1024 * 1024, 'File size cannot exceed 5MB'], // 5MB limit
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      enum: {
        values: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        message: 'File type must be PDF or DOC/DOCX',
      },
    },
    parsedData: {
      skills: [{
        type: String,
        trim: true,
      }],
      experience: [{
        title: {
          type: String,
          required: true,
          trim: true,
        },
        company: {
          type: String,
          required: true,
          trim: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        description: {
          type: String,
          trim: true,
        },
      }],
      education: [{
        degree: {
          type: String,
          required: true,
          trim: true,
        },
        institution: {
          type: String,
          required: true,
          trim: true,
        },
        fieldOfStudy: {
          type: String,
          required: true,
          trim: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
      }],
      certifications: [{
        name: {
          type: String,
          required: true,
          trim: true,
        },
        issuer: {
          type: String,
          required: true,
          trim: true,
        },
        date: {
          type: Date,
          required: true,
        },
        expiryDate: Date,
      }],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resumeSchema.index({ userId: 1, isDefault: 1 });
resumeSchema.index({ userId: 1, isPublic: 1 });
resumeSchema.index({ 'parsedData.skills': 1 });

// Middleware to ensure only one default resume per user
resumeSchema.pre('save', async function (next) {
  if (this.isDefault) {
    try {
      await this.constructor.updateMany(
        { userId: this.userId, _id: { $ne: this._id } },
        { isDefault: false }
      );
    } catch (error) {
      logger.error('Error updating default resume status', error as Error);
      next(error as Error);
    }
  }
  next();
});

// Method to update parsed data
resumeSchema.methods.updateParsedData = async function (
  parsedData: IResume['parsedData']
): Promise<void> {
  try {
    this.parsedData = parsedData;
    this.lastUpdated = new Date();
    await this.save();
  } catch (error) {
    logger.error('Error updating parsed data', error as Error);
    throw new AppError('Failed to update parsed data', 500);
  }
};

// Static method to find resumes by user
resumeSchema.statics.findByUser = async function (
  userId: string,
  options: { isPublic?: boolean; isDefault?: boolean } = {}
) {
  const query: any = { userId };
  if (options.isPublic !== undefined) query.isPublic = options.isPublic;
  if (options.isDefault !== undefined) query.isDefault = options.isDefault;
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to find resumes by skill
resumeSchema.statics.findBySkill = async function (skill: string) {
  return this.find({
    'parsedData.skills': { $regex: new RegExp(skill, 'i') },
    isPublic: true,
  });
};

export const Resume = mongoose.model<IResume>('Resume', resumeSchema); 