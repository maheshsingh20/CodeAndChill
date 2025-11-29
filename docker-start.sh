#!/bin/bash

echo "========================================"
echo "  Code & Chill - Docker Setup"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "[1/4] Checking environment variables..."
if [ ! -f .env ]; then
    echo "[WARNING] .env file not found!"
    echo "Creating .env from template..."
    cp .env.example .env
    if [ $? -ne 0 ]; then
        echo "[ERROR] Could not create .env file"
        echo "Please create .env manually with required variables"
        exit 1
    fi
    echo "[INFO] Please edit .env file with your API keys"
    read -p "Press enter to continue..."
fi

echo "[2/4] Building Docker images..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to build Docker images"
    exit 1
fi

echo "[3/4] Starting containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to start containers"
    exit 1
fi

echo "[4/4] Waiting for services to be ready..."
sleep 10

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Services are running:"
echo "  - Frontend: http://localhost"
echo "  - Backend:  http://localhost:3001"
echo "  - MongoDB:  localhost:27017"
echo ""
echo "Useful commands:"
echo "  - View logs:    docker-compose logs -f"
echo "  - Stop:         docker-compose down"
echo "  - Restart:      docker-compose restart"
echo "  - Seed DB:      docker-compose exec backend npm run seed"
echo ""
