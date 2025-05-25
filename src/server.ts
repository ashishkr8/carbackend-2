import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db';
import userRoutes from './routes/user.routes';
import {authRoutes,authRoutes1} from './routes/auth.routes';
import carRoutes from './routes/cars.routes';
import bookingRoutes from './routes/bookings.routes';
import {feedbackRoutes, feedbackRoutes1} from './routes/feedbacks.routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // or even '10mb' if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());          // ✅ Correctly imported and used
app.use(helmet());


// Routes
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);
app.use('/bookings', bookingRoutes);
app.use('/feedbacks', feedbackRoutes);
app.use('/users', userRoutes);

app.use('/api/v1/auth', authRoutes1);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/feedbacks', feedbackRoutes1);
app.use('/api/v1/users', userRoutes);



// Error handler (should be after all routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚗 Server is running on port ${PORT}`);
});
