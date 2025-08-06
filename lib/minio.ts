import * as Minio from 'minio';

// MinIO client configuration
export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

// Bucket names for different modules
export const BUCKETS = {
  PURCHASE_ORDERS: 'mysti-purchase-orders',
  INVOICES: 'mysti-invoices',
  QUOTATIONS: 'mysti-quotations',
  DELIVERY_NOTES: 'mysti-delivery-notes',
  USER_AVATARS: 'mysti-user-avatars',
  IMPORTS: 'mysti-imports',
} as const;

// Initialize all buckets
export async function initializeAllBuckets() {
  const bucketNames = Object.values(BUCKETS);

  for (const bucketName of bucketNames) {
    try {
      const bucketExists = await minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await minioClient.makeBucket(bucketName, 'us-east-1');
        console.log(`Bucket '${bucketName}' created successfully`);
      }
    } catch (error) {
      console.error(`Error creating bucket '${bucketName}':`, error);
    }
  }
}

// Initialize specific bucket
export async function initializeBucket(bucketName: string) {
  try {
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket '${bucketName}' created successfully`);
    }
  } catch (error) {
    console.error('Error initializing MinIO bucket:', error);
  }
}

// Upload file to specific bucket
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  bucketName: string = BUCKETS.PURCHASE_ORDERS,
): Promise<string> {
  try {
    // Generate unique file name to avoid conflicts
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}-${fileName}`;

    // Upload file to MinIO
    await minioClient.putObject(
      bucketName,
      uniqueFileName,
      file,
      file.length,
      { 'Content-Type': contentType }
    );

    // Return the file URL
    const fileUrl = await minioClient.presignedGetObject(
      bucketName,
      uniqueFileName,
      24 * 60 * 60 // 24 hours expiry
    );

    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to MinIO:', error);
    throw new Error('Failed to upload file');
  }
}

// Upload file with folder structure
export async function uploadFileToFolder(
  file: Buffer,
  fileName: string,
  contentType: string,
  folderPath: string,
  bucketName: string = BUCKETS.PURCHASE_ORDERS,
): Promise<string> {
  try {
    // Generate unique file name to avoid conflicts
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const fullPath = `${folderPath}/${uniqueFileName}`;

    // Upload file to MinIO with folder structure
    await minioClient.putObject(
      bucketName,
      fullPath,
      file,
      file.length,
      { 'Content-Type': contentType }
    );

    // Return the file URL
    const fileUrl = await minioClient.presignedGetObject(
      bucketName,
      fullPath,
      24 * 60 * 60 // 24 hours expiry
    );

    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to MinIO:', error);
    throw new Error('Failed to upload file');
  }
}

// Delete file from specific bucket
export async function deleteFile(fileName: string, bucketName: string = BUCKETS.PURCHASE_ORDERS): Promise<void> {
  try {
    await minioClient.removeObject(bucketName, fileName);
  } catch (error) {
    console.error('Error deleting file from MinIO:', error);
    throw new Error('Failed to delete file');
  }
}

// Get file URL (presigned URL for temporary access)
export async function getFileUrl(fileName: string, bucketName: string = BUCKETS.PURCHASE_ORDERS): Promise<string> {
  try {
    return await minioClient.presignedGetObject(
      bucketName,
      fileName,
      24 * 60 * 60 // 24 hours expiry
    );
  } catch (error) {
    console.error('Error generating file URL:', error);
    throw new Error('Failed to generate file URL');
  }
}

// List files in a bucket (with optional prefix for folders)
export async function listFiles(bucketName: string, prefix?: string): Promise<string[]> {
  try {
    const files: string[] = [];
    const stream = minioClient.listObjects(bucketName, prefix, true);

    return new Promise((resolve, reject) => {
      stream.on('data', (obj: any) => {
        files.push(obj.name);
      });
      stream.on('error', reject);
      stream.on('end', () => resolve(files));
    });
  } catch (error) {
    console.error('Error listing files from MinIO:', error);
    throw new Error('Failed to list files');
  }
}

// Validate file type
export function validateFileType(fileName: string): boolean {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'];
  const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return allowedExtensions.includes(fileExtension);
}

// Validate file size (max 10MB)
export function validateFileSize(fileSize: number): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return fileSize <= maxSize;
}

// Legacy function for backward compatibility
export const PURCHASE_ORDER_BUCKET = BUCKETS.PURCHASE_ORDERS;
export const initializePurchaseOrderBucket = () => initializeBucket(BUCKETS.PURCHASE_ORDERS); 