import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { sequelize } from './models';
import authRoutes from './routes/auth.routes';
import queryRoutes from './routes/query.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());

// CORS configuration - support both development and production origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CUSTOMER_PORTAL_URL,
  process.env.ADMIN_PANEL_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});

const leadSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. You have reached the limit for lead submissions. Please try again later.',
  },
});

app.use('/api/', generalLimiter);
app.use('/api/queries', leadSubmissionLimiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'OK', database: 'CONNECTED' });
  } catch (err: any) {
    res.status(500).json({ status: 'ERROR', database: 'DISCONNECTED', error: err.message });
  }
});

// Route mounts
app.use('/api/auth', authRoutes);
app.use('/api', queryRoutes);

// Error handling middleware
app.use(errorHandler);

// Database Sync and Server Boot
async function bootstrap() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    const shouldAlter = process.env.NODE_ENV === 'development';
    await sequelize.sync({ alter: shouldAlter });
    logger.info('Database synchronized successfully.');

    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error: any) {
    logger.error('Unable to start the server:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

bootstrap();
