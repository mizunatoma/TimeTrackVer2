/** @type {import('next').NextConfig} */
const nextConfig = {
  // next build時のESLintチェックをスキップ
  // lintの責務を「build」から「CI/CD」に移す
  eslint: {
    ignoreDuringBuilds: true,
  },
  // サーバー起動時にinstrumentation.tsを探してregister()を呼ぶ
  experimental: {
    instrumentationHook: true,
  },
}

export default nextConfig
