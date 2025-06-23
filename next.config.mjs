/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' for Docker deployment
  // output: 'export',

  // Add standalone output for Docker
  output: 'standalone',
  productionBrowserSourceMaps: false,

  async redirects() {
    return [
      {
        source: '/settings',
        destination: '/settings/profile-settings',
        permanent: true,
      },
    ];
  },

  webpack: (config) => {
    // svgr
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
            dimensions: false,
            // removeAttributes: {}
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
