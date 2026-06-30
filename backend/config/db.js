const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MongoDB connection error: MONGO_URI environment variable is not set');
      process.exit(1);
    }
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
      maxIdleTimeMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => console.warn('[MongoDB] Disconnected — reconnecting...'));
    mongoose.connection.on('reconnected', () => console.log('[MongoDB] Reconnected'));
    mongoose.connection.on('error', (err) => console.error('[MongoDB] Connection error:', err.message));
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
