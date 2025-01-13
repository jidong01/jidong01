/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'fbhhupegvlydirvlkmmb.supabase.co',
      'vzzrwrhqblvkiubpvjdc.supabase.co'
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  }
}

module.exports = nextConfig 