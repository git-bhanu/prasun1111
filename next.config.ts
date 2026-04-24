import type { NextConfig } from 'next';

interface SvgAssetRule {
  test?: RegExp;
  issuer?: unknown;
  resourceQuery?: {
    not?: RegExp[];
  };
  exclude?: RegExp;
}

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    const assetRule = config.module.rules.find(
      (rule: unknown): rule is SvgAssetRule =>
        typeof rule === 'object' && rule !== null && 'test' in rule && rule.test instanceof RegExp && rule.test.test('.svg')
    );

    if (assetRule) {
      config.module.rules.push(
        {
          ...assetRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        {
          test: /\.svg$/i,
          issuer: assetRule.issuer,
          resourceQuery: { not: [...(assetRule.resourceQuery?.not ?? []), /url/] },
          use: ['@svgr/webpack'],
        }
      );

      assetRule.exclude = /\.svg$/i;
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.tina.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
    ],
  },
  async headers() {
    // these are also defined in the root layout since github pages doesn't support headers
    const headers = [
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'self'",
      },
    ];
    return [
      {
        source: '/(.*)',
        headers,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
    ];
  },
};

export default nextConfig;
