#!/bin/bash

# DecentraMind N8N Integration Deployment Script
# This script handles deployment for both local development and production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-development}
COMPOSE_FILE="docker-compose.yml"
if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

echo -e "${BLUE}🚀 DecentraMind N8N Integration Deployment${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Compose file: ${COMPOSE_FILE}${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from example..."
    if [ -f env.example ]; then
        cp env.example .env
        print_warning "Please edit .env file with your configuration before continuing."
        exit 1
    else
        print_error "env.example file not found. Cannot create .env file."
        exit 1
    fi
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p data logs workflows monitoring/grafana/dashboards monitoring/grafana/datasources nginx/ssl

# Set proper permissions
chmod 755 data logs workflows

# Build the application
print_status "Building N8N Integration service..."
docker-compose -f $COMPOSE_FILE build

# Start services
print_status "Starting services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check N8N Integration service
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_status "N8N Integration service is healthy"
else
    print_warning "N8N Integration service health check failed"
fi

# Check MongoDB
if docker-compose -f $COMPOSE_FILE exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_status "MongoDB is healthy"
else
    print_warning "MongoDB health check failed"
fi

# Check Redis
if docker-compose -f $COMPOSE_FILE exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_status "Redis is healthy"
else
    print_warning "Redis health check failed"
fi

# Display service URLs
echo -e "${BLUE}📋 Service URLs:${NC}"
echo -e "  N8N Integration API: http://localhost:3001"
echo -e "  N8N UI: http://localhost:5678"
echo -e "  MongoDB: mongodb://localhost:27017"
echo -e "  Redis: redis://localhost:6379"

if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "  Prometheus: http://localhost:9090"
    echo -e "  Grafana: http://localhost:3000"
fi

# Display logs
echo -e "${BLUE}📊 Viewing logs...${NC}"
echo -e "To view logs, run: docker-compose -f $COMPOSE_FILE logs -f"
echo -e "To stop services, run: docker-compose -f $COMPOSE_FILE down"

# Test notification channels
print_status "Testing notification channels..."
docker-compose -f $COMPOSE_FILE exec n8n-integration node -e "
const { NotificationService } = require('./src/services/notificationService.js');
const notificationService = new NotificationService();
notificationService.testNotificationChannels().then(results => {
    console.log('Notification test results:', results);
}).catch(console.error);
"

print_status "Deployment completed successfully! 🎉"

# Display next steps
echo -e "${BLUE}📝 Next Steps:${NC}"
echo -e "1. Configure your API keys in the .env file"
echo -e "2. Access N8N UI at http://localhost:5678"
echo -e "3. Import workflow templates from the workflows/ directory"
echo -e "4. Test webhook endpoints with your DecentraMind frontend"
echo -e "5. Monitor logs: docker-compose -f $COMPOSE_FILE logs -f n8n-integration"

if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "6. Set up SSL certificates in nginx/ssl/"
    echo -e "7. Configure domain names and DNS"
    echo -e "8. Set up monitoring alerts in Grafana"
fi
