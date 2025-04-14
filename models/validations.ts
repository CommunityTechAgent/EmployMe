import { z } from 'zod';
import mongoose from 'mongoose';
import { IUser, IJob, IApplication } from './index';

// User Validation Schema
export const userSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().optional(),
    location: z.object({
      city: z.string(),
      state: z.string(),
      country: z.string(),
    }).optional(),
    preferences: z.object({
      jobTypes: z.array(z.string()),
      locations: z.array(z.string()),
      remotePreference: z.enum(['remote', 'hybrid', 'onsite']),
    }).optional(),
  }),
});

// Job Validation Schema
export const jobSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    company: z.object({
      name: z.string().min(2),
      website: z.string().url().optional(),
      description: z.string().optional(),
    }),
    description: z.string().min(10),
    requirements: z.array(z.string()),
    location: z.object({
      type: z.enum(['remote', 'hybrid', 'onsite']),
      address: z.string().optional(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
    }),
    salary: z.object({
      min: z.number(),
      max: z.number(),
      currency: z.string(),
      period: z.enum(['hourly', 'daily', 'weekly', 'monthly', 'yearly']),
    }).optional(),
    type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
    experienceLevel: z.enum(['entry', 'junior', 'mid', 'senior', 'lead']),
  }),
});

// Application Validation Schema
export const applicationSchema = z.object({
  body: z.object({
    userId: z.string(),
    jobId: z.string(),
    status: z.enum(['applied', 'reviewing', 'interviewing', 'offered', 'rejected', 'withdrawn']),
    resume: z.string(),
    coverLetter: z.string().optional(),
    portfolio: z.string().optional(),
    additionalDocuments: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

// Skill Validation Schema
export const skillSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    category: z.string(),
    proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    yearsOfExperience: z.number().min(0),
    verified: z.boolean().optional(),
    verificationSource: z.string().optional(),
  }),
});

// Export all schemas
export const schemas = {
  user: userSchema,
  job: jobSchema,
  application: applicationSchema,
  skill: skillSchema,
};

// User validations
export const validateUser = async (user: IUser) => {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new Error('Invalid email format');
  }

  // Validate password strength
  if (user.password && user.password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  // Validate salary expectations
  if (user.salaryExpectation) {
    if (user.salaryExpectation.min > user.salaryExpectation.max) {
      throw new Error('Minimum salary cannot be greater than maximum salary');
    }
  }

  // Validate preferred job types
  if (user.preferredJobTypes && user.preferredJobTypes.length === 0) {
    throw new Error('At least one preferred job type must be selected');
  }

  return true;
};

// Job validations
export const validateJob = async (job: IJob) => {
  // Validate salary range
  if (job.salary.min > job.salary.max) {
    throw new Error('Minimum salary cannot be greater than maximum salary');
  }

  // Validate application deadline
  if (job.applicationDeadline && job.applicationDeadline < new Date()) {
    throw new Error('Application deadline cannot be in the past');
  }

  // Validate required fields
  if (!job.title || !job.description || !job.company || !job.location) {
    throw new Error('Missing required fields');
  }

  // Validate skills
  if (job.skills && job.skills.length === 0) {
    throw new Error('At least one skill must be specified');
  }

  return true;
};

// Application validations
export const validateApplication = async (application: IApplication) => {
  // Validate user and job references
  if (!mongoose.Types.ObjectId.isValid(application.user)) {
    throw new Error('Invalid user reference');
  }
  if (!mongoose.Types.ObjectId.isValid(application.job)) {
    throw new Error('Invalid job reference');
  }

  // Validate cover letter length
  if (application.coverLetter && application.coverLetter.length < 50) {
    throw new Error('Cover letter must be at least 50 characters long');
  }

  // Validate interview dates
  if (application.interviews) {
    for (const interview of application.interviews) {
      if (interview.scheduledDate < new Date()) {
        throw new Error('Interview date cannot be in the past');
      }
    }
  }

  return true;
};

// Middleware to validate documents before saving
export const setupValidationMiddleware = () => {
  // User validation middleware
  mongoose.model('User').schema.pre('save', async function(this: IUser) {
    await validateUser(this);
  });

  // Job validation middleware
  mongoose.model('Job').schema.pre('save', async function(this: IJob) {
    await validateJob(this);
  });

  // Application validation middleware
  mongoose.model('Application').schema.pre('save', async function(this: IApplication) {
    await validateApplication(this);
  });
}; 