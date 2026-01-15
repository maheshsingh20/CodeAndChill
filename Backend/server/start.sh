#!/bin/bash
# Start script for Render deployment

echo "Starting Code & Chill Backend..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Run the server with ts-node
exec npx ts-node src/server.ts
