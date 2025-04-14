import { useState } from 'react';
import { uploadToStorage, deleteFromStorage } from '@/utils/storage';

interface UseFileUploadReturn {
  uploading: boolean;
  uploadFile: (file: { path: string; originalFilename: string; size: number; mimetype: string }, folder?: string) => Promise<string>;
  deleteFile: (url: string) => Promise<void>;
  error: string | null;
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: { path: string; originalFilename: string; size: number; mimetype: string },
    folder: string = 'uploads'
  ): Promise<string> => {
    setUploading(true);
    setError(null);
    
    try {
      const result = await uploadToStorage(file, folder);
      return result.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (url: string): Promise<void> => {
    setError(null);
    
    try {
      await deleteFromStorage(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);
      throw err;
    }
  };

  return { uploading, uploadFile, deleteFile, error };
} 