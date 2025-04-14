import mongoose from 'mongoose';

// User indexes
export const userIndexes = [
  { email: 1 }, // Unique index for email
  { 'jobSearchStatus.isSearching': 1, location: 1 }, // For job matching
  { skills: 1 }, // For skill-based searches
  { 'preferredJobTypes': 1 }, // For job type matching
  { 'preferredWorkArrangement': 1 }, // For work arrangement matching
  { 'salaryExpectation.min': 1, 'salaryExpectation.max': 1 } // For salary range queries
];

// Job indexes
export const jobIndexes = [
  { title: 'text', description: 'text', company: 'text' }, // Text search index
  { status: 1, type: 1 }, // For filtering active jobs
  { location: 1 }, // For location-based searches
  { workArrangement: 1 }, // For work arrangement filtering
  { 'salary.min': 1, 'salary.max': 1 }, // For salary range queries
  { skills: 1 }, // For skill-based searches
  { postedBy: 1 }, // For employer's job listings
  { applicationDeadline: 1 } // For expiring jobs
];

// Application indexes
export const applicationIndexes = [
  { user: 1, job: 1 }, // For checking duplicate applications
  { job: 1, status: 1 }, // For job application statistics
  { user: 1, status: 1 }, // For user's application status
  { 'interviews.scheduledDate': 1 }, // For upcoming interviews
  { applicationDate: -1 } // For recent applications
];

// Skill indexes
export const skillIndexes = [
  { name: 1 }, // Unique index for skill name
  { category: 1 } // For category-based queries
];

// Function to create indexes
export const createIndexes = async () => {
  try {
    // Create User indexes
    await mongoose.model('User').createIndexes(userIndexes);
    
    // Create Job indexes
    await mongoose.model('Job').createIndexes(jobIndexes);
    
    // Create Application indexes
    await mongoose.model('Application').createIndexes(applicationIndexes);
    
    // Create Skill indexes
    await mongoose.model('Skill').createIndexes(skillIndexes);
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating database indexes:', error);
    throw error;
  }
}; 