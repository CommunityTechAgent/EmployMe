export interface JobSearchParams {
  query: string;
  location: string;
  limit?: number;
  filters?: {
    salary?: {
      min?: number;
      max?: number;
      currency?: string;
    };
    jobType?: string[];
    experience?: string[];
    remote?: boolean;
  };
}

export interface Company {
  id?: string;
  name: string;
  logo?: string;
}

export interface Salary {
  min?: number;
  max?: number;
  currency: string;
}

export interface JobSearchResult {
  id: string;
  title: string;
  company: Company;
  location: string;
  description: string;
  applyUrl: string;
  source: 'linkedin' | 'indeed' | 'ziprecruiter';
  postedAt: Date;
  salary?: Salary;
  jobType?: string[];
  experience?: string[];
  remote?: boolean;
} 