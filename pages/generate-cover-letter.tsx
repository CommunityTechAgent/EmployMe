import { useState } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { Container, Grid, Paper, TextField, Button, Box, Typography } from '@mui/material';
import CoverLetterPreview from '@/components/cover-letter/CoverLetterPreview';
import { AppError } from '@/utils/app.error';

interface FormData {
  jobTitle: string;
  company: string;
  skills: string;
  experience: string;
  jobDescription: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
}

interface CoverLetterResponse {
  content: string;
  atsAnalysis: {
    overallScore: number;
    keywordScore: number;
    formattingScore: number;
    missingKeywords: string[];
    recommendations: string[];
  };
}

export default function GenerateCoverLetterPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    company: '',
    skills: '',
    experience: '',
    jobDescription: '',
    applicantName: user?.name || '',
    applicantEmail: user?.email || '',
    applicantPhone: user?.phone || ''
  });
  
  const [coverLetter, setCoverLetter] = useState<CoverLetterResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new AppError(errorData.message || 'Failed to generate cover letter', response.status);
      }
      
      const data = await response.json();
      setCoverLetter(data);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      setError(error instanceof AppError ? error.message : 'An error occurred while generating the cover letter');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Generate Cover Letter
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Your Skills (comma separated)"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                margin="normal"
                required
                helperText="e.g., JavaScript, React, Node.js"
              />
              
              <TextField
                fullWidth
                label="Your Experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                margin="normal"
                required
                multiline
                rows={4}
                helperText="Briefly describe your relevant experience"
              />
              
              <TextField
                fullWidth
                label="Job Description"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                margin="normal"
                required
                multiline
                rows={4}
              />
              
              <TextField
                fullWidth
                label="Your Name"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Your Email"
                name="applicantEmail"
                value={formData.applicantEmail}
                onChange={handleInputChange}
                margin="normal"
                required
                type="email"
              />
              
              <TextField
                fullWidth
                label="Your Phone"
                name="applicantPhone"
                value={formData.applicantPhone}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? 'Generating...' : 'Generate Cover Letter'}
              </Button>
            </form>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <CoverLetterPreview 
            content={coverLetter?.content || ''}
            atsAnalysis={coverLetter?.atsAnalysis}
            isLoading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
} 