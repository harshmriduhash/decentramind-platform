#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting DecentraMind Labs Next.js Development Server...');

// Set up environment
process.env.NODE_ENV = 'development';
process.env.PORT = '3000';

// Path to Next.js binary
const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next');
const args = ['dev', '--port', '3000'];

console.log('Starting Next.js development server on port 3000...');
console.log('Command:', nextPath, args.join(' '));

// Start the server
const child = spawn('node', [nextPath, ...args], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    PATH: process.env.PATH
  }
});

child.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server...');
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping server...');
  child.kill('SIGTERM');
  process.exit(0);
});

