const { spawn } = require('child_process');
const path = require('path');

const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next');
const args = ['dev', '--port', '3000'];

console.log('Starting Next.js development server...');
console.log('Command:', nextPath, args.join(' '));

const child = spawn(nextPath, args, {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    PATH: process.env.PATH
  }
});

child.on('error', (error) => {
  console.error('Failed to start server:', error);
});

child.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('Stopping server...');
  child.kill('SIGINT');
  process.exit(0);
});

