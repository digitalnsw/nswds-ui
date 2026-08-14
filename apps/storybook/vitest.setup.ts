/**
 * Workaround for vitest-dev/vitest#9437 — Chromium disk exhaustion in browser
 * mode. REMOVE once a released vitest carries vitest-dev/vitest#10912 and we
 * are on it.
 *
 * Chromium leaks a 2MiB shared-memory block per script request answered with
 * 304 Not Modified (Chromium bug 530892387). Vite serves modules with
 * etag+no-cache, so every per-story tester iframe revalidates the whole module
 * graph; Playwright launches Chromium with --disable-dev-shm-usage, which
 * turns the leaked blocks into deleted-but-open files on the runner's root
 * filesystem. On 2-core GitHub runners (~14GB disk) the free space collapses
 * mid-run — measured in this repo at ~1.2GB/s during iframe-setup bursts,
 * bottoming at 0.33GB free at the moment the tester page died — and whichever
 * story file is importing at that instant fails with the roaming
 * "Cannot connect to the iframe" / "Failed to fetch dynamically imported
 * module" pair (issue #83; verification data in the issue thread).
 *
 * Forcing a garbage collection at the end of every test file releases the
 * blocks before the next file's revalidation burst stacks on top. Upstream
 * measured this exact hook taking peak accumulation from 13.7GB to 0.55GB;
 * vitest's own fix (#10912, merged but unreleased) is the same collection
 * triggered automatically on low disk.
 *
 * `cdp()` is Chromium-over-Playwright only, which is the only configuration
 * this project runs (see browser.instances in vitest.config.ts). The guard
 * keeps a hypothetical future firefox/webkit instance from crashing here —
 * they don't have the Chromium bug, so skipping is correct, not a gap.
 */
import { cdp, server } from '@vitest/browser/context'
import { afterAll } from 'vitest'

afterAll(async () => {
  if (server.provider === 'playwright' && server.browser === 'chromium') {
    await cdp().send('HeapProfiler.collectGarbage')
  }
})
