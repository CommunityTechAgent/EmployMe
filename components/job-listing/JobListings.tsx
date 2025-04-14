import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth.context';
import { SuspenseWrapper } from '../common/SuspenseWrapper';
import { JobListingCard } from './JobListingCard';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

export function JobListings() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch job listings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [toast]);

  if (!user) {
    return null;
  }

  return (
    <SuspenseWrapper
      fallback={
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      }
    >
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobListingCard key={job.id} job={job} />
        ))}
      </div>
    </SuspenseWrapper>
  );
} 