/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // next build時のESLintチェックをスキップ
    // lintの責務を「build」から「CI/CD」に移す
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
