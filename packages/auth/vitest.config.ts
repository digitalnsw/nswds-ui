import { defineConfig } from 'vitest/config'

/**
 * Pure modules only — the allowlist, the proxy gate over a stubbed session
 * read, and Better Auth over its memory adapter — so the suite runs in Node
 * with no database. The shared CI's `install / test` job finds this config and
 * runs the package's `test` script, which puts the suite on the merge gate.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
