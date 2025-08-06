import { BUCKETS, initializeAllBuckets, minioClient } from './minio';

async function initMinIO() {
  try {
    console.log('Initializing MinIO...');

    // Test connection
    const buckets = await minioClient.listBuckets();
    console.log('Connected to MinIO successfully');
    console.log(
      'Existing buckets:',
      buckets.map((b) => b.name),
    );

    // Initialize all buckets
    await initializeAllBuckets();

    console.log('MinIO initialization completed successfully');
  } catch (error) {
    console.error('Failed to initialize MinIO:', error);
    process.exit(1);
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initMinIO();
}

export { initMinIO };
