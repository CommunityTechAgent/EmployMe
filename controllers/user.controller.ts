import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/request.types';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Application } from '../models';
import { Job } from '../models';

type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicture?: string;
  skills: string[];
  experience: number;
  education?: string;
  portfolioUrl?: string;
  resume?: string;
  location?: string;
  preferredLocations: string[];
  preferredJobTypes: string[];
  preferredWorkArrangement: string;
  salaryExpectation?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  socialMedia?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  availability: string;
  jobSearchStatus: {
    isSearching: boolean;
    lastSearchUpdate?: Date;
    preferredIndustries: string[];
  };
  profileComplete: boolean;
  lastLogin: Date;
  tokens: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): Promise<string>;
  save(): Promise<UserDocument>;
  deleteOne(): Promise<void>;
};

const UserModel = mongoose.model<UserDocument>('User');

interface UserRequest extends Request {
  user?: UserDocument;
}

interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface UserUpdateFields {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  skills?: string[];
  experience?: number;
  education?: string;
  portfolioUrl?: string;
  resume?: string;
  location?: string;
  preferredLocations?: string[];
  preferredJobTypes?: string[];
  preferredWorkArrangement?: string;
  salaryExpectation?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  socialMedia?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  availability?: string;
  jobSearchStatus?: {
    isSearching?: boolean;
    lastSearchUpdate?: Date;
    preferredIndustries?: string[];
  };
  profileComplete?: boolean;
}

export const register = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('Unable to login');
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      throw new Error('Unable to login');
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.token) {
      throw new Error('User or token not found');
    }
    const user = req.user as IUser;
    user.tokens = user.tokens.filter((token: string) => token !== req.token);
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const logoutAll = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new Error('User not found');
    }
    const user = req.user as IUser;
    user.tokens = [];
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  res.send(req.user);
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'email',
    'password',
    'firstName',
    'lastName',
    'phone',
    'profilePicture',
    'skills',
    'experience',
    'education',
    'portfolioUrl',
    'resume',
    'location',
    'preferredLocations',
    'preferredJobTypes',
    'preferredWorkArrangement',
    'salaryExpectation',
    'socialMedia',
    'availability',
    'jobSearchStatus',
    'profileComplete'
  ];
  
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    if (!req.user) {
      throw new Error('User not found');
    }
    const user = req.user as IUser;
    updates.forEach((update) => {
      (user as any)[update] = req.body[update];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new Error('User not found');
    }
    const user = req.user as IUser;
    await user.deleteOne();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const registerUser = async (req: Request<{}, any, RegisterBody>, res: Response) => {
  try {
    const { email, password, firstName, lastName, ...rest } = req.body;
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new UserModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      ...rest,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const loginUser = async (req: Request<{}, any, { email: string; password: string }>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const getUserProfile = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await UserModel.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

export const updateUserProfile = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { password, ...updateData } = req.body;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error });
  }
};

export const deleteUserProfile = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await UserModel.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user profile', error });
  }
};

export const getUserApplications = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const applications = await Application.find({ user: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user applications', error });
  }
};

export const getUserJobs = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user jobs', error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { password, ...updateData } = req.body;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
}; 