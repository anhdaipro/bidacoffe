import type { NextConfig } from "next";
import path from 'path';
const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true, // ✅ đúng,
    
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  // Tùy chỉnh Webpack
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'), // Alias `@` trỏ đến thư mục `src`
      '@backend': path.resolve(__dirname, 'src/backend'), // Alias `@backend` trỏ đến `src/backend`
      '@form': path.resolve(__dirname, 'src/form'), // Alias `@form` trỏ đến `src/form`
    };
    return config;
  },
  /* config options here */
};

export default nextConfig;
