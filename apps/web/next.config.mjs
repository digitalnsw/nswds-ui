import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(import.meta.dirname, '../..')

// Local-dev convenience: load the monorepo-root .env so a REGISTRY_LOCATION
// override is picked up. Skipped when absent (CI/Vercel provide vars directly).
const rootEnv = resolve(repoRoot, '.env')
if (existsSync(rootEnv)) {
  process.loadEnvFile(rootEnv)
}

// Where the shadcn registry is deployed; the /registry path on this domain
// proxies to it. Single source of truth: registry.config.json (updated via
// `npm run registry:sync`). A REGISTRY_LOCATION env var overrides at runtime.
const { location: defaultRegistryLocation } = JSON.parse(
  readFileSync(resolve(repoRoot, 'registry.config.json'), 'utf8'),
)
const registryLocation = process.env.REGISTRY_LOCATION ?? defaultRegistryLocation

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nswds/ui'],
  async rewrites() {
    // Serve the registry project under /registry on this domain.
    // /registry/r/<name>.json proxies to the registry deployment.
    // Proxy the stable production alias — never a per-deploy URL. The registry project
    // must have Deployment Protection disabled or these fetches return 401.
    return [
      {
        source: '/registry',
        destination: registryLocation,
      },
      {
        source: '/registry/:path*',
        destination: `${registryLocation}/:path*`,
      },
    ]
  },
}

export default nextConfig
