/**
 * next-sitemap configuration
 * Reads siteUrl from NEXT_PUBLIC_DOMAIN, falls back to imaginevisual.cc.
 */
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || "https://imaginevisual.cc";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: [],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },
};

module.exports = config;