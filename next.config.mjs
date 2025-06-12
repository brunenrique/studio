import { withBundleAnalyzer } from 'next-bundle-analyzer';

/** @type {import('next').NextConfig} */
const baseConfig = {
  // Adicione outras configurações do Next.js aqui, se houver.
};

const nextConfig = process.env.ANALYZE === 'true' ? withBundleAnalyzer()(baseConfig) : baseConfig;

export default nextConfig;
