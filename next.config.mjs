/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ["pg", "pg-connection-string"],
  },
  async redirects() {
    return [
      {
        source: "/atlas",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
