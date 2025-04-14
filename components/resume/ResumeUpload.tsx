import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema } from '../../schemas/resume.schema';
import { DynamicImport } from '../common/DynamicImport';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormField } from '../ui/form-field';
import { useToast } from '../ui/use-toast';

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
}

const FileInput = dynamic(() => import('../ui/file-input'), { ssr: false });

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(resumeSchema),
  });

  const handleFileUpload = async (data: any) => {
    try {
      setIsUploading(true);
      await onUpload(data.file);
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
    <form onSubmit={handleSubmit(handleFileUpload)} className="space-y-6">
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