
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

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4173',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Additional middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

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
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`API available at http://localhost:${port}/api`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
