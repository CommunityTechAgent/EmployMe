import { base } from './airtableClient';
import { AppError } from './app.error';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

/**
 * Converts a file to base64 string
 */
const fileToBase64 = (file: { path: string; originalFilename: string; size: number; mimetype: string }): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(new Blob([file.path]));
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export async function uploadToStorage(
  file: { path: string; originalFilename: string; size: number; mimetype: string },
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // Check if file size is acceptable for Airtable (less than 10MB is safer)
    if (file.size > 10 * 1024 * 1024) {
      throw new AppError('File size exceeds Airtable\'s limit (max 10MB)', 400);
    }

    // Convert file to base64
    const base64Content = await fileToBase64(file);
    
    // Create a record in the 'Files' table
    const recordData = {
      Name: file.originalFilename,
      Type: folder,
      Size: file.size,
      MimeType: file.mimetype,
      Content: base64Content,
      UploadedAt: new Date().toISOString()
    };

    // Create the record in Airtable
    const result = await new Promise<string>((resolve, reject) => {
      base('Files').create(recordData, (err, record) => {
        if (err) {
          console.error('Error creating Airtable record:', err);
          return reject(new AppError(`Error creating record: ${err.message}`, 500));
        }
        if (!record || !record.getId()) {
          return reject(new AppError('Failed to get record ID', 500));
        }
        resolve(record.getId());
      });
    });

    return {
      url: `airtable://${folder}/${result}`,
      filename: file.originalFilename,
      size: file.size,
      mimetype: file.mimetype
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to upload file', 500, error instanceof Error ? error : undefined);
  }
}

export async function deleteFromStorage(url: string): Promise<void> {
  try {
    // Extract the record ID from the URL-like string
    const recordId = url.split('/').pop();
    
    if (!recordId) {
      throw new AppError('Invalid file URL', 400);
    }

    // Delete the record from Airtable
    await new Promise<void>((resolve, reject) => {
      base('Files').destroy(recordId, (err) => {
        if (err) {
          console.error('Error deleting Airtable record:', err);
          return reject(new AppError(`Error deleting record: ${err.message}`, 500));
        }
        resolve();
      });
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete file', 500, error instanceof Error ? error : undefined);
  }
} 