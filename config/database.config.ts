import mongoose from 'mongoose';

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
  poolSize: number;
  connectionTimeout: number;
  socketTimeout: number;
  reconnectInterval: number;
  reconnectAttempts: number;
}

const databaseConfig: DatabaseConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/jobhub',
  options: {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASSWORD,
    dbName: process.env.MONGODB_DATABASE || 'jobhub',
  },
  poolSize: 10,
  connectionTimeout: 30000,
  socketTimeout: 45000,
  reconnectInterval: 1000,
  reconnectAttempts: 10,
};

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(databaseConfig.uri, {
      ...databaseConfig.options,
      maxPoolSize: databaseConfig.poolSize,
      connectTimeoutMS: databaseConfig.connectionTimeout,
      socketTimeoutMS: databaseConfig.socketTimeout,
      retryWrites: true,
      retryReads: true,
    });
    
    console.log('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export { connectDB, databaseConfig };
export type { DatabaseConfig }; 