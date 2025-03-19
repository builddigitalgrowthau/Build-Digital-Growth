const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://build-digital-growth.onrender.com',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Root route for API health check
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API is running',
    version: '1.0.0'
  });
});

// Detailed health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    return res.status(200).json({
      success: true,
      message: 'API is healthy',
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  console.log(`Route not found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Enhanced error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('Request path:', req.path);
  console.error('Request body:', JSON.stringify(req.body, null, 2));
  
  res.status(500).json({
    success: false,
    error: err.message || 'Something went wrong!',
    path: req.path
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📅 ${new Date().toISOString()}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
