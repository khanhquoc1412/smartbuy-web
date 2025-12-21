.PHONY: help build up down restart logs clean backup restore

help: ## Show this help message
	@echo "SmartBuy Docker Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build all Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs from all services
	docker-compose logs -f

ps: ## Show running services
	docker-compose ps

clean: ## Remove all containers, networks, and volumes
	docker-compose down -v
	docker system prune -f

rebuild: ## Rebuild and restart all services
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

dev: ## Start in development mode
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

dev-down: ## Stop development mode
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

backup: ## Backup MongoDB data
	docker-compose exec -T mongodb mongodump --username admin --password smartbuy123 --authenticationDatabase admin --archive --gzip > backup-$(shell date +%Y%m%d-%H%M%S).gz

restore: ## Restore MongoDB from backup (usage: make restore FILE=backup.gz)
	docker-compose exec -T mongodb mongorestore --username admin --password smartbuy123 --authenticationDatabase admin --archive --gzip < $(FILE)

shell-mongo: ## Open MongoDB shell
	docker-compose exec mongodb mongosh -u admin -p smartbuy123 --authenticationDatabase admin

shell-gateway: ## Open shell in api-gateway
	docker-compose exec api-gateway sh

shell-order: ## Open shell in order-manager
	docker-compose exec order-manager sh

health: ## Check health of all services
	@echo "Checking service health..."
	@curl -s http://localhost:3000/health || echo "❌ API Gateway"
	@curl -s http://localhost:5002/health || echo "❌ Product Manager"
	@curl -s http://localhost:5003/health || echo "❌ Order Manager"
	@curl -s http://localhost:5006/health || echo "❌ Review Service"
	@curl -s http://localhost:3006/health || echo "❌ User Manager"
