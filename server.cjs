const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5173;

// Log memory settings for debugging purposes
console.log(`[${new Date().toISOString()}] Node.js memory settings: ${process.env.NODE_OPTIONS || 'default'}`);

// Check if dist directory exists
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  console.error('ERROR: dist directory not found!');
  console.error('Please run "npm run build" before starting the server.');
  process.exit(1);
}

// Middleware to handle SPA routing (for React Router)
app.use(history());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Send index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something broke on the server!');
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] App available at http://localhost:${PORT}`);
  
  // Signal to PM2 that the app is ready
  if (process.send) {
    try {
      process.send('ready');
      console.log('[PM2] Ready signal sent');
    } catch (error) {
      console.error('[PM2] Error sending ready signal:', error);
      // Continue even if the ready signal fails
    }
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('[PM2] App is shutting down...');
  server.close(() => {
    console.log('[PM2] Server closed gracefully');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds if server doesn't close gracefully
  setTimeout(() => {
    console.error('[PM2] Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err);
  server.close(() => process.exit(1));
}); 