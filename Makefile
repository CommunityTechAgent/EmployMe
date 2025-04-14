.PHONY: install test lint build start dev clean sync-github

# Variables
NODE_ENV ?= development
PORT ?= 3000
MONGODB_URI ?= mongodb://localhost:27017/job-match-ai

# Install dependencies
install:
	npm install

# Run tests
test:
	npm test

# Run linter
lint:
	npm run lint

# Build the application
build:
	npm run build

# Start the application in production mode
start:
	NODE_ENV=production PORT=$(PORT) MONGODB_URI=$(MONGODB_URI) npm start

# Start the application in development mode
dev:
	NODE_ENV=development PORT=$(PORT) MONGODB_URI=$(MONGODB_URI) npm run dev

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf coverage

# Database operations
db-migrate:
	npm run migrate

db-seed:
	npm run seed

# GitHub synchronization
sync-github:
	git add .
	git commit -m "Update: $(shell date +'%Y-%m-%d %H:%M:%S')"
	git push origin main

# Docker operations
docker-build:
	docker build -t jobhub .

docker-run:
	docker run -p $(PORT):$(PORT) -e NODE_ENV=$(NODE_ENV) -e PORT=$(PORT) -e MONGODB_URI=$(MONGODB_URI) jobhub

# Documentation
docs:
	npm run docs

# Help
help:
	@echo "Available commands:"
	@echo "  install        - Install dependencies"
	@echo "  test          - Run tests"
	@echo "  lint          - Run linter"
	@echo "  build         - Build the application"
	@echo "  start         - Start in production mode"
	@echo "  dev           - Start in development mode"
	@echo "  clean         - Clean build artifacts"
	@echo "  db-migrate    - Run database migrations"
	@echo "  db-seed       - Seed the database"
	@echo "  sync-github   - Sync with GitHub"
	@echo "  docker-build  - Build Docker image"
	@echo "  docker-run    - Run Docker container"
	@echo "  docs          - Generate documentation"
	@echo "  help          - Show this help message" 