const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

