import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema, ResumeFormData } from '../../schemas/resume.schema';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormField } from '../ui/form-field';
import { useToast } from '../ui/use-toast';
import { DynamicImport } from '../common/DynamicImport';

interface ResumeUploadFormProps {
  onSubmit: (data: ResumeFormData) => Promise<void>;
  initialData?: Partial<ResumeFormData>;
}

export function ResumeUploadForm({ onSubmit, initialData }: ResumeUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: ResumeFormData) => {
    try {
      setIsUploading(true);
      await onSubmit(data);
      toast({
        title: 'Success',
        description: 'Resume uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload resume',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormField
        label="Resume Title"
        error={errors.title?.message}
      >
        <Input
          {...register('title')}
          placeholder="Enter resume title"
        />
      </FormField>

      <FormField
        label="Resume File"
        error={errors.file?.message}
      >
        <DynamicImport
          component={() => import('../ui/file-input')}
          loading={<div className="animate-pulse">Loading file input...</div>}
          ssr={false}
        />
      </FormField>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Skills</h3>
        <FormField
          label="Skills (comma separated)"
          error={errors.skills?.message}
        >
          <Input
            {...register('skills')}
            placeholder="Enter skills (e.g., JavaScript, React, Node.js)"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Experience</h3>
        <div className="space-y-4">
          {watch('experience')?.map((exp, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <FormField
                label="Job Title"
                error={errors.experience?.[index]?.title?.message}
              >
                <Input
                  {...register(`experience.${index}.title`)}
                  placeholder="Enter job title"
                />
              </FormField>

              <FormField
                label="Company"
                error={errors.experience?.[index]?.company?.message}
              >
                <Input
                  {...register(`experience.${index}.company`)}
                  placeholder="Enter company name"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Start Date"
                  error={errors.experience?.[index]?.startDate?.message}
                >
                  <Input
                    type="date"
                    {...register(`experience.${index}.startDate`)}
                  />
                </FormField>

                <FormField
                  label="End Date"
                  error={errors.experience?.[index]?.endDate?.message}
                >
                  <Input
                    type="date"
                    {...register(`experience.${index}.endDate`)}
                  />
                </FormField>
              </div>

              <FormField
                label="Description"
                error={errors.experience?.[index]?.description?.message}
              >
                <Input
                  {...register(`experience.${index}.description`)}
                  placeholder="Enter job description"
                />
              </FormField>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? 'Uploading...' : 'Upload Resume'}
      </Button>
    </form>
  );
} 