import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
// Only allow static export when explicitly enabled AND not on Vercel
const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true' && !process.env.VERCEL;
const repoBase = process.env.NEXT_GH_BASE || '/aivideogen';

const nextConfig = {
  // Images configuration; when static exporting, disable server optimization
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nextuipro.nyc3.cdn.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'replicate.com',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
    ],
  },

  // Apply GitHub Pages specific settings only for static export
  ...(isStaticExport
    ? {
        output: 'export',
        basePath: repoBase,
        assetPrefix: repoBase,
        trailingSlash: true,
      }
    : {}),
};

export default withNextIntl(nextConfig);