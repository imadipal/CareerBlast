import mongoose from 'mongoose';

// MongoDB Configuration
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerblast';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Database connection status
export const getConnectionStatus = () => {
  return mongoose.connection.readyState;
};

// Connection states:
// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting

export default connectDB;
