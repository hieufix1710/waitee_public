const nextConfig = {
  /* config options here */
  basePath: "",
  assetPrefix: "",
  images: {
    domains: ['waitee.top'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'waitee.top',
        port: '',
        pathname: '/cashier/**',
      },
    ],
  },
  devIndicators: {
    autoPrerender: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_HOST}/api/:path*`, // Proxy to API
      },
    ]
  },
  // For Next.js 13+, use 'allowedHosts' if needed for other hosts
  // allowedHosts: ['localhost'],
};

export default nextConfig;
