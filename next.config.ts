import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // cần để chạy tốt trong Docker
};

export default nextConfig;
