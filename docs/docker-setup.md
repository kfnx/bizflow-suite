# Docker Setup with MinIO

This guide explains how to set up the application using Docker Compose with MinIO integration.

## Prerequisites

- Docker
- Docker Compose
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bizdocgen-santraktor
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/mysti"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# MinIO Configuration
MINIO_ENDPOINT="minio"
MINIO_PORT="9000"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
```

### 3. Start Services

#### Development Setup

```bash
# Start only infrastructure services (MySQL + MinIO)
docker-compose up mysql minio -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Run the app locally
pnpm dev
```

### 4. Initialize MinIO Buckets

After starting the services, initialize the MinIO buckets:

```bash
# Run the initialization script
./scripts/init-minio.sh
```

Or manually:

```bash
# Install MinIO client
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/

# Configure client
mc alias set mysti http://localhost:9000 minioadmin minioadmin

# Create buckets
mc mb mysti/mysti-purchase-orders
mc mb mysti/mysti-invoices
mc mb mysti/mysti-quotations
mc mb mysti/mysti-delivery-notes
mc mb mysti/mysti-user-avatars
mc mb mysti/mysti-imports
```

## Services

### MySQL Database

- **Port**: 3306
- **Container**: mysti-mysql
- **Credentials**:
  - User: user
  - Password: password
  - Database: mysti

### MinIO Object Storage

- **API Port**: 9000
- **Console Port**: 9001
- **Container**: mysti-minio
- **Credentials**:
  - Access Key: minioadmin
  - Secret Key: minioadmin
- **Console URL**: http://localhost:9001

### Next.js Application

- **Port**: 3000
- **Container**: mysti-app
- **URL**: http://localhost:3000

## Bucket Structure

The application uses the following MinIO buckets:

```
mysti-purchase-orders/     # Purchase order documents
mysti-invoices/           # Invoice documents
mysti-quotations/         # Quotation documents
mysti-delivery-notes/     # Delivery note documents
mysti-user-avatars/       # User profile pictures
mysti-imports/            # Import-related documents
```

## Development Workflow

### 1. Start Infrastructure Only

```bash
docker-compose up mysql minio -d
```

### 2. Run Application Locally

```bash
pnpm install
pnpm dev
```

### 3. Test MinIO Connection

```bash
pnpm run test:minio
```

### 4. Access Services

- **Application**: http://localhost:3000
- **MinIO Console**: http://localhost:9001
- **MySQL**: localhost:3306

## Troubleshooting

### MinIO Connection Issues

1. **Check if MinIO is running**:

   ```bash
   docker-compose ps
   ```

2. **Check MinIO logs**:

   ```bash
   docker-compose logs minio
   ```

3. **Test MinIO health**:
   ```bash
   curl http://localhost:9000/minio/health/live
   ```

### Database Connection Issues

1. **Check MySQL logs**:

   ```bash
   docker-compose logs mysql
   ```

2. **Test MySQL connection**:
   ```bash
   docker exec -it mysti-mysql mysql -u user -p mysti
   ```

### Application Issues

1. **Check application logs**:

   ```bash
   docker-compose logs app
   ```

2. **Restart services**:
   ```bash
   docker-compose restart
   ```

## Data Persistence

### Volumes

The following data is persisted:

- **MySQL Data**: `mysql_data` volume
- **MinIO Data**: `minio_data` volume
- **Application Uploads**: `./uploads` directory

### Backup

To backup MinIO data:

```bash
# Create backup
mc mirror mysti/mysti-purchase-orders ./backup/purchase-orders
mc mirror mysti/mysti-invoices ./backup/invoices
# ... repeat for other buckets

# Restore backup
mc mirror ./backup/purchase-orders mysti/mysti-purchase-orders
```

## Production Considerations

### Security

1. **Change default passwords**:

   - MySQL root password
   - MinIO access/secret keys
   - NextAuth secret

2. **Use environment variables**:

   - Don't hardcode credentials
   - Use secrets management

3. **Network security**:
   - Use reverse proxy (nginx)
   - Enable SSL/TLS
   - Restrict port access

### Performance

1. **Resource limits**:

   ```yaml
   services:
     minio:
       deploy:
         resources:
           limits:
             memory: 1G
             cpus: '0.5'
   ```

2. **Monitoring**:
   - Add health checks
   - Monitor disk usage
   - Set up logging

### Scaling

1. **MinIO distributed mode**:

   - Use multiple MinIO instances
   - Configure erasure coding
   - Set up load balancing

2. **Database scaling**:
   - Use read replicas
   - Implement connection pooling
   - Consider database clustering

## Commands Reference

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d minio

# View logs
docker-compose logs -f minio

# Stop services
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Rebuild and start
docker-compose up -d --build

# Access MinIO console
open http://localhost:9001

# Test MinIO connection
pnpm run test:minio
```
