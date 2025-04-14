import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '@/utils/app.error';
import { uploadToStorage } from '@/utils/storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the current session
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Parse the form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Validate file
    const file = files.file as formidable.File;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate a unique filename
    const fileExtension = file.originalFilename?.split('.').pop() || '';
    const filename = `${uuidv4()}.${fileExtension}`;

    // Upload to storage
    const fileUrl = await uploadToStorage({
      file: file.filepath,
      filename,
      contentType: file.mimetype || 'application/octet-stream',
    });

    return res.status(200).json({
      success: true,
      data: {
        filename: file.originalFilename,
        url: fileUrl,
        size: file.size,
        type: file.mimetype,
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
        details: error.details,
      });
    }

    return res.status(500).json({
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 