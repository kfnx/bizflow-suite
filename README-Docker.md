# 🐳 Docker Quick Start with MinIO

Quick setup guide for running the application with MinIO using Docker.

## 🚀 Quick Start

### 1. Start Infrastructure Services

```bash
# Start MySQL and MinIO
pnpm run docker:dev

# Or manually
docker-compose up mysql minio -d
```

### 2. Initialize MinIO Buckets

```bash
# Run initialization script
pnpm run init:minio

# Or manually
./scripts/init-minio.sh
```

### 3. Start the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### 4. Test Everything

```bash
# Test MinIO connection
pnpm run test:minio
```

## 🌐 Access Points

- **Application**: http://localhost:3000
- **MinIO Console**: http://localhost:9001
- **MySQL**: localhost:3306

## 📦 Services

| Service       | Port | Container       | Purpose            |
| ------------- | ---- | --------------- | ------------------ |
| Next.js App   | 3000 | mysti-app-dev   | Main application   |
| MinIO API     | 9000 | mysti-minio-dev | Object storage API |
| MinIO Console | 9001 | mysti-minio-dev | Web UI for MinIO   |
| MySQL         | 3306 | mysti-mysql-dev | Database           |

## 🔧 Useful Commands

```bash
# Start all services (production)
pnpm run docker:up

# Start infrastructure only (development)
pnpm run docker:dev

# View logs
pnpm run docker:logs

# Stop services
pnpm run docker:down

# Rebuild containers
pnpm run docker:rebuild

# Clean everything (WARNING: deletes data)
pnpm run docker:clean

# Test MinIO
pnpm run test:minio
```

## 🔐 Default Credentials

### MinIO

- **Access Key**: `minioadmin`
- **Secret Key**: `minioadmin`
- **Console**: http://localhost:9001

### MySQL

- **User**: `user`
- **Password**: `password`
- **Database**: `mysti`

## 📁 Bucket Structure

The application creates these MinIO buckets:

```
mysti-purchase-orders/     # Purchase order documents
mysti-invoices/           # Invoice documents
mysti-quotations/         # Quotation documents
mysti-delivery-notes/     # Delivery note documents
mysti-user-avatars/       # User profile pictures
mysti-imports/            # Import-related documents
```

## 🛠️ Troubleshooting

### MinIO Not Starting

```bash
# Check logs
docker-compose logs minio

# Test health
curl http://localhost:9000/minio/health/live
```

### Database Connection Issues

```bash
# Check MySQL logs
docker-compose logs mysql

# Test connection
docker exec -it mysti-mysql-dev mysql -u user -p mysti
```

### Application Issues

```bash
# Check app logs
docker-compose logs app

# Restart services
docker-compose restart
```

## 📚 More Information

- **Full Docker Setup**: See `docs/docker-setup.md`
- **MinIO Configuration**: See `docs/minio-setup.md`
- **Development Guide**: See `docs/development.md`

## 🎯 Next Steps

1. **Set up environment variables** in `.env`
2. **Run database migrations**: `pnpm run db:push`
3. **Seed the database**: `pnpm run db:seed`
4. **Start developing**: `pnpm dev`

Happy coding! 🚀
