#!/bin/bash

# Database Reset Script for Development
# Usage: ./scripts/reset-db.sh [soft|hard]

set -e

echo "🗃️  BizDocGen Database Reset Script"
echo "=================================="

# Check if argument is provided
RESET_TYPE=${1:-soft}

if [ "$RESET_TYPE" = "hard" ]; then
    echo "🔥 Performing HARD reset (Docker containers + volumes)..."
    
    # Stop and remove containers with volumes
    echo "📦 Stopping Docker containers..."
    docker-compose down -v
    
    # Start only MySQL service
    echo "🚀 Starting fresh MySQL container..."
    docker-compose up -d mysql
    
    # Wait for MySQL to be ready
    echo "⏳ Waiting for MySQL to be ready..."
    sleep 15
    
    # Check if MySQL is ready
    until docker-compose exec mysql mysqladmin ping -h localhost --silent; do
        echo "⏳ Still waiting for MySQL..."
        sleep 5
    done
    
elif [ "$RESET_TYPE" = "soft" ]; then
    echo "🧹 Performing SOFT reset (tables only)..."
    
    # Check if MySQL container is running
    if ! docker-compose ps mysql | grep -q "Up"; then
        echo "🚀 Starting MySQL container..."
        docker-compose up -d mysql
        sleep 10
    fi
    
    # Drop all tables
    echo "🗑️  Dropping all tables..."
    npm run db:drop
    
else
    echo "❌ Invalid reset type. Use 'soft' or 'hard'"
    exit 1
fi

# Run migrations
echo "📋 Running migrations..."
npm run db:migrate

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Database reset complete!"
echo "🎯 You can now run: pnpm dev" 