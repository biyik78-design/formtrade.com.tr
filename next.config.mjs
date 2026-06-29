/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: process.env.GITHUB_PAGES ? '/formtrade.com.tr' : '',
  assetPrefix: process.env.GITHUB_PAGES ? '/formtrade.com.tr' : '',
}
export default nextConfig
