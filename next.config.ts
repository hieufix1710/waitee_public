const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'waitee.top',
        port: '',
        pathname: '/files/**',
        search: '',
      },
    ],
  },
  devIndicators: {
    autoPrerender: false,
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://waitee.top/cashier/vi/:path*', // Proxy to API
  //     },
  //   ]
  // },
  // For Next.js 13+, use 'allowedHosts' if needed for other hosts
  // allowedHosts: ['localhost'],
};

export default nextConfig;
