import { Request, Response } from 'express';
import { Job, Application } from '../models';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: any;
}

interface JobParams {
  id: string;
}

interface JobBody {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
  requirements: string[];
  skills: string[];
  postedBy: string;
  [key: string]: any;
}

export const createJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const job = new Job({
      ...req.body,
      postedBy: req.user._id
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error });
  }
};

export const getJob = async (req: Request<JobParams>, res: Response) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'firstName lastName email')
      .populate('applications');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error });
  }
};

export const updateJob = async (req: AuthenticatedRequest & Request<JobParams>, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error });
  }
};

export const deleteJob = async (req: AuthenticatedRequest & Request<JobParams>, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    // Delete associated applications
    await Application.deleteMany({ job: job._id });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
};

export const listJobs = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      salary,
      skills
    } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (salary) {
      query.salary = { $gte: Number(salary) };
    }

    if (skills) {
      query.skills = { $in: (skills as string).split(',') };
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
};

export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const jobs = await Job.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error searching jobs', error });
  }
};

export const getJobApplications = async (req: AuthenticatedRequest & Request<JobParams>, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const applications = await Application.find({ job: job._id })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job applications', error });
  }
}; 