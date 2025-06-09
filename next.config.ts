const nextConfig = {
  /* config options here */
  basePath: "",
  assetPrefix: "",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "waitee.top",
        port: "",
        pathname: "**",
        search: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "**",
        search: "",
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
