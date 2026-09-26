const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabase');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// CORS configuration
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://frontend-todo-sandy.vercel.app',
  'https://todos-app-pearl-beta.vercel.app',
  'https://todos-app-omega-lake.vercel.app'
];

const envUrls = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envUrls]));

app.use(cors({
  origin(origin, callback) {
    // Requests without origin (curl, Postman, health checks, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, '');

    // Allow only configured browser origins. Add every Vercel domain to FRONTEND_URLS.
    if (
      allowedOrigins.includes(cleanOrigin) ||
      allowedOrigins.includes('*') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS origin not allowed: ${cleanOrigin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
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

// Health Check with Database Diagnostics
app.get('/api/health', async (req, res) => {
  let dbStatus = 'checking';
  let dbMessage = '';
  let tables = {};
  try {
    const results = await Promise.all(['users', 'todos'].map(async (table) => {
      const { error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
      return [table, error ? error.message : 'connected'];
    }));
    tables = Object.fromEntries(results);
    const failedTable = results.find(([, status]) => status !== 'connected');

    if (failedTable) {
      dbStatus = 'error';
      dbMessage = `${failedTable[0]} table: ${failedTable[1]}`;
    } else {
      dbStatus = 'connected';
      dbMessage = 'Successfully queried Supabase users and todos tables';
    }
  } catch (err) {
    dbStatus = 'error';
    dbMessage = err.message;
  }

  res.status(200).json({
    success: true,
    message: 'Todo API is running',
    database: {
      status: dbStatus,
      message: dbMessage,
      tables,
      supabaseUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/\/$/, '') : 'NOT_SET'
    }
  });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
