import { Router } from 'express';
import { jobController } from '../controllers/job.controller';
import { validateJob } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorization.middleware';
import { Role } from '../types/enums';

const router = Router();

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/search', jobController.searchJobs);
router.get('/:id', jobController.getJobById);
router.get('/:id/applications', jobController.getJobApplications);

// Protected routes (require authentication)
router.use(authenticate);

// Job creation and management (employer only)
router.post('/', 
  authorize([Role.EMPLOYER, Role.ADMIN]),
  validateJob,
  jobController.createJob
);

router.put('/:id',
  authorize([Role.EMPLOYER, Role.ADMIN]),
  validateJob,
  jobController.updateJob
);

router.delete('/:id',
  authorize([Role.EMPLOYER, Role.ADMIN]),
  jobController.deleteJob
);

// Job status management
router.patch('/:id/status',
  authorize([Role.EMPLOYER, Role.ADMIN]),
  jobController.updateJobStatus
);

// Job statistics
router.get('/:id/stats',
  authorize([Role.EMPLOYER, Role.ADMIN]),
  jobController.getJobStats
);

// Job matching
router.get('/:id/matches',
  authorize([Role.EMPLOYER, Role.ADMIN]),
  jobController.getJobMatches
);

// Job recommendations
router.get('/recommendations',
  authorize([Role.JOB_SEEKER]),
  jobController.getJobRecommendations
);

export default router; 