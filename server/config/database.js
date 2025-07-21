const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('[Database] Attempting to connect to MongoDB...');
    console.log('[Database] Database URL:', process.env.DATABASE_URL ? 'Present' : 'Missing');
    
    const conn = await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/LifePilot', { // INPUT_REQUIRED {MongoDB connection string}
      // Remove deprecated options
    });
    
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    console.log(`[Database] Database name: ${conn.connection.name}`);
    console.log(`[Database] Connection ready state: ${conn.connection.readyState}`);
  } catch (error) {
    console.error('[Database] Database connection error:', error.message);
    console.error('[Database] Full error details:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('[Database] Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('[Database] Mongoose connection error:', err.message);
  console.error('[Database] Error details:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('[Database] Mongoose disconnected from MongoDB');
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    console.log('[Database] Received SIGINT, closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('[Database] MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('[Database] Error closing MongoDB connection:', error.message);
    process.exit(1);
  }
});

module.exports = { connectDB };