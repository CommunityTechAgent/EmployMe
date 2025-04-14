import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { IJob } from '../models/Job';
import { IApplication } from '../models/Application';
import { IResume } from '../models/Resume';
import { ISkill } from '../models/Skill';
import { IJobMatch } from '../models/JobMatch';
import Joi from 'joi';
import { AppError } from '../utils/error.utils';
import { IUser } from '../models/User';

// Custom error class for validation errors
class ValidationError extends Error {
  constructor(message: string, public errors: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Schema validation middleware
export const validateSchema = (model: mongoose.Model<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = new model(req.body);
      await doc.validate();
      next();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const errors: Record<string, string> = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = error.errors[key].message;
        });
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      next(error);
    }
  };
};

// Custom validators
export const validators = {
  // Validate salary range
  validateSalaryRange: (value: any) => {
    if (!value) return true;
    if (value.min > value.max) {
      throw new Error('Minimum salary cannot be greater than maximum salary');
    }
    return true;
  },

  // Validate date range
  validateDateRange: (startDate: Date, endDate: Date) => {
    if (!startDate || !endDate) return true;
    if (startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }
    return true;
  },

  // Validate skills match
  validateSkillsMatch: async (jobId: string, resumeId: string) => {
    const job = await mongoose.model('Job').findById(jobId);
    const resume = await mongoose.model('Resume').findById(resumeId);
    
    if (!job || !resume) {
      throw new Error('Job or Resume not found');
    }

    const requiredSkills = (job as IJob).skills;
    const userSkills = (resume as IResume).parsedData.skills;
    const matchedSkills = userSkills.filter((skill: string) => requiredSkills.includes(skill));
    
    if (matchedSkills.length === 0) {
      throw new Error('No matching skills found between job and resume');
    }

    return true;
  },

  // Validate application status transition
  validateStatusTransition: (currentStatus: string, newStatus: string) => {
    const validTransitions: Record<string, string[]> = {
      'new': ['reviewed', 'applied', 'rejected'],
      'reviewed': ['applied', 'rejected'],
      'applied': ['interviewing', 'offered', 'withdrawn'],
      'interviewing': ['offered', 'rejected', 'withdrawn'],
      'offered': ['accepted', 'rejected'],
      'accepted': [],
      'rejected': [],
      'withdrawn': []
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }

    return true;
  }
};

// Pre-save hooks
export const preSaveHooks = {
  // Update lastUpdated timestamp
  updateTimestamp: function(this: any, next: Function) {
    this.lastUpdated = new Date();
    next();
  },

  // Calculate match score
  calculateMatchScore: async function(this: any, next: Function) {
    if (this.isModified('matchedSkills') || this.isModified('missingSkills')) {
      const totalSkills = this.matchedSkills.length + this.missingSkills.length;
      this.score = totalSkills > 0 ? this.matchedSkills.length / totalSkills : 0;
    }
    next();
  },

  // Update related documents
  updateRelatedDocuments: async function(this: any, next: Function) {
    if (this.isModified('status')) {
      // Update job applications count
      await mongoose.model('Job').findByIdAndUpdate(this.job, {
        $inc: { applications: 1 }
      });

      // Update resume match status
      await mongoose.model('JobMatch').updateMany(
        { resume: this.resume, job: this.job },
        { status: this.status }
      );
    }
    next();
  }
};

// Post-save hooks
export const postSaveHooks = {
  // Update job statistics
  updateJobStats: async function(doc: any) {
    const applications = await mongoose.model('Application').countDocuments({ job: doc.job });
    await mongoose.model('Job').findByIdAndUpdate(doc.job, {
      applications,
      lastUpdated: new Date()
    });
  },

  // Update user statistics
  updateUserStats: async function(doc: any) {
    const userApplications = await mongoose.model('Application').countDocuments({ user: doc.user });
    const userMatches = await mongoose.model('JobMatch').countDocuments({ user: doc.user });
    
    // Update user profile with new statistics
    // This would be implemented when we have the User model
  },

  // Send notifications
  sendNotifications: async function(doc: any) {
    // Implement notification logic here
    // This would be implemented when we have the notification system
  }
};

// Export middleware functions
export const validateJob = validateSchema(mongoose.model('Job'));
export const validateApplication = validateSchema(mongoose.model('Application'));
export const validateResume = validateSchema(mongoose.model('Resume'));
export const validateSkill = validateSchema(mongoose.model('Skill'));
export const validateJobMatch = validateSchema(mongoose.model('JobMatch'));

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      const errorMessage = error.details
        .map((detail: Joi.ValidationErrorItem) => detail.message)
        .join(', ');
      next(new AppError(400, errorMessage));
      return;
    }

    next();
  };
};

// Validation schemas
export const schemas = {
  user: {
    register: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      role: Joi.string().valid('candidate', 'employer').required(),
    }),
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
    update: Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email(),
      currentPassword: Joi.string(),
      newPassword: Joi.string().min(8),
    }),
  },
  job: {
    create: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      company: Joi.string().required(),
      location: Joi.object({
        type: Joi.string().valid('remote', 'hybrid', 'onsite').required(),
        address: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        coordinates: Joi.object({
          lat: Joi.number(),
          lng: Joi.number(),
        }),
      }).required(),
      jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').required(),
      workArrangement: Joi.string().valid('remote', 'hybrid', 'onsite').required(),
      experienceLevel: Joi.string().valid('entry', 'mid', 'senior', 'lead', 'executive').required(),
      salary: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
        currency: Joi.string(),
        period: Joi.string().valid('hourly', 'daily', 'weekly', 'monthly', 'yearly'),
      }),
      skills: Joi.array().items(Joi.string()),
      requirements: Joi.array().items(Joi.string()),
      responsibilities: Joi.array().items(Joi.string()),
      benefits: Joi.array().items(Joi.string()),
    }),
    update: Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      company: Joi.string(),
      location: Joi.object({
        type: Joi.string().valid('remote', 'hybrid', 'onsite'),
        address: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        coordinates: Joi.object({
          lat: Joi.number(),
          lng: Joi.number(),
        }),
      }),
      jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship'),
      workArrangement: Joi.string().valid('remote', 'hybrid', 'onsite'),
      experienceLevel: Joi.string().valid('entry', 'mid', 'senior', 'lead', 'executive'),
      salary: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
        currency: Joi.string(),
        period: Joi.string().valid('hourly', 'daily', 'weekly', 'monthly', 'yearly'),
      }),
      skills: Joi.array().items(Joi.string()),
      requirements: Joi.array().items(Joi.string()),
      responsibilities: Joi.array().items(Joi.string()),
      benefits: Joi.array().items(Joi.string()),
      status: Joi.string().valid('active', 'closed', 'draft'),
    }),
  },
  application: {
    create: Joi.object({
      jobId: Joi.string().required(),
      coverLetter: Joi.string().required(),
      resume: Joi.string().required(),
      portfolio: Joi.string(),
      additionalDocuments: Joi.array().items(Joi.string()),
      source: Joi.string().valid('website', 'referral', 'job-board', 'other'),
      referral: Joi.object({
        referrerName: Joi.string(),
        referrerEmail: Joi.string().email(),
        relationship: Joi.string(),
      }),
    }),
    update: Joi.object({
      status: Joi.string().valid('applied', 'reviewing', 'interviewing', 'offered', 'rejected', 'withdrawn'),
      coverLetter: Joi.string(),
      resume: Joi.string(),
      portfolio: Joi.string(),
      additionalDocuments: Joi.array().items(Joi.string()),
    }),
  },
}; 