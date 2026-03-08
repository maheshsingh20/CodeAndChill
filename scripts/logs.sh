#!/bin/bash

# Log Viewer Script for CodeAndChill
# This script helps view logs from different services

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}📝 CodeAndChill Log Viewer${NC}"
echo ""
echo "Select service to view logs:"
echo "1) All services"
echo "2) Backend"
echo "3) Frontend"
echo "4) MongoDB"
echo "5) Follow all logs (real-time)"
echo "6) Follow backend logs (real-time)"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        docker-compose logs --tail=100
        ;;
    2)
        docker-compose logs backend --tail=100
        ;;
    3)
        docker-compose logs frontend --tail=100
        ;;
    4)
        docker-compose logs mongodb --tail=100
        ;;
    5)
        echo -e "${YELLOW}Following all logs (Ctrl+C to exit)...${NC}"
        docker-compose logs -f
        ;;
    6)
        echo -e "${YELLOW}Following backend logs (Ctrl+C to exit)...${NC}"
        docker-compose logs -f backend
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
