# Docker Setup for MySTI

This document explains how to run the MySTI application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- At least 4GB of available RAM
- At least 10GB of available disk space

## Quick Start

### 1. Automated Setup (Recommended)

Run the automated setup script:

```bash
./scripts/docker-setup.sh
```

This script will:

- Build and start all services
- Wait for MySQL to be ready
- Run database migrations
- Seed the database with initial data
- Provide you with access information

### 2. Manual Setup

If you prefer to run commands manually:

```bash
# Build and start services
docker-compose up -d --build

# Wait for MySQL to be ready (about 30 seconds)
sleep 30

# Run database migrations
docker-compose exec app pnpm db:generate
docker-compose exec app pnpm db:migrate

# Seed the database
docker-compose exec app pnpm db:seed
```

## Services

### Production Environment

- **Next.js App**: http://localhost:3000
- **MySQL Database**: localhost:3306
  - Database: `mysti`
  - User: `user`
  - Password: `password`
  - Root Password: `rootpassword`

### Development Environment

To run in development mode with hot reloading:

```bash
docker-compose --profile dev up -d
```

- **Next.js Dev App**: http://localhost:3001

## Useful Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mysql
```

### Stop Services

```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (⚠️ This will delete all data)
docker-compose down -v
```

### Restart Services

```bash
docker-compose restart
```

### Access MySQL

```bash
# Connect to MySQL
docker-compose exec mysql mysql -u user -p mysti

# Or as root
docker-compose exec mysql mysql -u root -p
```

### Run Database Commands

```bash
# Generate migrations
docker-compose exec app pnpm db:generate

# Run migrations
docker-compose exec app pnpm db:migrate

# Seed database
docker-compose exec app pnpm db:seed

# Open Drizzle Studio
docker-compose exec app pnpm db:studio
```

### Update Application

```bash
# Pull latest changes and rebuild
git pull
docker-compose up -d --build

# Run migrations if needed
docker-compose exec app pnpm db:migrate
```

## Environment Variables

The following environment variables are automatically set in the Docker environment:

| Variable      | Value        | Description                         |
| ------------- | ------------ | ----------------------------------- |
| `NODE_ENV`    | `production` | Node.js environment                 |
| `DB_HOST`     | `mysql`      | Database host (Docker service name) |
| `DB_PORT`     | `3306`       | Database port                       |
| `DB_USER`     | `user`       | Database username                   |
| `DB_PASSWORD` | `password`   | Database password                   |
| `DB_NAME`     | `mysti`      | Database name                       |

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

```bash
# Check what's using the port
lsof -i :3000
lsof -i :3306

# Stop conflicting services or change ports in docker-compose.yml
```

### Database Connection Issues

If the app can't connect to the database:

```bash
# Check if MySQL is running
docker-compose ps

# Check MySQL logs
docker-compose logs mysql

# Wait longer for MySQL to start
sleep 60
```

### Build Issues

If you encounter build issues:

```bash
# Clean build cache
docker-compose build --no-cache

# Remove all containers and images
docker-compose down
docker system prune -a
```

### Permission Issues

If you encounter permission issues:

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Make scripts executable
chmod +x scripts/*.sh
```

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use `.env` files or Docker secrets for sensitive data
2. **SSL/TLS**: Add a reverse proxy (nginx) with SSL certificates
3. **Backup**: Set up regular database backups
4. **Monitoring**: Add monitoring and logging solutions
5. **Scaling**: Use Docker Swarm or Kubernetes for scaling

### Example Production docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backups:/backups
    networks:
      - internal

  app:
    build: .
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=${MYSQL_USER}
      - DB_PASSWORD=${MYSQL_PASSWORD}
      - DB_NAME=${MYSQL_DATABASE}
    depends_on:
      - mysql
    networks:
      - internal
      - external

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - external

volumes:
  mysql_data:

networks:
  internal:
    driver: bridge
  external:
    driver: bridge
```

## Support

If you encounter any issues:

1. Check the logs: `docker-compose logs -f`
2. Verify Docker is running: `docker info`
3. Check available disk space: `df -h`
4. Check available memory: `free -h`

For additional help, please refer to the main project documentation or create an issue in the repository.
