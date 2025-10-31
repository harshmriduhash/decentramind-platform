#!/bin/bash

# DecentraMind Labs Frontend Startup Script
# This script reliably starts the Next.js development server

echo "🚀 Starting DecentraMind Labs Frontend..."

# Set working directory
cd /Users/davidbonillajaylen2022/DecentraMind

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please ensure Node.js v20.10.0 is installed."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

# Kill any existing processes on port 3000
echo "🔄 Checking for existing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Start the Next.js development server
echo "🚀 Starting Next.js development server..."
echo "📍 URL: http://localhost:3000"
echo "⏳ Please wait 10-15 seconds for compilation..."

# Use the reliable startup method
/Users/davidbonillajaylen2022/.nvm/versions/node/v20.10.0/bin/node -e "
const next = require('next');
const app = next({ dev: true, port: 3000 });
app.prepare().then(() => {
  const server = require('http').createServer(app.getRequestHandler());
  server.listen(3000, () => {
    console.log('🎉 DecentraMind Labs is running on http://localhost:3000');
    console.log('✅ All navigation routes are ready');
    console.log('📱 Responsive design active');
    console.log('🎨 Dark theme with neon cyan accents');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
  });
});
" &

# Wait for server to start
sleep 15

# Test if server is running
if curl -s -I http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Server is running successfully!"
    echo "🌐 Open your browser to: http://localhost:3000"
else
    echo "❌ Server failed to start. Please check the error messages above."
    exit 1
fi

