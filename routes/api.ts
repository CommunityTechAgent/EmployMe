import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  deleteUserProfile,
  getUserApplications,
  getUserJobs
} from '../controllers/user.controller';
import { 
  createJob, 
  getJob, 
  updateJob, 
  deleteJob, 
  listJobs,
  searchJobs,
  getJobApplications
} from '../controllers/job.controller';
import { 
  createApplication, 
  getApplication, 
  updateApplication, 
  deleteApplication,
  listApplications,
  updateApplicationStatus
} from '../controllers/application.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// User routes
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/profile', authenticateToken, getUserProfile);
router.put('/users/profile', authenticateToken, updateUserProfile);
router.delete('/users/profile', authenticateToken, deleteUserProfile);
router.get('/users/applications', authenticateToken, getUserApplications);
router.get('/users/jobs', authenticateToken, getUserJobs);

// Job routes
router.post('/jobs', authenticateToken, createJob);
router.get('/jobs/:id', getJob);
router.put('/jobs/:id', authenticateToken, updateJob);
router.delete('/jobs/:id', authenticateToken, deleteJob);
router.get('/jobs', listJobs);
router.get('/jobs/search', searchJobs);
router.get('/jobs/:id/applications', authenticateToken, getJobApplications);

// Application routes
router.post('/applications', authenticateToken, createApplication);
router.get('/applications/:id', authenticateToken, getApplication);
router.put('/applications/:id', authenticateToken, updateApplication);
router.delete('/applications/:id', authenticateToken, deleteApplication);
router.get('/applications', authenticateToken, listApplications);
router.patch('/applications/:id/status', authenticateToken, updateApplicationStatus);

export default router; 