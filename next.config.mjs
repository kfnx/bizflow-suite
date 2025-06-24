import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  productionBrowserSourceMaps: false,
  webpack: (config) => {
    // SVG handling
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

    // Path alias for ~ -> public
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.join(process.cwd(), 'public'),
    };

    return config;
  },
};

export default nextConfig;
