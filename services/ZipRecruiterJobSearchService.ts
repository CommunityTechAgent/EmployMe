import axios from 'axios';
import { JobSearchParams, JobSearchResult } from '../types/job-search.types';

export class ZipRecruiterJobSearchService {
  private readonly baseUrl = 'https://api.ziprecruiter.com/jobs/v1';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.ZIPRECRUITER_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('ZipRecruiter API key not configured');
    }
  }

  async searchJobs(params: JobSearchParams): Promise<JobSearchResult[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          api_key: this.apiKey,
          search: params.query,
          location: params.location,
          radius_miles: 25,
          days_ago: 30,
          page: 1,
          jobs_per_page: params.limit || 20,
        },
      });

      return this.transformResults(response.data);
    } catch (error) {
      console.error('ZipRecruiter API error:', error);
      throw new Error('Failed to search ZipRecruiter jobs');
    }
  }

  private transformResults(data: any): JobSearchResult[] {
    return data.jobs.map((job: any) => ({
      id: job.id,
      title: job.name,
      company: {
        name: job.hiring_company.name,
        logo: job.hiring_company.logo_url,
      },
      location: job.location,
      description: job.snippet,
      applyUrl: job.url,
      source: 'ziprecruiter',
      postedAt: new Date(job.posted_time),
      salary: job.salary_min || job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: 'USD',
      } : undefined,
      jobType: job.job_type ? [job.job_type] : undefined,
      remote: job.remote,
    }));
  }
} 