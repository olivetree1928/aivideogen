import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable static exports for GitHub Pages
    output: "export",
    
    // Set base path for GitHub Pages (repository name)
    basePath: "/aivideogen",
    
    // Asset prefix for GitHub Pages
    assetPrefix: "/aivideogen",
    
    // Disable server-based image optimization for static export
    images: {
        unoptimized: true,
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'nextuipro.nyc3.cdn.digitaloceanspaces.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: "https",
            hostname: "replicate.com",
          },
          {
            protocol: "https",
            hostname: "replicate.delivery",
          },
        ],
      },
      
    // Disable trailing slash for GitHub Pages compatibility
    trailingSlash: true,
};
 
export default withNextIntl(nextConfig);