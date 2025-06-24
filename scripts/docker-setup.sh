#!/bin/bash

# Docker setup script for BizDocGen Santraktor
set -e

echo "🚀 Setting up BizDocGen Santraktor with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "📦 Building and starting services..."
docker-compose up -d --build

echo "⏳ Waiting for MySQL to be ready..."
sleep 30

echo "🔄 Running database migrations..."
docker-compose exec app pnpm db:generate
docker-compose exec app pnpm db:migrate

echo "🌱 Seeding database..."
docker-compose exec app pnpm db:seed

echo "✅ Setup complete!"
echo ""
echo "🌐 Application is running at: http://localhost:3000"
echo "🗄️  MySQL is running at: localhost:3306"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo "  - Access MySQL: docker-compose exec mysql mysql -u user -p bizdocgen"
echo ""
echo "🔧 Development mode:"
echo "  - Start dev environment: docker-compose --profile dev up -d"
echo "  - Dev app will be available at: http://localhost:3001" 