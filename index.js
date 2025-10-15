#!/usr/bin/env node

/**
 * Root entry point for Render deployment
 * This file redirects to the server directory
 */

const path = require('path');
const { spawn } = require('child_process');

console.log('Starting Senyokwame application...');
console.log('Current working directory:', process.cwd());
console.log('Looking for server in:', path.join(__dirname, 'server'));

// Change to server directory
const serverPath = path.join(__dirname, 'server');
const indexPath = path.join(serverPath, 'index.js');

console.log('Server path:', serverPath);
console.log('Index file path:', indexPath);

// Check if server directory exists
const fs = require('fs');
if (!fs.existsSync(serverPath)) {
  console.error('Server directory not found at:', serverPath);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('Server index.js not found at:', indexPath);
  process.exit(1);
}

// Change to server directory and start the application
process.chdir(serverPath);
console.log('Changed to server directory:', process.cwd());

// Start the server
console.log('Starting server with: node index.js');
const server = spawn('node', ['index.js'], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.kill('SIGINT');
});
