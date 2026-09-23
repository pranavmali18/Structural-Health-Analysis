import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { PORT, CLIENT_URL } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import structureRoutes from './routes/structureRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import anomalyRoutes from './routes/anomalyRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
import crackRoutes from './routes/crackRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import etabsRoutes from './routes/etabsRoutes.js';
import { setupMonitoringSockets } from './sockets/monitoringSocket.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { initAlertService } from './services/alertService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Academic Disclaimer Header
app.use((req, res, next) => {
  res.setHeader('X-Academic-Disclaimer', 'AI-based preliminary structural assessment only. Results are intended for academic support and do not replace professional engineering inspection.');
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Structural Health Monitoring Node Backend',
    timestamp: new Date().toISOString(),
    academicDisclaimer: 'AI-based preliminary structural assessment only. Results are intended for academic support and do not replace professional engineering inspection.'
  });
});

// Auth, Structure, Sensor, Anomaly & Risk Routes
app.use('/api/auth', authRoutes);
app.use('/api/structures', structureRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/anomalies', anomalyRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/cracks', crackRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/etabs', etabsRoutes);

// Global Error Middleware
app.use(errorHandler);

// Initialize Socket.IO Monitoring Stream
setupMonitoringSockets(io);

// Initialize Alert Engine with Socket.IO
initAlertService(io);

// Socket.IO Event Handlers
io.on('connection', (socket) => {
  console.log(`[Socket.IO Client Connected]: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket.IO Client Disconnected]: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`[SHM Backend Server] Running on http://localhost:${PORT}`);
});

export { app, io };
