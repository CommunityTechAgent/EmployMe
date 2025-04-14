import { useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Button, CircularProgress, Typography, Box } from '@mui/material';

interface FileUploaderProps {
  folder?: string;
  onUploadComplete: (fileUrl: string) => void;
  accept?: string;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  folder = 'uploads',
  onUploadComplete,
  accept = '*',
  label = 'Select File'
}) => {
  const { uploading, uploadFile, error } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const fileUrl = await uploadFile({
        path: URL.createObjectURL(selectedFile),
        originalFilename: selectedFile.name,
        size: selectedFile.size,
        mimetype: selectedFile.type
      }, folder);
      
      onUploadComplete(fileUrl);
      setSelectedFile(null);
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  return (
    <Box>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button variant="outlined" component="span">
          {label}
        </Button>
      </label>
      
      {selectedFile && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected file: {selectedFile.name}
        </Typography>
      )}
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      
      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        sx={{ mt: 2, ml: selectedFile ? 2 : 0 }}
      >
        {uploading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>
    </Box>
  );
};

export default FileUploader; 