// server.js - Main Server File
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const assetRoutes = require("./routes/assetRoutes");

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use("/api/assets", assetRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running!',
    database: 'Firebase Firestore',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔥 Using Firebase Firestore`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;

module.exports = app;