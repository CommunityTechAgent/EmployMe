import mongoose from 'mongoose';
import { User, Job } from './models';
import { JobMatchingService } from './services/JobMatchingService';

async function testJobMatching() {
  try {
    await mongoose.connect('mongodb://localhost:27017/job-match-ai');
    console.log('✅ Connected to MongoDB');

    // Get our test users
    const users = await User.find({});
    const jobs = await Job.find({});

    if (users.length === 0 || jobs.length === 0) {
      console.error('❌ No test data found. Please run init-db.ts first.');
      return;
    }

    // Test matching jobs for first user
    console.log('\n🔍 Testing job matches for user:', users[0].name);
    const jobMatches = await JobMatchingService.findMatchesForUser(users[0]._id);
    
    console.log('\nMatched Jobs:');
    jobMatches.forEach((match, index) => {
      console.log(`\n${index + 1}. ${match.job.title} at ${match.job.company}`);
      console.log(`   Match Score: ${(match.score * 100).toFixed(1)}%`);
      console.log(`   - Skills Score: ${(match.skillsScore * 100).toFixed(1)}%`);
      console.log(`   - Experience Score: ${(match.experienceScore * 100).toFixed(1)}%`);
      console.log(`   - Location Score: ${(match.locationScore * 100).toFixed(1)}%`);
      console.log(`   - Matched Skills: ${match.matchedSkills.join(', ')}`);
    });

    // Test matching users for first job
    console.log('\n🔍 Testing user matches for job:', jobs[0].title);
    const userMatches = await JobMatchingService.findMatchesForJob(jobs[0]._id);

    console.log('\nMatched Users:');
    userMatches.forEach((match, index) => {
      console.log(`\n${index + 1}. ${match.job.name}`);
      console.log(`   Match Score: ${(match.score * 100).toFixed(1)}%`);
      console.log(`   - Skills Score: ${(match.skillsScore * 100).toFixed(1)}%`);
      console.log(`   - Experience Score: ${(match.experienceScore * 100).toFixed(1)}%`);
      console.log(`   - Location Score: ${(match.locationScore * 100).toFixed(1)}%`);
      console.log(`   - Matched Skills: ${match.matchedSkills.join(', ')}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('❌ Error testing job matching:', error);
    await mongoose.disconnect();
  }
}

testJobMatching(); 