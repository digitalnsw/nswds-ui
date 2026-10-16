import { defineConfig } from 'vitest/config'

/**
 * Pure modules only: the PostHog options and start-up, and the path and ID helpers. The components
 * are thin wrappers over them. The shared CI's `install / test` job finds this config and runs the
 * package's `test` script, which puts the suite on the merge gate.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
