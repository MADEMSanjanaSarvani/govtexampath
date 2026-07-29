const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { setIO } = require('./config/socket');
const { initFirebase } = require('./services/pushService');
const { initWebPush } = require('./services/webPushService');
const { startScheduler: startNotificationScheduler } = require('./services/schedulerService');
const { startScheduler: startScraperScheduler } = require('./services/scheduler');
const { initAI } = require('./services/aiExtractionService');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Set these in your Render dashboard under Environment tab.');
  process.exit(1);
}
if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
  console.error('FATAL: Missing MONGO_URI or MONGODB_URI environment variable.');
  console.error('Set MONGO_URI in your Render dashboard under Environment tab.');
  process.exit(1);
}

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
  'https://govtexampath.com',
  'https://www.govtexampath.com',
  'https://govtexampath-6f751.web.app',
  'https://govtexampath-6f751.firebaseapp.com',
  'http://localhost:3000',
  // Capacitor mobile-app WebView origins. Without these, every API call from
  // the Android/iOS app (login, exams, notifications) is rejected by CORS.
  'https://localhost',
  'http://localhost',
  'capacitor://localhost',
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

  // When a user authenticates, verify JWT and store socket by userId
  socket.on('register_user', (token) => {
    try {
      if (!token) return;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      connectedUsers.set(decoded.id, socket.id);
      console.log(`User ${decoded.id} registered with socket ${socket.id}`);
    } catch {
      // Invalid token — ignore silently
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

// Trust proxy (Render runs behind a reverse proxy)
app.set('trust proxy', 1);

// General API limiter — 300/15min per IP. A single page load makes 10+ API calls,
// so 100 was too low and caused false "Too many requests" errors for normal users.
// Indian mobile carriers commonly put many real users behind one CGNAT IP, so several
// concurrent testers can exhaust this bucket collectively — a Google Sign-In attempt getting
// bounced here is a single-use authorization code wasted, a much worse failure mode than a
// normal page load being briefly throttled. Google OAuth endpoints are exempt for the same
// reason authRoutes.js already exempts them from its own stricter limiter: a valid code/
// credential can only be obtained by actually completing Google's own interactive auth flow,
// so there's minimal abuse risk in not rate-limiting the exchange itself.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/auth/google' || req.path === '/auth/google/code',
});

app.use(helmet({
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));
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

// Health check — must be before apiLimiter so monitors never get rate-limited
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running.' });
});

// Mount routes
app.use('/api', apiLimiter);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/current-affairs', require('./routes/currentAffairRoutes'));
app.use('/api/scraper', require('./routes/scraperRoutes'));
app.use('/api/bot', require('./routes/botRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

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

connectDB().then(async () => {
  // Promote admin on first run
  const { promoteAdmin } = require('./seeds/adminSeed');
  await promoteAdmin();

  // Seed exams into database
  const { seedExams } = require('./seeds/examSeeder');
  await seedExams();

  // Apply known date corrections (immediate, before AI verification)
  const { correctExamDates } = require('./seeds/dateCorrections');
  await correctExamDates();
  // AI-powered date verification runs 2 min after startup via scheduler

  initFirebase();
  initWebPush();
  initAI();
  startNotificationScheduler();
  startScraperScheduler();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Keep Render free tier alive with self-ping every 14 minutes
    const selfUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    const pingUrl = `${selfUrl}/api/health`;
    const httpModule = pingUrl.startsWith('https') ? require('https') : require('http');
    setInterval(() => {
      httpModule.get(pingUrl, (res) => {
        console.log('Keep-alive ping:', res.statusCode);
      }).on('error', (e) => {
        console.error('Ping error:', e.message);
        setTimeout(() => {
          httpModule.get(pingUrl, () => {}).on('error', () => {});
        }, 5000);
      });
    }, 14 * 60 * 1000);
  });
});

// Export for testing purposes
module.exports = { app, server, io };
