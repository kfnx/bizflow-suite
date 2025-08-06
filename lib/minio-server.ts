import { initializeAllBuckets } from './minio';

let isInitialized = false;

export async function initializeMinIOServer() {
  if (isInitialized) {
    return;
  }

  try {
    console.log('Initializing MinIO server...');
    await initializeAllBuckets();
    isInitialized = true;
    console.log('MinIO server initialized successfully');
  } catch (error) {
    console.error('Failed to initialize MinIO server:', error);
    // Don't throw error to prevent app from crashing
  }
}

// Initialize on module load (for server-side)
if (typeof window === 'undefined') {
  initializeMinIOServer();
}
