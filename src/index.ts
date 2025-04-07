import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import path from 'path';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins for testing
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/users', userRoutes);

// Home route
app.get('/', (req: Request, res: Response) => {
  res.send('SkinCare API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
