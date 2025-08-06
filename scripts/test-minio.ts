#!/usr/bin/env tsx

import { minioClient, BUCKETS, initializeAllBuckets } from '../lib/minio';

async function testMinIO() {
  try {
    console.log('🧪 Testing MinIO connection...');

    // Test connection
    const buckets = await minioClient.listBuckets();
    console.log('✅ Connected to MinIO successfully');
    console.log('📦 Existing buckets:', buckets.map(b => b.name));

    // Initialize all buckets
    await initializeAllBuckets();
    console.log('✅ All buckets initialized');

    // Test each bucket exists
    for (const [bucketKey, bucketName] of Object.entries(BUCKETS)) {
      const bucketExists = await minioClient.bucketExists(bucketName);
      console.log(`✅ Bucket '${bucketName}' exists:`, bucketExists);
    }

    console.log('\n🎉 MinIO setup is working correctly!');
    console.log('\n📋 Configuration:');
    console.log(`   Endpoint: ${process.env.MINIO_ENDPOINT || '127.0.0.1'}`);
    console.log(`   Port: ${process.env.MINIO_PORT || '9000'}`);
    console.log(`   SSL: ${process.env.MINIO_USE_SSL === 'true'}`);
    console.log('\n📦 Buckets:');
    for (const [bucketKey, bucketName] of Object.entries(BUCKETS)) {
      console.log(`   ${bucketKey}: ${bucketName}`);
    }

  } catch (error) {
    console.error('❌ MinIO test failed:', error);
    process.exit(1);
  }
}

testMinIO(); 