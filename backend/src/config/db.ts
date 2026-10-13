import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connUri = process.env.MONGODB_URI;
    if (!connUri) {
      console.warn('⚠️  MONGODB_URI is not defined in environment variables. Database connection skipped.');
      return;
    }

    const conn = await mongoose.connect(connUri);
    console.log(`⚡ MongoDB Connected: ${conn.connection.host}`);
    const { seedBadges } = await import('../utils/seedBadges');
    await seedBadges();
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    // Don't crash in dev mode if database is offline, log error
  }
};
