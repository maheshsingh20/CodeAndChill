# Makefile for CodeAndChill Docker Deployment
# Simplifies common Docker commands

.PHONY: help build up down restart logs clean backup restore health seed admin

# Default target
help:
	@echo "CodeAndChill Docker Commands:"
	@echo "  make build       - Build all Docker images"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - View logs from all services"
	@echo "  make logs-f      - Follow logs in real-time"
	@echo "  make clean       - Remove all containers and volumes"
	@echo "  make backup      - Backup MongoDB database"
	@echo "  make restore     - Restore MongoDB database"
	@echo "  make health      - Check health of all services"
	@echo "  make seed        - Seed the database"
	@echo "  make admin       - Create admin user"
	@echo "  make shell-be    - Open shell in backend container"
	@echo "  make shell-db    - Open MongoDB shell"
	@echo "  make prod-up     - Start production environment"
	@echo "  make prod-down   - Stop production environment"

# Development commands
build:
	@echo "🔨 Building Docker images..."
	docker-compose build
up:
	@echo "🚀 Starting services..."
	docker-compose up -d
	@echo "✓ Services started"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"

down:
	@echo "📦 Stopping services..."
	docker-compose down
	@echo "✓ Services stopped"

restart:
	@echo "🔄 Restarting services..."
	docker-compose restart
	@echo "✓ Services restarted"

logs:
	docker-compose logs --tail=100

logs-f:
	docker-compose logs -f

logs-backend:
	docker-compose logs backend --tail=100

logs-frontend:
	docker-compose logs frontend --tail=100

logs-mongodb:
	docker-compose logs mongodb --tail=100

# Production commands
prod-up:
	@echo "🚀 Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✓ Production services started"

prod-down:
	@echo "📦 Stopping production environment..."
	docker-compose -f docker-compose.prod.yml down
	@echo "✓ Production services stopped"

prod-logs:
	docker-compose -f docker-compose.prod.yml logs --tail=100

# Database commands
seed:
	@echo "🌱 Seeding database..."
	docker-compose exec backend npm run seed
	@echo "✓ Database seeded"

admin:
	@echo "👤 Creating admin user..."
	docker-compose exec backend npm run create-admin
	@echo "✓ Admin user created"

backup:
	@echo "🗄️  Creating database backup..."
	@bash scripts/backup.sh

restore:
	@echo "🔄 Restoring database..."
	@bash scripts/restore.sh

# Utility commands
health:
	@bash scripts/health-check.sh

shell-backend:
	@echo "Opening backend shell..."
	docker-compose exec backend sh

shell-frontend:
	@echo "Opening frontend shell..."
	docker-compose exec frontend sh

shell-mongodb:
	@echo "Opening MongoDB shell..."
	docker-compose exec mongodb mongosh -u admin -p admin123

ps:
	docker-compose ps

stats:
	docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# Cleanup commands
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	@echo "✓ Cleanup complete"

clean-all:
	@echo "🧹 Removing all Docker resources..."
	docker-compose down -v --rmi all
	docker system prune -af --volumes
	@echo "✓ All resources removed"

# Update commands
update:
	@echo "🔄 Updating application..."
	git pull origin main
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo "✓ Application updated"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	cd Backend/server && npm install
	cd codeandchill && npm install
	@echo "✓ Dependencies installed"
