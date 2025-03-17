/**
 * index.js
 * 
 * Main server file for the Farm Management System
 */

const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const metadataRoutes = require('./src/metadata/api');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/metadata', metadataRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Farm Management System API',
    version: '0.1.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 