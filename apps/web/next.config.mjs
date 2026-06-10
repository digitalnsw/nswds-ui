/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nswds/ui'],
  async rewrites() {
    // Serve the registry project under /registry on this domain.
    // ui.digital.nsw.gov.au/registry/r/<name>.json proxies to the registry deployment.
    // Proxy the stable production alias — never a per-deploy URL. The registry project
    // must have Deployment Protection disabled or these fetches return 401.
    return [
      {
        source: '/registry',
        destination: 'https://nswds-ui-registry.vercel.app',
      },
      {
        source: '/registry/:path*',
        destination: 'https://nswds-ui-registry.vercel.app/:path*',
      },
    ]
  },
}

export default nextConfig
