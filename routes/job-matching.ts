import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import { JobMatchingService } from '../services/JobMatchingService';

const router = express.Router();

interface JobMatchParams {
  userId: string;
}

interface UserMatchParams {
  jobId: string;
}

interface JobMatchQuery {
  limit?: string;
}

// Job matching routes
router.get('/job-matches/:userId', async (
  req: Request<JobMatchParams, any, any, JobMatchQuery>,
  res: Response
) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit || '10');

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const matches = await JobMatchingService.findMatchesForUser(userId, limit);
    res.json(matches);
  } catch (error) {
    console.error('Error finding job matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user-matches/:jobId', async (
  req: Request<UserMatchParams, any, any, JobMatchQuery>,
  res: Response
) => {
  const { jobId } = req.params;
  const limit = parseInt(req.query.limit || '10');

  if (!Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  try {
    const matches = await JobMatchingService.findMatchesForJob(jobId, limit);
    res.json(matches);
  } catch (error) {
    console.error('Error finding user matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 