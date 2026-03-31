/** @type {import('next').NextConfig} */
const nextConfig = {
  // 開発環境の最適化
  reactStrictMode: true,
  
  // 開発時のパフォーマンス最適化
  swcMinify: true,
  
  // 開発時のソースマップ（本番では無効化推奨）
  productionBrowserSourceMaps: false,
  
  // 画像最適化設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // 開発時の画像最適化を無効化（高速化）
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // 開発時のコンパイル最適化
  compiler: {
    // 開発時の不要なログを削減
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // 開発時のwebpack最適化
  webpack: (config, { dev, isServer }) => {
    // 開発環境での最適化
    if (dev) {
      // キャッシュの有効化
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
      
      // 開発時のビルド時間短縮
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig
