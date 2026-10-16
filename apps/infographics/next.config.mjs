import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Local-dev convenience: load the monorepo-root .env, the one file every app
// reads its auth env from (DATABASE_URL, BETTER_AUTH_*, SIGNUP_ALLOWED_EMAILS —
// see .env.example). Skipped when absent (CI/Vercel provide vars directly).
const rootEnv = resolve(import.meta.dirname, '../../.env')
if (existsSync(rootEnv)) {
  process.loadEnvFile(rootEnv)
}

// This app is the `/infographics` zone of ui.design.nsw.gov.au: the web app rewrites that path to
// this project's own domain (apps/web/zones.mjs), so it serves everything, assets included, under
// the same path. Links to the docs or Storybook leave the zone and must be plain `<a>` elements.
const basePath = '/infographics'

// Its own domain only fetches for the web app; a person who opens its root goes to the real address.
const ownHosts = '(?:www\\.)?infographics\\.design\\.nsw\\.gov\\.au'

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  // Next only runs the React Compiler when this flag is set; installing
  // babel-plugin-react-compiler alone does nothing
  // (node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/reactCompiler.md).
  reactCompiler: true,
  transpilePackages: ['@nswds/ui', '@workspace/auth', '@workspace/analytics'],
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: ownHosts }],
        destination: `https://ui.design.nsw.gov.au${basePath}`,
        basePath: false,
        permanent: false,
      },
      // Anywhere else (this project's own vercel.app address, `next start`), the root is the app's.
      { source: '/', destination: basePath, basePath: false, permanent: false },
    ]
  },
}

export default nextConfig
