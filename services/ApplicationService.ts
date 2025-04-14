import { Types } from 'mongoose';
import { Application, User, Job } from '../models';

export class ApplicationService {
  /**
   * Submit a new job application
   */
  static async submitApplication(
    userId: string | Types.ObjectId,
    jobId: string | Types.ObjectId,
    applicationData: {
      coverLetter: string;
      resume: string;
      portfolio?: string;
      additionalDocuments?: Array<{ name: string; url: string }>;
    }
  ) {
    try {
      // Verify user and job exist
      const [user, job] = await Promise.all([
        User.findById(userId),
        Job.findById(jobId)
      ]);

      if (!user || !job) {
        throw new Error(user ? 'Job not found' : 'User not found');
      }

      // Check if user has already applied
      const existingApplication = await Application.findOne({
        user: userId,
        job: jobId
      });

      if (existingApplication) {
        throw new Error('You have already applied for this job');
      }

      // Create new application
      const application = await Application.create({
        user: userId,
        job: jobId,
        status: 'pending',
        statusHistory: [{
          status: 'pending',
          date: new Date(),
          notes: 'Application submitted'
        }],
        coverLetter: applicationData.coverLetter,
        resume: applicationData.resume,
        portfolio: applicationData.portfolio,
        additionalDocuments: applicationData.additionalDocuments,
        applicationDate: new Date(),
        lastUpdated: new Date()
      });

      return application;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }

  /**
   * Update application status
   */
  static async updateApplicationStatus(
    applicationId: string | Types.ObjectId,
    newStatus: string,
    notes?: string,
    updatedBy?: string | Types.ObjectId
  ) {
    try {
      const application = await Application.findById(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      // Update status
      application.status = newStatus;
      application.statusHistory.push({
        status: newStatus,
        date: new Date(),
        notes: notes || `Status updated to ${newStatus}`,
        updatedBy
      });
      application.lastUpdated = new Date();

      if (updatedBy) {
        application.viewedBy.push({
          user: updatedBy,
          date: new Date()
        });
      }

      await application.save();
      return application;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  /**
   * Get applications for a job
   */
  static async getJobApplications(
    jobId: string | Types.ObjectId,
    status?: string
  ) {
    try {
      const query = { job: jobId };
      if (status) {
        Object.assign(query, { status });
      }

      const applications = await Application.find(query)
        .populate('user', 'name email')
        .sort({ applicationDate: -1 });

      return applications;
    } catch (error) {
      console.error('Error getting job applications:', error);
      throw error;
    }
  }

  /**
   * Get applications by a user
   */
  static async getUserApplications(
    userId: string | Types.ObjectId,
    status?: string
  ) {
    try {
      const query = { user: userId };
      if (status) {
        Object.assign(query, { status });
      }

      const applications = await Application.find(query)
        .populate('job', 'title company')
        .sort({ applicationDate: -1 });

      return applications;
    } catch (error) {
      console.error('Error getting user applications:', error);
      throw error;
    }
  }

  /**
   * Add interview to application
   */
  static async scheduleInterview(
    applicationId: string | Types.ObjectId,
    interviewData: {
      type: string;
      scheduledDate: Date;
      interviewer: string;
      notes?: string;
    }
  ) {
    try {
      const application = await Application.findById(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      application.interviews.push({
        ...interviewData,
        status: 'scheduled'
      });

      // Update application status if not already in interviewing stage
      if (application.status !== 'interviewing') {
        application.status = 'interviewing';
        application.statusHistory.push({
          status: 'interviewing',
          date: new Date(),
          notes: `Interview scheduled for ${interviewData.type}`
        });
      }

      application.lastUpdated = new Date();
      await application.save();
      return application;
    } catch (error) {
      console.error('Error scheduling interview:', error);
      throw error;
    }
  }
} 