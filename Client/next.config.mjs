/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Ensure compatibility with Render
    reactStrictMode: true,
    trailingSlash: false,
    
    // Production optimizations
    compress: true,
    poweredByHeader: false,
    
    // Image optimization
    images: {
      domains: ['unlimiteddatagh.onrender.com', 'www.datahustle.shop'],
      formats: ['image/webp', 'image/avif'],
    },
    
    // Security headers
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
          ],
        },
      ];
    },
    
    // Environment variables validation
    env: {
      CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
  };
  
  export default nextConfig;
  