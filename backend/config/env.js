import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/structural_health_monitoring';
export const JWT_SECRET = process.env.JWT_SECRET || 'shm_secret_key_2026';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
export const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
