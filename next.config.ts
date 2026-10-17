import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  async rewrites() {
    const backendBaseUrl = process.env.API_HOST?.replace(/\/$/, '');

    if (!backendBaseUrl) {
      return [];
    }

    return [
      {
        source: '/backend-api/:path*',
        destination: `${backendBaseUrl}/:path*`,
      },
    ];
  },
  webpack: (config, { dev }) => {
    // HMR is disabled via DISABLE_HMR env var; file watching is turned off to
    // prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
