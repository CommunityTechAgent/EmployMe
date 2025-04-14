import { z } from 'zod';

export const jobListingSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  
  company: z.object({
    name: z.string()
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name cannot exceed 100 characters'),
    logo: z.string().url('Invalid logo URL').optional(),
    website: z.string().url('Invalid website URL').optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  }),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),

  requirements: z.array(
    z.string().min(5, 'Each requirement must be at least 5 characters')
  ).min(1, 'At least one requirement is required'),

  skills: z.array(
    z.string().min(2, 'Each skill must be at least 2 characters')
  ).min(1, 'At least one skill is required'),

  location: z.object({
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    country: z.string().min(2, 'Country must be at least 2 characters'),
    remote: z.boolean().default(false),
  }),

  salary: z.object({
    min: z.number()
      .min(0, 'Minimum salary cannot be negative')
      .max(1000000, 'Maximum salary is 1,000,000'),
    max: z.number()
      .min(0, 'Maximum salary cannot be negative')
      .max(1000000, 'Maximum salary is 1,000,000'),
    currency: z.string().default('USD'),
    period: z.enum(['hourly', 'daily', 'weekly', 'monthly', 'yearly'])
      .default('yearly'),
  }).refine(
    (data) => data.max >= data.min,
    'Maximum salary must be greater than or equal to minimum salary'
  ),

  type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'temporary'])
    .default('full-time'),

  status: z.enum(['active', 'closed', 'draft'])
    .default('draft'),

  postedAt: z.date().default(() => new Date()),

  expiresAt: z.date()
    .min(new Date(), 'Expiration date must be in the future')
    .refine(
      (date) => date > new Date(),
      'Expiration date must be in the future'
    ),
});

export type JobListingFormData = z.infer<typeof jobListingSchema>; 