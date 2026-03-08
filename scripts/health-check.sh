#!/bin/bash

# Health Check Script for CodeAndChill
# This script checks the health of all services

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🏥 CodeAndChill Health Check"
echo "=============================="
echo ""

# Check Docker
echo -n "Docker: "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

# Check Docker Compose
echo -n "Docker Compose: "
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

echo ""
echo "Container Status:"
echo "-----------------"

# Check MongoDB
echo -n "MongoDB: "
if docker ps | grep -q "codeandchill-mongodb"; then
    if docker exec codeandchill-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Running and healthy${NC}"
    else
        echo -e "${YELLOW}⚠ Running but not responding${NC}"
    fi
else
    echo -e "${RED}✗ Not running${NC}"
fi

# Check Backend
echo -n "Backend: "
if docker ps | grep -q "codeandchill-backend"; then
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Running and healthy${NC}"
    else
        echo -e "${YELLOW}⚠ Running but not responding${NC}"
    fi
else
    echo -e "${RED}✗ Not running${NC}"
fi

# Check Frontend
echo -n "Frontend: "
if docker ps | grep -q "codeandchill-frontend"; then
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Running and healthy${NC}"
    else
        echo -e "${YELLOW}⚠ Running but not responding${NC}"
    fi
else
    echo -e "${RED}✗ Not running${NC}"
fi

echo ""
echo "Resource Usage:"
echo "---------------"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep codeandchill

echo ""
echo "Disk Usage:"
echo "-----------"
docker system df

echo ""
echo "Network Status:"
echo "---------------"
docker network ls | grep codeandchill

echo ""
