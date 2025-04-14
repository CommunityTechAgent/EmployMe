import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobListingSchema, JobListingFormData } from '../../schemas/job-listing.schema';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { FormField } from '../ui/form-field';
import { useToast } from '../ui/use-toast';

interface JobListingFormProps {
  onSubmit: (data: JobListingFormData) => Promise<void>;
  initialData?: Partial<JobListingFormData>;
}

export function JobListingForm({ onSubmit, initialData }: JobListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobListingFormData>({
    resolver: zodResolver(jobListingSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: JobListingFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast({
        title: 'Success',
        description: 'Job listing saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save job listing',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormField
        label="Job Title"
        error={errors.title?.message}
      >
        <Input
          {...register('title')}
          placeholder="Enter job title"
        />
      </FormField>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Company Information</h3>
        <FormField
          label="Company Name"
          error={errors.company?.name?.message}
        >
          <Input
            {...register('company.name')}
            placeholder="Enter company name"
          />
        </FormField>

        <FormField
          label="Company Logo URL"
          error={errors.company?.logo?.message}
        >
          <Input
            {...register('company.logo')}
            placeholder="Enter company logo URL"
          />
        </FormField>

        <FormField
          label="Company Website"
          error={errors.company?.website?.message}
        >
          <Input
            {...register('company.website')}
            placeholder="Enter company website"
          />
        </FormField>

        <FormField
          label="Company Description"
          error={errors.company?.description?.message}
        >
          <Textarea
            {...register('company.description')}
            placeholder="Enter company description"
            rows={3}
          />
        </FormField>
      </div>

      <FormField
        label="Job Description"
        error={errors.description?.message}
      >
        <Textarea
          {...register('description')}
          placeholder="Enter job description"
          rows={5}
        />
      </FormField>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="City"
            error={errors.location?.city?.message}
          >
            <Input
              {...register('location.city')}
              placeholder="Enter city"
            />
          </FormField>

          <FormField
            label="State"
            error={errors.location?.state?.message}
          >
            <Input
              {...register('location.state')}
              placeholder="Enter state"
            />
          </FormField>

          <FormField
            label="Country"
            error={errors.location?.country?.message}
          >
            <Input
              {...register('location.country')}
              placeholder="Enter country"
            />
          </FormField>
        </div>

        <FormField
          label="Remote Work"
          error={errors.location?.remote?.message}
        >
          <Select
            {...register('location.remote')}
            options={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]}
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Salary Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Minimum Salary"
            error={errors.salary?.min?.message}
          >
            <Input
              type="number"
              {...register('salary.min', { valueAsNumber: true })}
              placeholder="Enter minimum salary"
            />
          </FormField>

          <FormField
            label="Maximum Salary"
            error={errors.salary?.max?.message}
          >
            <Input
              type="number"
              {...register('salary.max', { valueAsNumber: true })}
              placeholder="Enter maximum salary"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Currency"
            error={errors.salary?.currency?.message}
          >
            <Select
              {...register('salary.currency')}
              options={[
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'GBP', label: 'GBP' },
              ]}
            />
          </FormField>

          <FormField
            label="Salary Period"
            error={errors.salary?.period?.message}
          >
            <Select
              {...register('salary.period')}
              options={[
                { value: 'hourly', label: 'Hourly' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
          </FormField>
        </div>
      </div>

      <FormField
        label="Job Type"
        error={errors.type?.message}
      >
        <Select
          {...register('type')}
          options={[
            { value: 'full-time', label: 'Full Time' },
            { value: 'part-time', label: 'Part Time' },
            { value: 'contract', label: 'Contract' },
            { value: 'internship', label: 'Internship' },
            { value: 'temporary', label: 'Temporary' },
          ]}
        />
      </FormField>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Saving...' : 'Save Job Listing'}
      </Button>
    </form>
  );
} 