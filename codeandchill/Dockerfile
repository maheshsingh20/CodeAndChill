# Multi-stage build for frontend
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_RAPID_API_KEY
ARG VITE_RAPID_API_HOST

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_RAPID_API_KEY=$VITE_RAPID_API_KEY
ENV VITE_RAPID_API_HOST=$VITE_RAPID_API_HOST

# Build the application
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
