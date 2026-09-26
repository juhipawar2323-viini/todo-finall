const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// CORS
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://todos-app-pearl-beta.vercel.app',
  'https://todos-app-omega-lake.vercel.app'
];
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)
  : defaultAllowedOrigins;

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header (health checks, curl) are safe to allow.
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Todo API is running. Go to /api/health to check health.');
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Todo API'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Todo API is running'
  });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
