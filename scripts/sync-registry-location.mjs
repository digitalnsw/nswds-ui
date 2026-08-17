// Propagate the registry deployment URL from .env into every committed file that
// embeds it, so the URL has a single human-edited source: the .env file.
//
//   1. Edit REGISTRY_LOCATION in .env
//   2. npm run registry:sync   (runs this script, then rebuilds the registry JSON)
//   3. commit + push
//
// This writes the new value into registry.config.json (the committed source of
// truth that CI and all code read) and find-replaces it through the human-facing
// docs. The generated registry JSON is handled by registry:build, which reads
// registry.config.json. Idempotent: a no-op when nothing changed.
//
// registry.config.json holds TWO urls and this script only ever touches the
// first:
//   location — the PUBLIC url consumers are told to use
//              (https://ui.digital.nsw.gov.au/registry). Stamped into the
//              registry JSON's registryDependencies and into the docs below.
//   origin   — the underlying registry deployment that apps/web proxies
//              /registry to. Deliberately NOT derived from `location`: they
//              differ because the public url is a proxied path on the web app's
//              domain, so pointing the proxy at `location` would loop. Change it
//              by hand, only when the registry's Vercel project url changes.

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const configPath = resolve(root, 'registry.config.json')

// .env is the single edit point. Absent in CI — there the config is already current.
const envPath = resolve(root, '.env')
if (existsSync(envPath)) {
  process.loadEnvFile(envPath)
}

const config = JSON.parse(readFileSync(configPath, 'utf8'))
const oldLocation = config.location.replace(/\/+$/, '')
const newLocation = (process.env.REGISTRY_LOCATION ?? oldLocation).replace(/\/+$/, '')

if (newLocation === oldLocation) {
  console.log(`✔ registry location unchanged (${oldLocation}) — nothing to propagate`)
  process.exit(0)
}

// Human-facing files that embed the full URL for readers (the generated registry
// JSON is regenerated from registry.config.json by registry:build, not here).
const docs = [
  'README.md',
  'packages/ui/README.md',
  'docs/installing-from-the-registry.md',
  'apps/registry/index.html',
]

let touched = 0
for (const rel of docs) {
  const filePath = resolve(root, rel)
  const before = readFileSync(filePath, 'utf8')
  const after = before.split(oldLocation).join(newLocation)
  if (after !== before) {
    writeFileSync(filePath, after)
    touched += 1
  }
}

config.location = newLocation
writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)

console.log(
  `✔ registry location ${oldLocation} → ${newLocation}\n` +
    `  updated registry.config.json + ${touched} doc file(s)\n` +
    `  regenerating registry JSON…`,
)
