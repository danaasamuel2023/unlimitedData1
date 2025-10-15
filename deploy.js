#!/usr/bin/env node

// Simple deployment script for Render
// This file can be used as an alternative entry point

const path = require('path');
const { spawn } = require('child_process');

// Change to server directory and start the application
process.chdir(path.join(__dirname, 'server'));

console.log('Starting server from:', process.cwd());

// Start the server
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
