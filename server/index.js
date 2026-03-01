const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./config/db');
const { testPostgresConnection } = require('./config/postgres');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
const assignmentsRouter = require('./routes/assignments');
const queryRouter = require('./routes/query');
const hintsRouter = require('./routes/hints');
const path = require('path');

app.use('/api/assignments', assignmentsRouter);
app.use('/api/query', queryRouter);
app.use('/api/hints', hintsRouter);

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✓ MongoDB connected');

    // Test PostgreSQL connection
    await testPostgresConnection();
    console.log('✓ PostgreSQL connected');

    app.listen(PORT, () => {
      console.log(`\n🚀 CipherSQLStudio server running on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Static Files Serving: ${process.env.NODE_ENV === 'production' ? 'ENABLED' : 'DISABLED'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
