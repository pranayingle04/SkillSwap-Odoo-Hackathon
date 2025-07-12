
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import swapRoutes from './routes/swap.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config({ path: './.env' });

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); 

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/swaps', swapRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send(' Skill Swap API is running');
});

//error Handler
app.use((err, req, res, next) => {
  console.error(' Error:', err.message);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Start server after DB connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 9000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 9000}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
