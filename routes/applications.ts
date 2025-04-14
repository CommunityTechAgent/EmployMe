import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { Types } from 'mongoose';
import { auth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { AppError } from '../utils/error.utils';
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
  scheduleInterview,
  getJobApplications,
  getUserApplications
} from '../controllers/application.controller';

const router = express.Router();

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get all applications
 *     description: Retrieve a list of all job applications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getApplications(req, res, next).catch(next);
});

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get a specific application
 *     description: Retrieve details of a specific job application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       404:
 *         description: Application not found
 */
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  getApplication(req, res, next).catch(next);
});

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a new application
 *     description: Submit a new job application
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - coverLetter
 *               - resume
 *             properties:
 *               jobId:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *               resume:
 *                 type: string
 *               portfolio:
 *                 type: string
 *               additionalDocuments:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid input
 */
router.post('/', validateRequest({
  body: {
    jobId: Types.ObjectId,
    coverLetter: String,
    resume: String,
    portfolio: String,
    additionalDocuments: [String]
  }
}), (req: Request, res: Response, next: NextFunction) => {
  createApplication(req, res, next).catch(next);
});

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     summary: Update an application
 *     description: Update details of an existing job application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverLetter:
 *                 type: string
 *               resume:
 *                 type: string
 *               portfolio:
 *                 type: string
 *               additionalDocuments:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Application updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       404:
 *         description: Application not found
 */
router.put('/:id', validateRequest({
  body: {
    coverLetter: String,
    resume: String,
    portfolio: String,
    additionalDocuments: [String]
  }
}), (req: Request, res: Response, next: NextFunction) => {
  updateApplication(req, res, next).catch(next);
});

/**
 * @swagger
 * /applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     description: Update the status of a job application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [applied, reviewing, interviewing, offered, rejected, withdrawn]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       404:
 *         description: Application not found
 */
router.patch('/:id/status', validateRequest({
  body: {
    status: String,
    notes: String
  }
}), (req: Request, res: Response, next: NextFunction) => {
  updateApplicationStatus(req, res, next).catch(next);
});

/**
 * @swagger
 * /applications/{id}/interviews:
 *   post:
 *     summary: Schedule an interview
 *     description: Schedule a new interview for a job application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - scheduledDate
 *               - interviewer
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [phone, video, technical, onsite]
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               interviewer:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Interview scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       404:
 *         description: Application not found
 */
router.post('/:id/interviews', validateRequest({
  body: {
    type: String,
    scheduledDate: Date,
    interviewer: String,
    notes: String
  }
}), (req: Request, res: Response, next: NextFunction) => {
  scheduleInterview(req, res, next).catch(next);
});

/**
 * @swagger
 * /applications/job/{jobId}:
 *   get:
 *     summary: Get applications for a job
 *     description: Retrieve all applications for a specific job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter applications by status
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 */
router.get('/job/:jobId', (req: Request, res: Response, next: NextFunction) => {
  getJobApplications(req, res, next).catch(next);
});

/**
 * @swagger
 * /applications/user/{userId}:
 *   get:
 *     summary: Get applications for a user
 *     description: Retrieve all applications submitted by a specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter applications by status
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 */
router.get('/user/:userId', (req: Request, res: Response, next: NextFunction) => {
  getUserApplications(req, res, next).catch(next);
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

router.use(errorHandler);

export default router; 