#!/bin/bash

# MongoDB Backup Script for CodeAndChill
# This script creates a backup of the MongoDB database

set -e

echo "🗄️  Starting MongoDB Backup..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./mongodb-backup"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="codeandchill_backup_$TIMESTAMP"
CONTAINER_NAME="codeandchill-mongodb"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Check if MongoDB container is running
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${RED}✗ MongoDB container is not running${NC}"
    exit 1
fi

echo "Creating backup: $BACKUP_NAME"

# Create backup
docker exec $CONTAINER_NAME mongodump \
    --uri="mongodb://admin:admin123@localhost:27017/codeandchill?authSource=admin" \
    --out=/backup/$BACKUP_NAME

# Copy backup from container to host
docker cp $CONTAINER_NAME:/backup/$BACKUP_NAME $BACKUP_DIR/

# Compress backup
cd $BACKUP_DIR
tar -czf ${BACKUP_NAME}.tar.gz $BACKUP_NAME
rm -rf $BACKUP_NAME

echo -e "${GREEN}✓ Backup created successfully: $BACKUP_DIR/${BACKUP_NAME}.tar.gz${NC}"

# Keep only last 7 backups
echo "Cleaning old backups (keeping last 7)..."
ls -t $BACKUP_DIR/*.tar.gz | tail -n +8 | xargs -r rm

echo -e "${GREEN}✓ Backup completed${NC}"
