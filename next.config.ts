/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config: any) {
    // SVG 파일 처리
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    // 폰트 파일 처리
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]'
      }
    });

    return config;
  },
  images: {
    domains: [
      'images.unsplash.com',
      'vzzrwrhqblvkiubpvjdc.supabase.co'
    ]
  }
};

module.exports = nextConfig; 