import { Request, Response, NextFunction } from 'express';
import { Application, Job, User } from '../models';
import { Types } from 'mongoose';
import { IJob } from '../models/Job';
import { AppError } from '../utils/error.utils';
import { IUser } from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

interface ApplicationParams {
  id: string;
}

interface ApplicationBody {
  jobId: string;
  coverLetter?: string;
  resume?: string;
  portfolio?: string;
  additionalDocuments?: string[];
  status?: string;
  notes?: string;
  updatedBy?: string;
  type?: string;
  scheduledDate?: string;
  interviewer?: string;
}

interface PopulatedJob extends Omit<IJob, 'postedBy'> {
  postedBy: Types.ObjectId;
}

export const createApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { jobId, coverLetter, resume, portfolio, additionalDocuments } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      user: req.user._id,
      job: jobId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      user: req.user._id,
      job: jobId,
      coverLetter,
      resume,
      portfolio,
      additionalDocuments,
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        date: new Date(),
        notes: 'Application submitted'
      }]
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error creating application', error });
  }
};

export const getApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'job',
        select: 'title company postedBy',
        populate: {
          path: 'postedBy',
          select: '_id'
        }
      });

    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    // Check if user is authorized to view the application
    if (application.user._id.toString() !== req.user._id.toString() && 
        application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req: AuthenticatedRequest & Request<ApplicationParams>, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const application = await Application.findById(req.params.id)
      .populate<{ job: PopulatedJob }>('job', 'postedBy');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is authorized to update the application
    if (application.user.toString() !== req.user._id.toString() && 
        application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error });
  }
};

export const deleteApplication = async (req: AuthenticatedRequest & Request<ApplicationParams>, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const application = await Application.findById(req.params.id)
      .populate<{ job: PopulatedJob }>('job', 'postedBy');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is authorized to delete the application
    if (application.user.toString() !== req.user._id.toString() && 
        application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error });
  }
};

export const listApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { status, jobId, userId } = req.query;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (jobId) {
      query.job = jobId;
    }

    if (userId) {
      query.user = userId;
    }

    // If user is not an admin, only show their own applications or applications for their jobs
    if (req.user.role !== 'admin') {
      const jobs = await Job.find({ postedBy: req.user._id });
      const jobIds = jobs.map(job => job._id);
      
      query.$or = [
        { user: req.user._id },
        { job: { $in: jobIds } }
      ];
    }

    const applications = await Application.find(query)
      .populate('user', 'firstName lastName email')
      .populate('job', 'title company')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
};

export const updateApplicationStatus = async (req: AuthenticatedRequest & Request<ApplicationParams>, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id)
      .populate<{ job: PopulatedJob }>('job', 'postedBy');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is authorized to update the status
    if (application.job.postedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update application status' });
    }

    // Add status change to history
    application.statusHistory.push({
      status,
      date: new Date(),
      notes: notes || `Status changed to ${status}`
    });

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status', error });
  }
};

export const getApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applications = await Application.find()
      .populate('user', 'name email')
      .populate({
        path: 'job',
        select: 'title company postedBy',
        populate: {
          path: 'postedBy',
          select: '_id'
        }
      });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

export const scheduleInterview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { type, scheduledDate, interviewer, notes } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    application.interviews.push({
      type,
      scheduledDate: new Date(scheduledDate),
      interviewer,
      notes
    });

    await application.save();
    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const getJobApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;
    const { status } = req.query;

    const query: any = { job: jobId };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'job',
        select: 'title company postedBy',
        populate: {
          path: 'postedBy',
          select: '_id'
        }
      });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

export const getUserApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const query: any = { user: userId };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'job',
        select: 'title company postedBy',
        populate: {
          path: 'postedBy',
          select: '_id'
        }
      });

    res.json(applications);
  } catch (error) {
    next(error);
  }
}; 