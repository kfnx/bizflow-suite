import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  productionBrowserSourceMaps: false,
  webpack: (config, { isServer }) => {
    // SVG handling with proper path resolution
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
            dimensions: false,
          },
        },
      ],
    });

    // Add comprehensive path alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(__dirname, 'public'),
      '@': path.resolve(__dirname, '.'),
    };

    // Ensure proper module resolution
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, 'public'),
      'node_modules',
    ];

    return config;
  },
};

export default nextConfig;
