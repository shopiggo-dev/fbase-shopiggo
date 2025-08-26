
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'static.zara.net',
      },
      {
        protocol: 'https',
        hostname: 'www.ecosmetics.com',
      },
       {
        protocol: 'https',
        hostname: 'media.ecosmetics.com',
      },
      {
        protocol: 'https',
        hostname: 'img.ltwebstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'kay.scene7.com',
      },
      {
        protocol: 'https',
        hostname: 'www.fragranceshop.com',
      },
      {
        protocol: 'https',
        hostname: 'www.kay.com',
      }
    ],
  },
};

export default nextConfig;
