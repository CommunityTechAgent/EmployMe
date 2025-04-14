/**
 * @module Models
 * @description Documentation for all database models and their relationships
 */

/**
 * @interface IUser
 * @description User model interface representing a job seeker or employer
 * @property {string} _id - MongoDB unique identifier
 * @property {string} email - User's email address (unique)
 * @property {string} password - Hashed password
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} role - User's role (jobSeeker/employer)
 * @property {string} [phone] - User's phone number
 * @property {string} [profilePicture] - URL to user's profile picture
 * @property {string} [bio] - User's biography
 * @property {string} [resume] - URL to user's resume
 * @property {string[]} [skills] - Array of user's skills
 * @property {string[]} [preferredJobTypes] - Array of preferred job types
 * @property {Object} [salaryExpectation] - User's salary expectations
 * @property {Date} createdAt - Timestamp of user creation
 * @property {Date} updatedAt - Timestamp of last update
 */

/**
 * @interface IJob
 * @description Job model interface representing a job posting
 * @property {string} _id - MongoDB unique identifier
 * @property {string} title - Job title
 * @property {string} description - Job description
 * @property {string} company - Company name
 * @property {Object} location - Job location details
 * @property {string} jobType - Type of job (full-time/part-time/etc)
 * @property {string} workArrangement - Work arrangement (remote/on-site/hybrid)
 * @property {string} experienceLevel - Required experience level
 * @property {Object} salary - Salary range
 * @property {string[]} skills - Required skills
 * @property {string[]} requirements - Job requirements
 * @property {string[]} responsibilities - Job responsibilities
 * @property {string[]} benefits - Job benefits
 * @property {string} status - Job status (active/closed)
 * @property {ObjectId} postedBy - Reference to user who posted the job
 * @property {ObjectId[]} applications - Array of application references
 * @property {number} views - Number of job views
 * @property {Date} expiresAt - Job expiration date
 * @property {Date} createdAt - Timestamp of job creation
 * @property {Date} updatedAt - Timestamp of last update
 */

/**
 * @interface IApplication
 * @description Application model interface representing a job application
 * @property {string} _id - MongoDB unique identifier
 * @property {ObjectId} user - Reference to applicant user
 * @property {ObjectId} job - Reference to applied job
 * @property {string} status - Application status
 * @property {Object[]} statusHistory - History of status changes
 * @property {string} coverLetter - Application cover letter
 * @property {string} [portfolio] - URL to applicant's portfolio
 * @property {string[]} [additionalDocuments] - Array of additional document URLs
 * @property {Object[]} interviews - Array of interview details
 * @property {Object[]} messages - Array of communication messages
 * @property {string} source - Application source
 * @property {Object} [referral] - Referral details if applicable
 * @property {Date} applicationDate - Date of application
 * @property {Date} lastUpdated - Timestamp of last update
 * @property {ObjectId[]} viewedBy - Array of users who viewed the application
 * @property {Date} createdAt - Timestamp of application creation
 * @property {Date} updatedAt - Timestamp of last update
 */

/**
 * @interface ISkill
 * @description Skill model interface representing a skill
 * @property {string} _id - MongoDB unique identifier
 * @property {string} name - Skill name
 * @property {string} category - Skill category
 * @property {string} [description] - Skill description
 * @property {number} popularity - Skill popularity score
 * @property {Date} createdAt - Timestamp of skill creation
 * @property {Date} updatedAt - Timestamp of last update
 */

/**
 * @description Model Relationships
 * 
 * User -> Job (One-to-Many)
 * - A user can post multiple jobs
 * - A job is posted by one user
 * 
 * User -> Application (One-to-Many)
 * - A user can submit multiple applications
 * - An application is submitted by one user
 * 
 * Job -> Application (One-to-Many)
 * - A job can receive multiple applications
 * - An application is for one job
 * 
 * User -> Skill (Many-to-Many)
 * - A user can have multiple skills
 * - A skill can be associated with multiple users
 * 
 * Job -> Skill (Many-to-Many)
 * - A job can require multiple skills
 * - A skill can be required by multiple jobs
 */

/**
 * @description Database Indexes
 * 
 * User Indexes:
 * - { email: 1 } - Unique index for email lookups
 * - { 'jobSearchStatus.isSearching': 1, location: 1 } - Optimized for job matching queries
 * - { skills: 1 } - Optimized for skill-based searches
 * - { 'preferredJobTypes': 1 } - Optimized for job type matching
 * - { 'preferredWorkArrangement': 1 } - Optimized for work arrangement matching
 * - { 'salaryExpectation.min': 1, 'salaryExpectation.max': 1 } - Optimized for salary range queries
 * 
 * Job Indexes:
 * - { title: 'text', description: 'text', company: 'text' } - Text search index for job content
 * - { status: 1, type: 1 } - Optimized for filtering active jobs
 * - { location: 1 } - Optimized for location-based searches
 * - { workArrangement: 1 } - Optimized for work arrangement filtering
 * - { 'salary.min': 1, 'salary.max': 1 } - Optimized for salary range queries
 * - { skills: 1 } - Optimized for skill-based searches
 * - { postedBy: 1 } - Optimized for employer's job listings
 * - { applicationDeadline: 1 } - Optimized for expiring jobs
 * 
 * Application Indexes:
 * - { user: 1, job: 1 } - Optimized for checking duplicate applications
 * - { job: 1, status: 1 } - Optimized for job application statistics
 * - { user: 1, status: 1 } - Optimized for user's application status
 * - { 'interviews.scheduledDate': 1 } - Optimized for upcoming interviews
 * - { applicationDate: -1 } - Optimized for recent applications
 * 
 * Skill Indexes:
 * - { name: 1 } - Unique index for skill name lookups
 * - { category: 1 } - Optimized for category-based queries
 */

/**
 * @description Data Validations
 * 
 * User Validations:
 * - Email format validation using regex
 * - Password strength validation (minimum 8 characters)
 * - Salary expectations validation (min not greater than max)
 * - Preferred job types validation (at least one required)
 * 
 * Job Validations:
 * - Salary range validation (min not greater than max)
 * - Application deadline validation (not in the past)
 * - Required fields validation (title, description, company, location)
 * - Skills validation (at least one required)
 * 
 * Application Validations:
 * - User and job reference validation
 * - Cover letter length validation (minimum 50 characters)
 * - Interview dates validation (not in the past)
 * 
 * Validation Middleware:
 * - Pre-save hooks for all models
 * - Automatic validation before document save
 * - Error handling for validation failures
 */ 