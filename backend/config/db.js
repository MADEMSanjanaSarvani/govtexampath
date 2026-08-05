const mongoose = require('mongoose');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MongoDB connection error: MONGO_URI environment variable is not set');
    process.exit(1);
  }

  const MAX_ATTEMPTS = 3;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
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
      return;
    } catch (error) {
      console.error(`MongoDB connection error (attempt ${attempt}/${MAX_ATTEMPTS}): ${error.message}`);
      if (attempt === MAX_ATTEMPTS) {
        process.exit(1);
      }
      await sleep(2000 * attempt);
    }
  }
};

module.exports = connectDB;
