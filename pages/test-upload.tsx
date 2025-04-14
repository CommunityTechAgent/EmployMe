import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import { Typography, Box, Paper } from '@mui/material';

export default function TestUpload() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUploadComplete = (url: string) => {
    console.log('File uploaded successfully:', url);
    setUploadedUrl(url);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        File Upload Test
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload a File
        </Typography>
        <FileUploader
          folder="test-uploads"
          onUploadComplete={handleUploadComplete}
          accept="image/*,.pdf,.doc,.docx"
          label="Select File to Upload"
        />
      </Paper>

      {uploadedUrl && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded File
          </Typography>
          <Typography variant="body1" gutterBottom>
            File URL: {uploadedUrl}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
              <Typography color="primary">
                View Uploaded File
              </Typography>
            </a>
          </Box>
        </Paper>
      )}
    </Box>
  );
} 