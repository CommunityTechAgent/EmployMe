import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const resumeSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),

  file: z.instanceof(File)
    .refine(
      (file: File) => file.size <= MAX_FILE_SIZE,
      'File size must be less than 5MB'
    )
    .refine(
      (file: File) => ACCEPTED_FILE_TYPES.includes(file.type),
      'Only PDF and Word documents are allowed'
    ),

  isDefault: z.boolean().default(false),

  skills: z.array(
    z.string().min(2, 'Each skill must be at least 2 characters')
  ).optional(),

  experience: z.array(
    z.object({
      title: z.string().min(2, 'Title must be at least 2 characters'),
      company: z.string().min(2, 'Company name must be at least 2 characters'),
      startDate: z.date(),
      endDate: z.date().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
    })
  ).optional(),

  education: z.array(
    z.object({
      degree: z.string().min(2, 'Degree must be at least 2 characters'),
      institution: z.string().min(2, 'Institution name must be at least 2 characters'),
      field: z.string().min(2, 'Field must be at least 2 characters'),
      startDate: z.date(),
      endDate: z.date().optional(),
      current: z.boolean().default(false),
    })
  ).optional(),

  certifications: z.array(
    z.object({
      name: z.string().min(2, 'Certification name must be at least 2 characters'),
      issuer: z.string().min(2, 'Issuer name must be at least 2 characters'),
      date: z.date(),
      expiryDate: z.date().optional(),
    })
  ).optional(),

  parsedData: z.object({
    skills: z.array(z.string()).optional(),
    experience: z.array(z.string()).optional(),
    education: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
  }).optional(),
});

export type ResumeFormData = z.infer<typeof resumeSchema>; 