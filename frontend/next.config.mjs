/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['my-draw-safety-draw.s3.ap-northeast-2.amazonaws.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

export default nextConfig
