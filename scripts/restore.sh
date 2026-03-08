#!/bin/bash

# MongoDB Restore Script for CodeAndChill
# This script restores a MongoDB backup

set -e

echo "🔄 Starting MongoDB Restore..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./mongodb-backup"
CONTAINER_NAME="codeandchill-mongodb"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}✗ Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# List available backups
echo "Available backups:"
ls -lh $BACKUP_DIR/*.tar.gz 2>/dev/null || {
    echo -e "${RED}✗ No backups found${NC}"
    exit 1
}

# Ask user to select backup
echo ""
read -p "Enter backup filename (without path): " BACKUP_FILE

if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo -e "${RED}✗ Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

# Warning
echo -e "${YELLOW}⚠️  WARNING: This will replace all existing data!${NC}"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Extract backup
echo "Extracting backup..."
cd $BACKUP_DIR
tar -xzf $BACKUP_FILE
BACKUP_NAME="${BACKUP_FILE%.tar.gz}"

# Check if MongoDB container is running
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${RED}✗ MongoDB container is not running${NC}"
    exit 1
fi

# Copy backup to container
echo "Copying backup to container..."
docker cp $BACKUP_NAME $CONTAINER_NAME:/backup/

# Restore backup
echo "Restoring database..."
docker exec $CONTAINER_NAME mongorestore \
    --uri="mongodb://admin:admin123@localhost:27017/codeandchill?authSource=admin" \
    --drop \
    /backup/$BACKUP_NAME/codeandchill

# Cleanup
rm -rf $BACKUP_NAME

echo -e "${GREEN}✓ Database restored successfully${NC}"
