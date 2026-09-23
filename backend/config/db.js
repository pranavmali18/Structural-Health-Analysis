import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Database connection failed (${error.message}). Running in mock memory mode for academic demo.`);
  }
};
