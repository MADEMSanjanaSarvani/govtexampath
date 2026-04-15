const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { setIO } = require('./config/socket');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Set these in your Render dashboard under Environment tab.');
}
if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
  console.error('FATAL: Missing MONGO_URI or MONGODB_URI environment variable.');
  console.error('Set MONGO_URI in your Render dashboard under Environment tab.');
}

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
  'https://govtexampath.com',
  'https://www.govtexampath.com',
  'https://govtexampath.netlify.app',
  'https://main--govtexampath.netlify.app',
  'http://localhost:3000',
];
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Store the io instance so controllers can access it
setIO(io);

// Track connected users by userId
const connectedUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // When a user authenticates, store their socket by userId
  socket.on('register_user', (userId) => {
    if (userId) {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Remove the user from connected users map
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make connectedUsers accessible if needed
app.set('connectedUsers', connectedUsers);

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/current-affairs', require('./routes/currentAffairRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running.' });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Keep Render free tier alive with self-ping every 14 minutes
    const https = require('https');
    setInterval(() => {
      https.get('https://govtexampath-backend.onrender.com/api/health', (res) => {
        console.log('Keep-alive ping:', res.statusCode);
      }).on('error', (e) => {
        console.error('Ping error:', e.message);
      });
    }, 14 * 60 * 1000);
  });
});

// Export for testing purposes
module.exports = { app, server, io };
