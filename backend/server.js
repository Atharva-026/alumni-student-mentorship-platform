require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes (EXISTING)
const studentRoutes = require('./routes/student');
const alumniRoutes = require('./routes/alumni');
const adminRoutes = require('./routes/admin');
const connectionRoutes = require('./routes/connection');

// Import NEW routes
const postRoutes = require('./routes/post');
const notificationRoutes = require('./routes/notification');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Error:', err.message);
  process.exit(1);
});

// Routes (EXISTING)
app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/connection', connectionRoutes);

// Routes (NEW)
app.use('/api/post', postRoutes);
app.use('/api/notification', notificationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Alumni-Student Mentorship API',
    version: '1.0.0',
    status: 'Running ✅'
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});