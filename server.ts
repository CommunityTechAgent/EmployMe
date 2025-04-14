import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { JobMatchingService } from './services/JobMatchingService';
import { ApplicationService } from './services/ApplicationService';
import { Types } from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDef from '../swaggerDef';
import coverLetterRoutes from './routes/cover-letter.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
const specs = swaggerJsdoc(swaggerDef);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Job matching routes
app.get('/api/job-matches/:userId', (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  JobMatchingService.findMatchesForUser(userId, limit)
    .then(matches => res.json(matches))
    .catch(error => {
      console.error('Error finding job matches:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/api/user-matches/:jobId', (req, res) => {
  const { jobId } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  JobMatchingService.findMatchesForJob(jobId, limit)
    .then(matches => res.json(matches))
    .catch(error => {
      console.error('Error finding user matches:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Application routes
app.post('/api/applications', (req, res) => {
  const { userId, jobId, coverLetter, resume, portfolio, additionalDocuments } = req.body;

  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ error: 'Invalid user ID or job ID' });
  }

  ApplicationService.submitApplication(userId, jobId, {
    coverLetter,
    resume,
    portfolio,
    additionalDocuments
  })
    .then(application => res.status(201).json(application))
    .catch(error => {
      console.error('Error submitting application:', error);
      res.status(error.message.includes('already applied') ? 400 : 500)
        .json({ error: error.message });
    });
});

app.patch('/api/applications/:applicationId/status', (req, res) => {
  const { applicationId } = req.params;
  const { status, notes, updatedBy } = req.body;

  if (!Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ error: 'Invalid application ID' });
  }

  ApplicationService.updateApplicationStatus(applicationId, status, notes, updatedBy)
    .then(application => res.json(application))
    .catch(error => {
      console.error('Error updating application status:', error);
      res.status(500).json({ error: error.message });
    });
});

app.get('/api/applications/job/:jobId', (req, res) => {
  const { jobId } = req.params;
  const { status } = req.query;

  if (!Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  ApplicationService.getJobApplications(jobId, status as string)
    .then(applications => res.json(applications))
    .catch(error => {
      console.error('Error getting job applications:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/api/applications/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  ApplicationService.getUserApplications(userId, status as string)
    .then(applications => res.json(applications))
    .catch(error => {
      console.error('Error getting user applications:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/api/applications/:applicationId/interviews', (req, res) => {
  const { applicationId } = req.params;
  const { type, scheduledDate, interviewer, notes } = req.body;

  if (!Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ error: 'Invalid application ID' });
  }

  ApplicationService.scheduleInterview(applicationId, {
    type,
    scheduledDate: new Date(scheduledDate),
    interviewer,
    notes
  })
    .then(application => res.json(application))
    .catch(error => {
      console.error('Error scheduling interview:', error);
      res.status(500).json({ error: error.message });
    });
});

// Routes
app.use('/api', apiRoutes);
app.use('/api/cover-letter', coverLetterRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 