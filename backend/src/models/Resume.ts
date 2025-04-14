import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  originalFilename: string;
  filePath: string;
  parsedData: {
    skills: string[];
    experience: {
      title: string;
      company: string;
      duration: string;
      description: string;
    }[];
    education: {
      degree: string;
      institution: string;
      year: string;
    }[];
    summary: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    parsedData: {
      skills: [String],
      experience: [{
        title: String,
        company: String,
        duration: String,
        description: String,
      }],
      education: [{
        degree: String,
        institution: String,
        year: String,
      }],
      summary: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
resumeSchema.index({ userId: 1 });
resumeSchema.index({ 'parsedData.skills': 1 });

export const Resume = mongoose.model<IResume>('Resume', resumeSchema); 