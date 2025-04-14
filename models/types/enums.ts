export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance'
}

export enum WorkArrangement {
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  ON_SITE = 'on-site',
  FLEXIBLE = 'flexible'
}

export enum JobStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  DRAFT = 'draft'
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  INTERVIEWING = 'interviewing',
  OFFERED = 'offered',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  WITHDRAWN = 'withdrawn'
}

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  IN_PERSON = 'in-person',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  FINAL = 'final'
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled'
}

export enum ApplicationSource {
  DIRECT = 'direct',
  REFERRAL = 'referral',
  RECRUITER = 'recruiter',
  JOB_BOARD = 'job-board',
  COMPANY_WEBSITE = 'company-website'
}

export enum UserAvailability {
  ACTIVELY_LOOKING = 'actively-looking',
  OPEN_TO_OFFERS = 'open-to-offers',
  NOT_LOOKING = 'not-looking'
}

export enum Benefits {
  HEALTH_INSURANCE = 'health-insurance',
  DENTAL_INSURANCE = 'dental-insurance',
  VISION_INSURANCE = 'vision-insurance',
  RETIREMENT_401K = '401k',
  STOCK_OPTIONS = 'stock-options',
  PAID_TIME_OFF = 'paid-time-off',
  FLEXIBLE_HOURS = 'flexible-hours',
  REMOTE_WORK = 'remote-work',
  PROFESSIONAL_DEVELOPMENT = 'professional-development',
  GYM_MEMBERSHIP = 'gym-membership',
  FREE_LUNCH = 'free-lunch',
  SNACKS = 'snacks'
} 