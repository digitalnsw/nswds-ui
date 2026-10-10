/** @type {import('next').NextConfig} */
const nextConfig = {
  // Same compiler setup as apps/web — see the note in its next.config.mjs.
  reactCompiler: true,
  transpilePackages: ['@nswds/ui'],
}

export default nextConfig
