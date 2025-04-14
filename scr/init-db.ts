import mongoose from 'mongoose';
import { User, Job, Application, Skill } from './models';

async function initDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/job-match-ai');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Skill.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create sample skills
    await Skill.insertMany([
      { name: 'JavaScript', category: 'Programming', description: 'JavaScript programming language' },
      { name: 'Python', category: 'Programming', description: 'Python programming language' },
      { name: 'React', category: 'Frontend', description: 'React.js framework' },
      { name: 'Node.js', category: 'Backend', description: 'Node.js runtime' },
      { name: 'MongoDB', category: 'Database', description: 'MongoDB database' },
      { name: 'TypeScript', category: 'Programming', description: 'TypeScript programming language' }
    ]);
    console.log('✅ Created sample skills');

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password_1',
        phone: '+1 (555) 123-4567',
        profilePicture: 'https://example.com/john-doe.jpg',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: 3,
        education: 'Bachelor in Computer Science',
        portfolioUrl: 'https://johndoe.dev',
        location: 'New York',
        preferredLocations: ['New York', 'Remote'],
        preferredJobTypes: ['full-time', 'contract'],
        preferredWorkArrangement: 'hybrid',
        salaryExpectation: {
          min: 80000,
          max: 120000,
          currency: 'USD'
        },
        socialMedia: {
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
          twitter: 'https://twitter.com/johndoe'
        },
        availability: 'actively-looking',
        jobSearchStatus: {
          isSearching: true,
          lastSearchUpdate: new Date(),
          preferredIndustries: ['Technology', 'Finance']
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'hashed_password_2',
        phone: '+1 (555) 987-6543',
        profilePicture: 'https://example.com/jane-smith.jpg',
        skills: ['Python', 'MongoDB', 'TypeScript'],
        experience: 5,
        education: 'Master in Software Engineering',
        portfolioUrl: 'https://janesmith.dev',
        location: 'San Francisco',
        preferredLocations: ['San Francisco', 'Remote'],
        preferredJobTypes: ['full-time'],
        preferredWorkArrangement: 'remote',
        salaryExpectation: {
          min: 100000,
          max: 150000,
          currency: 'USD'
        },
        socialMedia: {
          linkedin: 'https://linkedin.com/in/janesmith',
          github: 'https://github.com/janesmith',
          twitter: 'https://twitter.com/janesmith'
        },
        availability: 'open-to-offers',
        jobSearchStatus: {
          isSearching: true,
          lastSearchUpdate: new Date(),
          preferredIndustries: ['Technology', 'Healthcare']
        }
      }
    ]);
    console.log('✅ Created sample users');

    // Create sample jobs
    const jobs = await Job.insertMany([
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        description: 'Looking for an experienced frontend developer to join our team...',
        requirements: ['5+ years of experience', 'Strong React skills', 'TypeScript expertise'],
        skills: ['JavaScript', 'React', 'TypeScript'],
        type: 'full-time',
        status: 'active',
        numberOfOpenings: 2,
        location: 'New York',
        workArrangement: 'hybrid',
        salary: {
          min: 100000,
          max: 150000,
          currency: 'USD',
          isNegotiable: true
        },
        benefits: [
          'health-insurance',
          'dental-insurance',
          '401k',
          'stock-options',
          'paid-time-off',
          'professional-development'
        ],
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        applicationProcess: [
          {
            step: 'Initial Screening',
            description: 'Resume and portfolio review',
            estimatedTime: '1-2 weeks'
          },
          {
            step: 'Technical Interview',
            description: 'Coding challenge and technical discussion',
            estimatedTime: '1 week'
          },
          {
            step: 'Final Interview',
            description: 'Team fit and culture discussion',
            estimatedTime: '1 week'
          }
        ],
        requiredDocuments: ['Resume', 'Portfolio', 'Cover Letter'],
        companyWebsite: 'https://techcorp.com',
        companyDescription: 'A leading technology company specializing in web applications...',
        companyLogo: 'https://techcorp.com/logo.png',
        postedBy: users[0]._id
      },
      {
        title: 'Backend Developer',
        company: 'StartupX',
        description: 'Seeking a backend developer with Node.js experience to help scale our platform...',
        requirements: ['3+ years of experience', 'Node.js expertise', 'Database design skills'],
        skills: ['Node.js', 'MongoDB', 'JavaScript'],
        type: 'full-time',
        status: 'active',
        numberOfOpenings: 1,
        location: 'San Francisco',
        workArrangement: 'remote',
        salary: {
          min: 90000,
          max: 130000,
          currency: 'USD',
          isNegotiable: true
        },
        benefits: [
          'health-insurance',
          'dental-insurance',
          '401k',
          'paid-time-off',
          'remote-work',
          'flexible-hours'
        ],
        applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        applicationProcess: [
          {
            step: 'Initial Screening',
            description: 'Resume review and technical assessment',
            estimatedTime: '1 week'
          },
          {
            step: 'Technical Interview',
            description: 'System design and coding challenge',
            estimatedTime: '1 week'
          }
        ],
        requiredDocuments: ['Resume', 'Cover Letter'],
        companyWebsite: 'https://startupx.com',
        companyDescription: 'An innovative startup revolutionizing the tech industry...',
        companyLogo: 'https://startupx.com/logo.png',
        postedBy: users[1]._id
      }
    ]);
    console.log('✅ Created sample jobs');

    // Create sample applications
    await Application.insertMany([
      {
        user: users[0]._id,
        job: jobs[0]._id,
        status: 'interviewing',
        statusHistory: [
          {
            status: 'pending',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            notes: 'Application submitted'
          },
          {
            status: 'reviewed',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            notes: 'Initial review completed'
          },
          {
            status: 'shortlisted',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            notes: 'Candidate shortlisted for interview'
          },
          {
            status: 'interviewing',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            notes: 'First interview scheduled'
          }
        ],
        coverLetter: 'I am excited to apply for the Senior Frontend Developer position at TechCorp...',
        resume: 'https://example.com/resumes/john-doe.pdf',
        portfolio: 'https://johndoe.dev',
        additionalDocuments: [
          {
            name: 'Project Samples',
            url: 'https://example.com/projects/john-doe',
            uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        ],
        interviews: [
          {
            type: 'technical',
            scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            interviewer: 'Sarah Johnson',
            notes: 'Technical assessment focusing on React and TypeScript',
            status: 'scheduled'
          }
        ],
        messages: [
          {
            sender: users[0]._id,
            content: 'Thank you for considering my application. I look forward to the interview process.',
            sentAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            read: true
          }
        ],
        source: 'company-website',
        applicationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(),
        viewedBy: [
          {
            user: users[1]._id,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          }
        ],
        notes: 'Strong candidate with relevant experience'
      },
      {
        user: users[1]._id,
        job: jobs[1]._id,
        status: 'reviewed',
        statusHistory: [
          {
            status: 'pending',
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            notes: 'Application submitted'
          },
          {
            status: 'reviewed',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            notes: 'Initial review completed'
          }
        ],
        coverLetter: 'I am interested in the Backend Developer position at StartupX...',
        resume: 'https://example.com/resumes/jane-smith.pdf',
        portfolio: 'https://janesmith.dev',
        additionalDocuments: [
          {
            name: 'Code Samples',
            url: 'https://github.com/janesmith/samples',
            uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
          }
        ],
        source: 'referral',
        referral: {
          name: 'Michael Brown',
          relationship: 'Former Colleague',
          contact: 'michael@example.com'
        },
        applicationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(),
        viewedBy: [
          {
            user: users[0]._id,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ],
        notes: 'Good fit for the role, schedule interview'
      }
    ]);
    console.log('✅ Created sample applications');

    console.log('✨ Database initialization completed successfully!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    await mongoose.disconnect();
  }
}

initDatabase(); 