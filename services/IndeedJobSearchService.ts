import axios from 'axios';
import { JobSearchParams, JobSearchResult } from '../types/job-search.types';

export class IndeedJobSearchService {
  private readonly baseUrl = 'https://api.indeed.com/ads/apisearch';
  private readonly publisherId: string;
  private readonly apiKey: string;

  constructor() {
    this.publisherId = process.env.INDEED_PUBLISHER_ID || '';
    this.apiKey = process.env.INDEED_API_KEY || '';

    if (!this.publisherId || !this.apiKey) {
      throw new Error('Indeed API credentials not configured');
    }
  }

  async searchJobs(params: JobSearchParams): Promise<JobSearchResult[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          publisher: this.publisherId,
          v: '2',
          format: 'json',
          q: params.query,
          l: params.location,
          limit: params.limit || 20,
          userip: '1.2.3.4', // Should be replaced with actual user IP
          useragent: 'Mozilla/5.0', // Should be replaced with actual user agent
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return this.transformResults(response.data);
    } catch (error) {
      console.error('Indeed API error:', error);
      throw new Error('Failed to search Indeed jobs');
    }
  }

  private transformResults(data: any): JobSearchResult[] {
    return data.results.map((job: any) => ({
      id: job.jobkey,
      title: job.jobtitle,
      company: {
        name: job.company,
      },
      location: job.formattedLocation,
      description: job.snippet,
      applyUrl: job.url,
      source: 'indeed',
      postedAt: new Date(job.date),
      salary: job.salary ? {
        min: undefined,
        max: undefined,
        currency: 'USD',
      } : undefined,
      jobType: job.jobType ? [job.jobType] : undefined,
    }));
  }
} 