const mongoose = require('mongoose');

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
    dbs.databases.forEach((db) => {
      console.log(`- ${db.name}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }
}

testConnection(); 