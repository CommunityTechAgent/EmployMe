import { Router } from 'express';
import jobRoutes from './job.routes';
import applicationRoutes from './application.routes';
import resumeRoutes from './resume.routes';
import skillRoutes from './skill.routes';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import jobMatchRoutes from './jobMatch.routes';

const router = Router();

// API version prefix
const API_PREFIX = '/api/v1';

// Health check endpoint
router.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
router.use(`${API_PREFIX}/jobs`, jobRoutes);
router.use(`${API_PREFIX}/applications`, applicationRoutes);
router.use(`${API_PREFIX}/resumes`, resumeRoutes);
router.use(`${API_PREFIX}/skills`, skillRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/matches`, jobMatchRoutes);

// 404 handler
router.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

export default router; 