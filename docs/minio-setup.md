# MinIO Setup Guide

This guide explains how to set up MinIO for file storage in the application.

## Prerequisites

1. MinIO server running at `http://127.0.0.1:9000`
2. MinIO web UI accessible at `http://127.0.0.1:9001`

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# MinIO Configuration
MINIO_ENDPOINT="127.0.0.1"
MINIO_PORT="9000"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
```

## Default Configuration

The application uses these default values if environment variables are not set:

- **Endpoint**: `127.0.0.1`
- **Port**: `9000`
- **SSL**: `false`
- **Access Key**: `minioadmin`
- **Secret Key**: `minioadmin`

## Bucket Organization Strategy

The application uses **multiple buckets** for different modules to ensure better organization, security, and performance:

### Bucket Structure

```
mysti-purchase-orders/     # Purchase order documents
mysti-invoices/           # Invoice documents
mysti-quotations/         # Quotation documents
mysti-delivery-notes/     # Delivery note documents
mysti-user-avatars/       # User profile pictures
mysti-imports/            # Import-related documents
```

### Why Multiple Buckets?

✅ **Better Access Control**: Each bucket can have different permissions
✅ **Easier Management**: Clear separation of concerns
✅ **Better Performance**: Smaller bucket sizes = faster operations
✅ **Compliance**: Easier to implement retention policies per module
✅ **Cost Optimization**: Different storage classes per bucket
✅ **Security**: Isolated access patterns

## File Upload Features

### Supported File Types

- PDF (`.pdf`)
- Microsoft Word (`.doc`, `.docx`)
- Images (`.jpg`, `.jpeg`, `.png`, `.gif`)

### File Size Limits

- Maximum file size: 10MB

### Upload Process

1. Files are uploaded to MinIO with unique timestamps
2. Presigned URLs are generated for temporary access (24 hours)
3. File URLs are stored in the database

## API Endpoints

### Upload File

- **URL**: `/api/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (File object)

### Accept Quotation with File

- **URL**: `/api/quotations/[id]/accept`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `approvalType` (string)
  - `purchaseOrderNumber` (string)
  - `purchaseOrderDate` (string)
  - `responseNotes` (string, optional)
  - `file` (File object, optional)

## Testing MinIO Connection

Run the following command to test the MinIO connection:

```bash
pnpm run test:minio
```

This will:

1. Test the connection to MinIO
2. List existing buckets
3. Create all required buckets if they don't exist
4. Verify each bucket is accessible

## Bucket Management

### Automatic Bucket Creation

The application automatically creates all required buckets on startup:

- `mysti-purchase-orders`
- `mysti-invoices`
- `mysti-quotations`
- `mysti-delivery-notes`
- `mysti-user-avatars`
- `mysti-imports`

### Manual Bucket Management

You can also manage buckets manually through the MinIO web UI at `http://127.0.0.1:9001`.

## Usage Examples

### Upload to Specific Bucket

```typescript
import { BUCKETS, uploadFile } from '@/lib/minio';

// Upload purchase order document
const fileUrl = await uploadFile(
  fileBuffer,
  'purchase-order.pdf',
  'application/pdf',
  BUCKETS.PURCHASE_ORDERS,
);

// Upload invoice document
const invoiceUrl = await uploadFile(
  fileBuffer,
  'invoice.pdf',
  'application/pdf',
  BUCKETS.INVOICES,
);
```

### Upload with Folder Structure

```typescript
import { BUCKETS, uploadFileToFolder } from '@/lib/minio';

// Upload to folder within bucket
const fileUrl = await uploadFileToFolder(
  fileBuffer,
  'document.pdf',
  'application/pdf',
  '2024/01', // folder path
  BUCKETS.PURCHASE_ORDERS,
);
```

## Troubleshooting

### Connection Issues

1. Ensure MinIO server is running
2. Check environment variables are correct
3. Verify network connectivity

### File Upload Issues

1. Check file size (max 10MB)
2. Verify file type is supported
3. Ensure bucket exists and is accessible

### Permission Issues

1. Verify MinIO access key and secret key
2. Check bucket permissions
3. Ensure proper IAM policies are set

## Migration from Single Bucket

If you're migrating from a single bucket setup:

1. Run the test script to create new buckets
2. Update your code to use the new bucket constants
3. Consider migrating existing files to appropriate buckets
4. Update any hardcoded bucket references
