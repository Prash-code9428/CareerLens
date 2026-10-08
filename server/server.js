import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import { validateEnvironment } from './config/envValidator.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables (checks current directory and root workspace)
dotenv.config();
dotenv.config({ path: '../.env' });

// Audit & validate environment variables
validateEnvironment();

// Initialize MongoDB connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = rawClientUrl
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

// Standard Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, health check, or mobile requests with no Origin header
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // In development, permit any localhost/127.0.0.1 port
    if (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS request blocked: Origin not allowed'), false);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/opportunities', opportunityRoutes);

// Root fallback route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CareerLens API. Access /api/health for service status.'
  });
});

// Centralized 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 CareerLens Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful Shutdown
const handleShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('HTTP server closed.');
    await disconnectDB();
    console.log('Graceful shutdown completed.');
    process.exit(0);
  });

  // Force exit after 10s if hanging
  setTimeout(() => {
    console.error('Forcing server shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default app;
