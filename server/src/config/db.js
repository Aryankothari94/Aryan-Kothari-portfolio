import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[DB] MONGODB_URI not set — running without MongoDB connection.');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log(`[DB] MongoDB connected: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[DB] MongoDB connection skipped/failed: ${error.message}`);
    return false;
  }
}

