#!/usr/bin/env node

// DecentraMind Labs Frontend Launcher
// This script starts the Next.js development server

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting DecentraMind Labs Frontend...');

// Set the working directory
process.chdir('/Users/davidbonillajaylen2022/DecentraMind');

// Kill any existing processes on port 3000
const { exec } = require('child_process');
exec('lsof -ti:3000 | xargs kill -9 2>/dev/null || true', (error) => {
  if (error) {
    console.log('ℹ️  No existing processes on port 3000');
  } else {
    console.log('🔄 Killed existing processes on port 3000');
  }
  
  // Wait a moment
  setTimeout(() => {
    startNextServer();
  }, 2000);
});

function startNextServer() {
  console.log('🚀 Launching Next.js development server...');
  console.log('📍 URL: http://localhost:3000');
  console.log('⏳ Please wait 10-15 seconds for compilation...');
  
  // Start Next.js development server
  const nextProcess = spawn('/Users/davidbonillajaylen2022/.nvm/versions/node/v20.10.0/bin/node', [
    'node_modules/.bin/next',
    'dev',
    '--port',
    '3000'
  ], {
    stdio: 'inherit',
    cwd: '/Users/davidbonillajaylen2022/DecentraMind'
  });

  nextProcess.on('error', (error) => {
    console.error('❌ Error starting Next.js:', error.message);
    process.exit(1);
  });

  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    nextProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    nextProcess.kill('SIGTERM');
    process.exit(0);
  });
}
