#!/bin/bash

# Wait for MinIO to be ready
echo "Waiting for MinIO to be ready..."
until curl -f http://localhost:9000/minio/health/live; do
  echo "MinIO is not ready yet, waiting..."
  sleep 2
done

echo "MinIO is ready!"

# Install MinIO client if not already installed
if ! command -v mc &> /dev/null; then
    echo "Installing MinIO client..."
    wget https://dl.min.io/client/mc/release/linux-amd64/mc
    chmod +x mc
    sudo mv mc /usr/local/bin/
fi

# Configure MinIO client
mc alias set mysti http://localhost:9000 minioadmin minioadmin

# Create buckets
echo "Creating MinIO buckets..."

# Create all required buckets
mc mb mysti/mysti-purchase-orders --ignore-existing
mc mb mysti/mysti-invoices --ignore-existing
mc mb mysti/mysti-quotations --ignore-existing
mc mb mysti/mysti-delivery-notes --ignore-existing
mc mb mysti/mysti-user-avatars --ignore-existing
mc mb mysti/mysti-imports --ignore-existing

# Set bucket policies (optional - for public read access to certain buckets)
# mc policy set download mysti/mysti-user-avatars

echo "MinIO buckets created successfully!"
echo "MinIO Console: http://localhost:9001"
echo "MinIO API: http://localhost:9000" 