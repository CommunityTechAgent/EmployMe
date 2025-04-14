import axios from 'axios';
import { JobSearchParams, JobSearchResult } from '../types/job-search.types';

export class LinkedInJobSearchService {
  private readonly baseUrl = 'https://api.linkedin.com/v2';
  private readonly accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async searchJobs(params: JobSearchParams): Promise<JobSearchResult[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/jobSearch`, {
        params: {
          keywords: params.query,
          location: params.location,
          count: params.limit || 20,
        },
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return this.transformResults(response.data);
    } catch (error) {
      console.error('LinkedIn API error:', error);
      throw new Error('Failed to search LinkedIn jobs');
    }
  }

  private transformResults(data: any): JobSearchResult[] {
    return data.elements.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: {
        name: job.company?.name || 'Unknown Company',
        id: job.company?.id,
      },
      location: job.location,
      description: job.description,
      applyUrl: job.applyUrl,
      source: 'linkedin',
      postedAt: new Date(job.postedAt),
      salary: job.salary ? {
        min: job.salary.min,
        max: job.salary.max,
        currency: job.salary.currency,
      } : undefined,
    }));
  }
} 