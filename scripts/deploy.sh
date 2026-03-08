#!/bin/bash

# CodeAndChill Docker Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting CodeAndChill Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_success "Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_success "Docker Compose is installed"

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.docker..."
    cp .env.docker .env
    print_warning "Please edit .env file with your actual values before continuing."
    read -p "Press enter to continue after editing .env file..."
fi
print_success ".env file exists"

# Ask for deployment type
echo ""
echo "Select deployment type:"
echo "1) Development (docker-compose.yml)"
echo "2) Production (docker-compose.prod.yml)"
read -p "Enter choice [1-2]: " deploy_choice

if [ "$deploy_choice" = "2" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    print_success "Using production configuration"
else
    COMPOSE_FILE="docker-compose.yml"
    print_success "Using development configuration"
fi

# Stop existing containers
echo ""
echo "📦 Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down
print_success "Containers stopped"

# Remove old images (optional)
read -p "Do you want to remove old images? (y/n): " remove_images
if [ "$remove_images" = "y" ]; then
    echo "🗑️  Removing old images..."
    docker-compose -f $COMPOSE_FILE down --rmi all
    print_success "Old images removed"
fi

# Build images
echo ""
echo "🔨 Building Docker images..."
docker-compose -f $COMPOSE_FILE build --no-cache
print_success "Images built successfully"

# Start containers
echo ""
echo "🚀 Starting containers..."
docker-compose -f $COMPOSE_FILE up -d
print_success "Containers started"

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check if MongoDB is ready
echo "Checking MongoDB..."
for i in {1..30}; do
    if docker-compose -f $COMPOSE_FILE exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        print_success "MongoDB is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "MongoDB failed to start"
        exit 1
    fi
    sleep 2
done

# Check if Backend is ready
echo "Checking Backend..."
for i in {1..30}; do
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        print_success "Backend is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start"
        exit 1
    fi
    sleep 2
done

# Ask if user wants to seed database
echo ""
read -p "Do you want to seed the database? (y/n): " seed_db
if [ "$seed_db" = "y" ]; then
    echo "🌱 Seeding database..."
    docker-compose -f $COMPOSE_FILE exec backend npm run seed
    print_success "Database seeded"
fi

# Ask if user wants to create admin
echo ""
read -p "Do you want to create an admin user? (y/n): " create_admin
if [ "$create_admin" = "y" ]; then
    echo "👤 Creating admin user..."
    docker-compose -f $COMPOSE_FILE exec backend npm run create-admin
    print_success "Admin user created"
fi

# Show running containers
echo ""
echo "📊 Running containers:"
docker-compose -f $COMPOSE_FILE ps

# Show logs
echo ""
echo "📝 Recent logs:"
docker-compose -f $COMPOSE_FILE logs --tail=20

# Final message
echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
echo "Access your application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  MongoDB:  localhost:27017"
echo ""
echo "Useful commands:"
echo "  View logs:        docker-compose -f $COMPOSE_FILE logs -f"
echo "  Stop services:    docker-compose -f $COMPOSE_FILE down"
echo "  Restart services: docker-compose -f $COMPOSE_FILE restart"
echo ""
