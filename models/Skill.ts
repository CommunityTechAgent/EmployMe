import mongoose, { Document, Schema } from 'mongoose';
import { Timestamps } from './types/common';

export interface ISkill extends Document, Timestamps {
  user: mongoose.Types.ObjectId;
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  lastUsed?: Date;
  verified?: boolean;
  verificationSource?: string;
  description?: string;
  tags?: string[];
  isHighlighted?: boolean;
  relevanceScore?: number;
}

const SkillSchema = new Schema<ISkill>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'soft', 'language', 'certification', 'tool', 'framework', 'platform', 'methodology'],
    index: true
  },
  proficiency: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate',
    index: true
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 50
  },
  lastUsed: {
    type: Date
  },
  verified: {
    type: Boolean,
    default: false,
    index: true
  },
  verificationSource: {
    type: String,
    trim: true,
    enum: ['certification', 'work_experience', 'education', 'project', 'test', 'peer_review']
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isHighlighted: {
    type: Boolean,
    default: false,
    index: true
  },
  relevanceScore: {
    type: Number,
    min: 0,
    max: 1
  }
}, { timestamps: true });

// Create a compound index to ensure unique skills per user
SkillSchema.index({ user: 1, name: 1 }, { unique: true });

// Index for searching skills by category and proficiency
SkillSchema.index({ category: 1, proficiency: 1 });

// Index for finding highlighted skills
SkillSchema.index({ user: 1, isHighlighted: 1 });

// Index for finding verified skills
SkillSchema.index({ user: 1, verified: 1 });

// Text index for skill name and description search
SkillSchema.index({ name: 'text', description: 'text' });

// Index for finding skills by last used date
SkillSchema.index({ lastUsed: -1 });

const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
export default Skill; 