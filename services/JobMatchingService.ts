import { User, Job } from '../models';
import { Types } from 'mongoose';

interface MatchScore {
  job: any;  // Job Document
  score: number;
  matchedSkills: string[];
  skillsScore: number;
  experienceScore: number;
  locationScore: number;
}

export class JobMatchingService {
  private static WEIGHTS = {
    SKILLS: 0.5,      // 50% of total score
    EXPERIENCE: 0.3,  // 30% of total score
    LOCATION: 0.2     // 20% of total score
  };

  /**
   * Find matching jobs for a user
   * @param userId User ID to find matches for
   * @param limit Maximum number of matches to return
   * @returns Array of jobs with their match scores
   */
  static async findMatchesForUser(userId: string | Types.ObjectId, limit: number = 10): Promise<MatchScore[]> {
    try {
      // Get user details with skills
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get all active jobs
      const jobs = await Job.find({}).populate('postedBy', 'company');

      // Calculate match scores for each job
      const matchScores: MatchScore[] = jobs.map(job => {
        const matchedSkills = user.skills.filter(skill => 
          job.skills.includes(skill)
        );

        // Calculate individual scores
        const skillsScore = this.calculateSkillsScore(matchedSkills.length, job.skills.length);
        const experienceScore = this.calculateExperienceScore(user.experience, job);
        const locationScore = this.calculateLocationScore(
          user.location || '',
          job.location || ''
        );

        // Calculate total weighted score
        const score = (
          skillsScore * this.WEIGHTS.SKILLS +
          experienceScore * this.WEIGHTS.EXPERIENCE +
          locationScore * this.WEIGHTS.LOCATION
        );

        return {
          job,
          score,
          matchedSkills,
          skillsScore,
          experienceScore,
          locationScore
        };
      });

      // Sort by score and return top matches
      return matchScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error in job matching:', error);
      throw error;
    }
  }

  /**
   * Calculate score based on matching skills
   * @param matchedSkillsCount Number of matching skills
   * @param requiredSkillsCount Number of required skills
   * @returns Score between 0 and 1
   */
  private static calculateSkillsScore(matchedSkillsCount: number, requiredSkillsCount: number): number {
    if (requiredSkillsCount === 0) return 0;
    return Math.min(matchedSkillsCount / requiredSkillsCount, 1);
  }

  /**
   * Calculate score based on experience match
   * @param userExperience User's years of experience
   * @param job Job posting
   * @returns Score between 0 and 1
   */
  private static calculateExperienceScore(userExperience: number, job: any): number {
    // Extract required experience from job requirements
    const experienceReq = job.requirements.find((req: string) => 
      req.toLowerCase().includes('year') && req.includes('+')
    );
    
    if (!experienceReq) return 1; // No specific experience requirement

    const requiredYears = parseInt(experienceReq.match(/\d+/)?.[0] || '0');
    if (requiredYears === 0) return 1;

    // Score based on how close the user's experience is to the requirement
    if (userExperience >= requiredYears) return 1;
    return userExperience / requiredYears;
  }

  /**
   * Calculate score based on location match
   * @param userLocation User's location
   * @param jobLocation Job's location
   * @returns Score between 0 and 1
   */
  private static calculateLocationScore(userLocation: string, jobLocation: string): number {
    if (!userLocation || !jobLocation) return 0.5; // Neutral score if location info is missing
    return userLocation.toLowerCase() === jobLocation.toLowerCase() ? 1 : 0;
  }

  /**
   * Find matching users for a job
   * @param jobId Job ID to find matches for
   * @param limit Maximum number of matches to return
   * @returns Array of users with their match scores
   */
  static async findMatchesForJob(jobId: string | Types.ObjectId, limit: number = 10): Promise<MatchScore[]> {
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      const users = await User.find({});

      const matchScores: MatchScore[] = users.map(user => {
        const matchedSkills = job.skills.filter(skill => 
          user.skills.includes(skill)
        );

        const skillsScore = this.calculateSkillsScore(matchedSkills.length, job.skills.length);
        const experienceScore = this.calculateExperienceScore(user.experience, job);
        const locationScore = this.calculateLocationScore(
          user.location || '',
          job.location || ''
        );

        const score = (
          skillsScore * this.WEIGHTS.SKILLS +
          experienceScore * this.WEIGHTS.EXPERIENCE +
          locationScore * this.WEIGHTS.LOCATION
        );

        return {
          job: user, // In this case, we're returning user instead of job
          score,
          matchedSkills,
          skillsScore,
          experienceScore,
          locationScore
        };
      });

      return matchScores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error in user matching:', error);
      throw error;
    }
  }
} 