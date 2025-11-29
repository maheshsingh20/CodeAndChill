# 🚀 CI/CD Setup Guide

Complete guide to set up Continuous Integration and Continuous Deployment for Code & Chill.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [GitHub Secrets Setup](#github-secrets-setup)
4. [Workflows Explained](#workflows-explained)
5. [Deployment Options](#deployment-options)
6. [Monitoring & Rollback](#monitoring--rollback)

---

## Overview

We have 3 GitHub Actions workflows:

1. **CI/CD Pipeline** (`ci-cd.yml`) - Main pipeline for testing, building, and deploying
2. **PR Checks** (`pr-check.yml`) - Automated checks for pull requests
3. **Docker Publish** (`docker-publish.yml`) - Publish images on releases

### Pipeline Flow

```
┌─────────────┐
│  Git Push   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Test Backend       │
│  Test Frontend      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Build Docker       │
│  Images             │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Push to Registry   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Deploy to Server   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Verify & Notify    │
└─────────────────────┘
```

---

## Prerequisites

### 1. GitHub Repository
- Push your code to GitHub
- Enable GitHub Actions in repository settings

### 2. Docker Hub Account
- Sign up at [hub.docker.com](https://hub.docker.com)
- Create access token: Account Settings → Security → New Access Token

### 3. Production Server
- Linux server (Ubuntu 20.04+ recommended)
- Docker & Docker Compose installed
- SSH access configured

### 4. Domain (Optional)
- Point domain to your server IP
- Configure DNS A records

---

## GitHub Secrets Setup

Go to: **Repository → Settings → Secrets and variables → Actions**

### Required Secrets

#### Docker Hub
```
DOCKER_USERNAME=your_dockerhub_username
DOCKER_PASSWORD=your_dockerhub_token
```

#### Server SSH
```
SERVER_HOST=your.server.ip.address
SERVER_USER=your_ssh_username
SSH_PRIVATE_KEY=your_private_ssh_key
```

To generate SSH key:
```bash
ssh-keygen -t ed25519 -C "github-actions"
# Copy private key content to SSH_PRIVATE_KEY secret
cat ~/.ssh/id_ed25519

# Copy public key to server
ssh-copy-id user@your-server
```

#### Environment Variables
```
VITE_API_URL=https://api.yourdomain.com/api
VITE_RAPID_API_KEY=your_rapidapi_key
JWT_SECRET=your_jwt_secret_min_32_chars
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
RAPIDAPI_KEY=your_rapidapi_key
```

#### Optional (for notifications)
```
SLACK_WEBHOOK=your_slack_webhook_url
```

---

## Workflows Explained

### 1. CI/CD Pipeline (`ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`

**Jobs:**

#### Test Backend
- Checkout code
- Install Node.js dependencies
- Run linter
- Run tests

#### Test Frontend
- Checkout code
- Install dependencies
- Run linter
- Build production bundle

#### Build Images
- Build Docker images for backend and frontend
- Push to Docker Hub with tags:
  - `latest` - Always points to latest main
  - `<commit-sha>` - Specific version

#### Deploy
- SSH into production server
- Pull latest code
- Pull Docker images
- Restart containers with zero downtime
- Verify deployment

#### Notify
- Send Slack notification (optional)

### 2. PR Checks (`pr-check.yml`)

**Triggers:**
- Pull requests to `main` or `develop`

**Jobs:**
- Lint and test both services
- Build Docker images (without pushing)
- Security scan with Trivy

### 3. Docker Publish (`docker-publish.yml`)

**Triggers:**
- New release published
- Manual workflow dispatch

**Jobs:**
- Build multi-platform images (amd64, arm64)
- Push to Docker Hub and GitHub Container Registry
- Tag with version numbers

---

## Deployment Options

### Option 1: VPS Deployment (Recommended)

#### Server Setup

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Clone repository
git clone https://github.com/yourusername/codeandchill.git
cd codeandchill

# 4. Create .env file
cp .env.example .env
nano .env  # Add your production values

# 5. Start services
docker-compose -f docker-compose.prod.yml up -d
```

#### Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/codeandchill
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/codeandchill /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

### Option 2: AWS ECS

1. Create ECR repositories
2. Update workflow to push to ECR
3. Create ECS cluster and task definitions
4. Configure load balancer

### Option 3: Google Cloud Run

1. Enable Cloud Run API
2. Update workflow to use `gcloud` CLI
3. Deploy containers

### Option 4: Azure Container Instances

1. Create Azure Container Registry
2. Update workflow for Azure
3. Deploy to ACI

---

## Monitoring & Rollback

### Health Checks

The workflow automatically verifies:
```bash
curl -f http://localhost:3001/health  # Backend
curl -f http://localhost              # Frontend
```

### View Logs

```bash
# On server
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs backend -f
```

### Rollback

#### Quick Rollback (Previous Version)
```bash
# SSH into server
cd /home/user/codeandchill

# Pull specific version
docker pull username/codeandchill-backend:<previous-sha>
docker pull username/codeandchill-frontend:<previous-sha>

# Update docker-compose.prod.yml to use specific tags
# Restart
docker-compose -f docker-compose.prod.yml up -d
```

#### Rollback via GitHub

1. Go to Actions tab
2. Find successful previous deployment
3. Click "Re-run jobs"

### Monitoring Tools

#### 1. Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com/) - Free
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

#### 2. Application Monitoring
```bash
# Install Prometheus & Grafana
docker run -d -p 9090:9090 prom/prometheus
docker run -d -p 3000:3000 grafana/grafana
```

#### 3. Log Aggregation
- [Papertrail](https://www.papertrail.com/)
- [Loggly](https://www.loggly.com/)
- ELK Stack (Elasticsearch, Logstash, Kibana)

---

## Best Practices

### 1. Branch Strategy

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (development)
```

### 2. Semantic Versioning

```bash
# Tag releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 3. Environment-Specific Configs

- Development: `.env.development`
- Staging: `.env.staging`
- Production: `.env.production`

### 4. Database Migrations

```bash
# Run migrations before deployment
docker-compose exec backend npm run migrate
```

### 5. Zero-Downtime Deployment

```bash
# Use blue-green deployment
docker-compose -f docker-compose.prod.yml up -d --no-deps --build backend
```

---

## Troubleshooting

### Workflow Fails

1. Check GitHub Actions logs
2. Verify all secrets are set
3. Test Docker build locally:
   ```bash
   docker-compose build
   ```

### Deployment Fails

1. SSH into server manually
2. Check Docker logs:
   ```bash
   docker-compose logs
   ```
3. Verify environment variables
4. Check disk space:
   ```bash
   df -h
   ```

### Container Won't Start

```bash
# Check container status
docker ps -a

# View logs
docker logs <container_id>

# Restart
docker-compose restart
```

---

## Cost Estimation

### VPS Hosting
- **DigitalOcean**: $12-48/month
- **Linode**: $12-48/month
- **AWS EC2**: $15-60/month

### CI/CD
- **GitHub Actions**: 2000 minutes/month free
- **Docker Hub**: Free for public repos

### Monitoring
- **UptimeRobot**: Free (50 monitors)
- **Grafana Cloud**: Free tier available

**Total**: ~$12-60/month for complete setup

---

## Next Steps

1. ✅ Set up GitHub secrets
2. ✅ Configure production server
3. ✅ Push code to trigger first deployment
4. ✅ Set up monitoring
5. ✅ Configure domain and SSL
6. ✅ Test rollback procedure

---

## Support

For issues:
1. Check workflow logs in GitHub Actions
2. Review server logs
3. Consult documentation
4. Open GitHub issue

**Happy Deploying! 🚀**
