import express, { Request, Response } from 'express';
import { CoverLetterService } from '../services/cover-letter.service';
import {
  UserProfile,
  JobDetails,
  CoverLetterOptions
} from '../types/cover-letter.types';

const router = express.Router();
const coverLetterService = new CoverLetterService();

/**
 * Generate a cover letter
 * POST /api/cover-letter/generate
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { userProfile, jobDetails, options } = req.body as {
      userProfile: UserProfile;
      jobDetails: JobDetails;
      options?: CoverLetterOptions;
    };

    // Validate required fields
    if (!userProfile || !jobDetails) {
      return res.status(400).json({
        success: false,
        message: 'User profile and job details are required'
      });
    }

    // Generate cover letter
    const result = await coverLetterService.generateCoverLetter(
      userProfile,
      jobDetails,
      options
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating cover letter',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router; 