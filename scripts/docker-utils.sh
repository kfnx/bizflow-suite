#!/bin/bash

# Docker utility script for BizDocGen Santraktor
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       - Start all services"
    echo "  stop        - Stop all services"
    echo "  restart     - Restart all services"
    echo "  logs        - Show logs for all services"
    echo "  status      - Show status of all services"
    echo "  shell       - Open shell in app container"
    echo "  mysql       - Connect to MySQL database"
    echo "  migrate     - Run database migrations"
    echo "  seed        - Seed the database"
    echo "  dev         - Start development environment"
    echo "  help        - Show this help message"
}

# Function to start services
start_services() {
    print_header "Starting Services"
    check_docker
    check_docker_compose
    docker-compose up -d
    print_status "Services started successfully!"
    print_status "App: http://localhost:3000"
    print_status "MySQL: localhost:3306"
}

# Function to stop services
stop_services() {
    print_header "Stopping Services"
    docker-compose down
    print_status "Services stopped successfully!"
}

# Function to restart services
restart_services() {
    print_header "Restarting Services"
    docker-compose restart
    print_status "Services restarted successfully!"
}

# Function to show logs
show_logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

# Function to show status
show_status() {
    print_header "Service Status"
    docker-compose ps
}

# Function to open shell in app container
open_shell() {
    print_header "Opening Shell in App Container"
    docker-compose exec app /bin/sh
}

# Function to connect to MySQL
connect_mysql() {
    print_header "Connecting to MySQL"
    docker-compose exec mysql mysql -u user -p bizdocgen
}

# Function to run migrations
run_migrations() {
    print_header "Running Database Migrations"
    docker-compose exec app pnpm db:generate
    docker-compose exec app pnpm db:migrate
    print_status "Migrations completed successfully!"
}

# Function to seed database
seed_database() {
    print_header "Seeding Database"
    docker-compose exec app pnpm db:seed
    print_status "Database seeded successfully!"
}

# Function to create backup
create_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="backup_${timestamp}.sql"
    
    print_header "Creating Database Backup"
    mkdir -p backups
    docker-compose exec mysql mysqldump -u user -p bizdocgen > "backups/${backup_file}"
    print_status "Backup created: backups/${backup_file}"
}

# Function to restore backup
restore_backup() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        print_error "Please specify a backup file"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_header "Restoring Database from Backup"
    print_warning "This will overwrite the current database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose exec -T mysql mysql -u user -p bizdocgen < "$backup_file"
        print_status "Database restored successfully!"
    else
        print_status "Restore cancelled."
    fi
}

# Function to clean everything
clean_all() {
    print_header "Cleaning All Docker Resources"
    print_warning "This will remove all containers, volumes, and images!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker system prune -a -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to rebuild services
rebuild_services() {
    print_header "Rebuilding Services"
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    print_status "Services rebuilt and started successfully!"
}

# Function to start development environment
start_dev() {
    print_header "Starting Development Environment"
    docker-compose --profile dev up -d
    print_status "Development environment started!"
    print_status "Dev App: http://localhost:3001"
    print_status "MySQL: localhost:3306"
}

# Main script logic
case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    shell)
        open_shell
        ;;
    mysql)
        connect_mysql
        ;;
    migrate)
        run_migrations
        ;;
    seed)
        seed_database
        ;;
    dev)
        start_dev
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac 