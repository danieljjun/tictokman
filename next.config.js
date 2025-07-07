/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'tiktokman.vercel.app'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|mov)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]',
        },
      },
    })
    return config
  },
  async headers() {
    return [
      {
        source: '/api/upload',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Accept' }
        ],
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb'
    }
  },
  // API 라우트에서 파일 업로드 지원
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  }
}

module.exports = nextConfig 