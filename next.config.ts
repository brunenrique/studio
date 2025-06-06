import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    '9003-firebase-studio-1749122793512.cluster-etsqrqvqyvd4erxx7qq32imrjk.cloudworkstations.dev',
    '9003-firebase-studio2-1749148598567.cluster-qhrn7lb3szcfcud6uanedbkjnm.cloudworkstations.dev',
  ],
};

export default nextConfig;