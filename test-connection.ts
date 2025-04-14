import mongoose from 'mongoose';
import { User, Job, Application, Skill } from './models';

async function testConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/job-match-ai');
    console.log('✅ MongoDB connection successful');
    
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    
    // Get MongoDB version
    const adminDb = mongoose.connection.db.admin();
    const buildInfo = await adminDb.buildInfo();
    console.log('MongoDB Version:', buildInfo.version);
    
    // List databases
    const dbs = await adminDb.listDatabases();
    console.log('\nAvailable databases:');
    dbs.databases.forEach((db: any) => {
      console.log(`- ${db.name}`);
    });

    // Show collection contents
    console.log('\nUsers:');
    const users = await User.find();
    console.log(JSON.stringify(users, null, 2));

    console.log('\nJobs:');
    const jobs = await Job.find();
    console.log(JSON.stringify(jobs, null, 2));

    console.log('\nSkills:');
    const skills = await Skill.find();
    console.log(JSON.stringify(skills, null, 2));

    console.log('\nApplications:');
    const applications = await Application.find();
    console.log(JSON.stringify(applications, null, 2));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    await mongoose.disconnect();
  }
}

testConnection(); 