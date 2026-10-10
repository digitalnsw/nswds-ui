import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(import.meta.dirname, '../..')

// Local-dev convenience: load the monorepo-root .env so a REGISTRY_ORIGIN
// override is picked up. Skipped when absent (CI/Vercel provide vars directly).
const rootEnv = resolve(repoRoot, '.env')
if (existsSync(rootEnv)) {
  process.loadEnvFile(rootEnv)
}

// Where the shadcn registry is actually deployed — what /registry on this
// domain proxies TO. Consumers now install from the registry's own domain
// (`location` in registry.config.json); this rewrite keeps the legacy
// https://ui.digital.nsw.gov.au/registry path resolving, because items
// installed before the move carry it in their registryDependencies.
//
// Read `origin`, not `location`: the two are separate fields so the public URL
// can move without touching this proxy. `origin` must never be a path on THIS
// domain — pointing it at .../registry here would rewrite /registry/:path* to
// /registry/:path* on the same host, an infinite proxy loop. Prefer the
// registry's custom domain over its *.vercel.app name: Vercel renamed that
// alias once (nswds-ui-registry → nswds-registry) and silently broke this path.
//
// Single source of truth: registry.config.json (updated via
// `npm run registry:sync`). A REGISTRY_ORIGIN env var overrides at runtime.
const { origin: defaultRegistryOrigin } = JSON.parse(
  readFileSync(resolve(repoRoot, 'registry.config.json'), 'utf8'),
)
const registryOrigin = process.env.REGISTRY_ORIGIN ?? defaultRegistryOrigin

if (!registryOrigin) {
  throw new Error(
    'No registry origin resolved: set `origin` in registry.config.json or the REGISTRY_ORIGIN env var. ' +
      'Without it the /registry rewrite would have no upstream.',
  )
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // babel-plugin-react-compiler is a devDependency here, but installing it does
  // nothing on its own — Next only runs the compiler when this flag is set
  // (node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/reactCompiler.md).
  // It was installed and never enabled, so the dependency was inert while the
  // package source was already being written to the compiler's constraints:
  // eslint-plugin-react-hooks' compiler-era rules are active through
  // @workspace/eslint-config, and packages/ui carries deliberate workarounds
  // for them (the destructure note on useChromeHeight, the
  // set-state-in-effect disable in push-menu).
  reactCompiler: true,
  transpilePackages: ['@nswds/ui'],
  async rewrites() {
    // Serve the registry project under /registry on this domain.
    // /registry/r/<name>.json proxies to the registry deployment.
    // Proxy the stable production alias — never a per-deploy URL. The registry project
    // must have Deployment Protection disabled or these fetches return 401.
    return [
      {
        source: '/registry',
        destination: registryOrigin,
      },
      {
        source: '/registry/:path*',
        destination: `${registryOrigin}/:path*`,
      },
    ]
  },
}

export default nextConfig
