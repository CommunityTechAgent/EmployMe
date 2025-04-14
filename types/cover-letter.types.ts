export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  title?: string;
  summary?: string;
  skills?: string[];
  experience?: WorkExperience[];
  education?: Education[];
  certifications?: Certification[];
  projects?: Project[];
}

export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  graduationYear: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Project {
  name: string;
  description: string;
}

export interface JobDetails {
  title: string;
  company: string;
  location?: string;
  department?: string;
  hiringManager?: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  qualifications?: string[];
  companyInfo?: string;
}

export interface CoverLetterOptions {
  style?: 'professional' | 'conversational' | 'creative';
  length?: 'short' | 'medium' | 'long';
  focusAreas?: string[];
  customInstructions?: string;
  includeUserAddress?: boolean;
  includeDateAndGreeting?: boolean;
  includeClosure?: boolean;
  language?: string;
}

export interface ATSAnalysis {
  score: number;
  keywordScore: number;
  formattingScore: number;
  missingKeywords: string[];
  recommendations: string[];
}

export interface CoverLetterResponse {
  success: boolean;
  coverLetter?: string;
  atsAnalysis?: ATSAnalysis;
  error?: string;
} 