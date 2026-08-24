/**
 * Logo — Features
 *
 * Variant matrix, size scale, surface compatibility, responsive sizing, and
 * overlay-on-image treatment.
 *
 * These stories are intended for internal use during design token reviews
 * and CSS refactors to catch regressions across the full Logo surface. They
 * are not external documentation — each story renders one focused axis of
 * variation so the diff signal stays high.
 *
 * The Logo has no `data-slot` attribute, so play() assertions and visual
 * review query the SVG and the sr-only accessible-name span directly.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Logo } from './logo.js'
import { docsTemplate } from './story-helpers.js'

const meta = {
  title: 'Components/Logo/Features',
  component: Logo,
  parameters: {
    layout: 'padded',
  },
  args: {
    logoType: 'default',
  },
} satisfies Meta<typeof Logo>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'All four logoType variants rendered side by side, each on an appropriate surface — default and mono-black on the light background, reversed and mono-white on a dark grey-900 background.',
          why: 'Confirms each variant resolves the correct fill colour and is legible on the surface it is designed to be paired with.',
          how: 'Compare each variant against its surface — the dark variants must read solidly against the grey-900 background and the light variants against the default background.',
          caveat:
            'The reversed and mono-white variants are not visible on the default light background; the grey-900 surface used here matches the NSW Government masthead colour family.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2'>
      <div className='space-y-3 rounded-sm border border-border bg-background p-6'>
        <Logo logoType='default' className='h-16 w-auto' />
        <p className='text-sm text-muted-foreground'>default</p>
      </div>
      <div className='space-y-3 rounded-sm border border-border bg-background p-6'>
        <Logo logoType='mono-black' className='h-16 w-auto' />
        <p className='text-sm text-muted-foreground'>mono-black</p>
      </div>
      <div className='space-y-3 rounded-sm border border-grey-700 bg-grey-900 p-6'>
        <Logo logoType='reversed' className='h-16 w-auto' />
        <p className='text-sm text-grey-200'>reversed</p>
      </div>
      <div className='space-y-3 rounded-sm border border-grey-700 bg-grey-900 p-6'>
        <Logo logoType='mono-white' className='h-16 w-auto' />
        <p className='text-sm text-grey-200'>mono-white</p>
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The default logo rendered at four common header heights: h-8 (32px), h-12 (48px), h-16 (64px), and h-24 (96px).',
          why: 'The Logo scales with its container — checking the size scale catches anti-aliasing or stroke-width regressions across the realistic header-height range.',
          how: 'Compare the proportions of the waratah and the wordmark at each size; both should remain visually balanced and crisp without any path clipping.',
          caveat:
            'The SVG uses an intrinsic viewBox of 0 0 259 280 — non-square containers must use w-auto (or set height only) to preserve the aspect ratio.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex w-full max-w-5xl flex-wrap items-end gap-8 rounded-sm border border-border bg-background p-6'>
      <div className='space-y-2'>
        <Logo className='h-8 w-auto' />
        <p className='text-xs text-muted-foreground'>h-8 · 32px</p>
      </div>
      <div className='space-y-2'>
        <Logo className='h-12 w-auto' />
        <p className='text-xs text-muted-foreground'>h-12 · 48px</p>
      </div>
      <div className='space-y-2'>
        <Logo className='h-16 w-auto' />
        <p className='text-xs text-muted-foreground'>h-16 · 64px</p>
      </div>
      <div className='space-y-2'>
        <Logo className='h-24 w-auto' />
        <p className='text-xs text-muted-foreground'>h-24 · 96px</p>
      </div>
    </div>
  ),
}

export const Backgrounds: Story = {
  name: 'Backgrounds',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The Logo rendered against four common surfaces: white, light grey, NSW-blue dark, and black. Each cell uses the variant intended for that surface so the pairing represents real usage.',
          why: 'Catches contrast and fill-token regressions when surface tokens or theme variables change. Each pairing must remain legible without any wash-out or vanishing strokes.',
          how: 'Scan each cell and confirm the waratah and wordmark are visually intact against the surface; report any cell where the mark loses definition.',
          caveat:
            'These surfaces use raw NSW palette tokens (white, grey-100, primary-800, black) intentionally to model real downstream contexts. Components elsewhere should reference semantic tokens, not raw palette colours.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2'>
      <div className='space-y-3 rounded-sm border border-border bg-white p-6'>
        <Logo logoType='default' className='h-16 w-auto' />
        <p className='text-sm text-grey-700'>white · default</p>
      </div>
      <div className='space-y-3 rounded-sm border border-border bg-grey-100 p-6'>
        <Logo logoType='default' className='h-16 w-auto' />
        <p className='text-sm text-grey-700'>grey-100 · default</p>
      </div>
      <div className='space-y-3 rounded-sm border border-grey-700 bg-primary-800 p-6'>
        <Logo logoType='reversed' className='h-16 w-auto' />
        <p className='text-sm text-grey-100'>primary-800 · reversed</p>
      </div>
      <div className='space-y-3 rounded-sm border border-grey-700 bg-black p-6'>
        <Logo logoType='mono-white' className='h-16 w-auto' />
        <p className='text-sm text-grey-100'>black · mono-white</p>
      </div>
    </div>
  ),
}

export const Responsive: Story = {
  name: 'Responsive',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The Logo placed inside a header-style banner that scales its height responsively: h-8 on mobile, h-12 from md, and h-16 from lg.',
          why: 'Documents the recommended responsive sizing pattern for the NSW Government masthead, where the mark grows with the available viewport width.',
          how: 'Resize the Storybook canvas across the sm, md, and lg viewport presets and confirm the Logo grows at each breakpoint without overflowing the banner.',
          caveat:
            'Breakpoints used here are the default Tailwind md (768px) and lg (1024px) — consuming apps with custom breakpoints should mirror the same scaling pattern using their own tokens.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-5xl space-y-3'>
      <div className='flex items-center justify-between rounded-sm border border-grey-700 bg-primary-800 p-4'>
        <Logo logoType='reversed' className='h-8 w-auto md:h-12 lg:h-16' />
        <span className='text-sm text-grey-100'>NSW Government</span>
      </div>
      <p className='text-xs text-muted-foreground'>
        Resize the canvas — the Logo scales from h-8 at mobile widths up to h-16 on lg+ viewports.
      </p>
    </div>
  ),
}

export const OnImage: Story = {
  name: 'On Image',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The mono-white Logo composited over a placeholder image to model real-world overlay usage on hero photography.',
          why: 'Confirms the mono-white variant retains enough visual weight when placed on busy imagery and documents the recommended overlay treatment (dark gradient scrim) used to guarantee contrast.',
          how: 'Inspect the area behind the Logo — the gradient scrim should darken the underlying image enough that the mark remains clearly readable. Test against your own photography to validate the scrim opacity for your worst-case image.',
          caveat:
            'The placeholder uses a CSS gradient so the story is self-contained; production usage should layer the same dark scrim over real imagery to guarantee non-text contrast.',
        }),
      },
    },
  },
  render: () => (
    <div className='relative w-full max-w-3xl overflow-hidden rounded-sm border border-grey-700'>
      <div
        aria-hidden='true'
        className='aspect-[16/7] w-full'
        style={{
          background:
            'linear-gradient(135deg, oklch(0.45 0.12 250), oklch(0.30 0.18 30), oklch(0.20 0.05 280))',
        }}
      />
      <div
        aria-hidden='true'
        className='absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60'
      />
      <div className='absolute inset-0 flex items-end p-6'>
        <Logo logoType='mono-white' className='h-12 w-auto md:h-16' />
      </div>
    </div>
  ),
}

export const Wordmark: Story = {
  name: 'Wordmark',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The two wordmark lockups side by side: the full mark (waratah + "NSW" + "Government") and the compact `wordmark="nsw"` mark, which drops the "Government" row.',
          why: 'The compact mark suits tight horizontal space — a mobile header, for one — where the full three-row lockup would crowd the site name. The Header component swaps to it automatically below the sm breakpoint.',
          how: 'Both are set to the same rendered height; confirm the nsw mark drops the "Government" row and sits flush to its box (its viewBox crops from 280 to 247) while the waratah and "NSW" stay identical in proportion.',
          caveat:
            'The visually-hidden accessible name stays "NSW Government" for both lockups, so screen readers announce them identically regardless of which rows are drawn.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap items-end gap-8'>
      <div className='space-y-3 rounded-sm border border-border bg-background p-6'>
        <Logo className='h-20 w-auto' />
        <p className='text-sm text-muted-foreground'>full (default)</p>
      </div>
      <div className='space-y-3 rounded-sm border border-border bg-background p-6'>
        <Logo wordmark='nsw' className='h-20 w-auto' />
        <p className='text-sm text-muted-foreground'>nsw</p>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg')
    const nsw = [...svgs].find((s) => s.getAttribute('viewBox') === '0 0 259 247')
    if (!nsw) {
      throw new Error('Expected an nsw-wordmark Logo with viewBox "0 0 259 247".')
    }
    // The full mark draws four paths; the nsw mark drops the "Government" row,
    // so it must draw exactly three.
    const pathCount = nsw.querySelectorAll('path').length
    if (pathCount !== 3) {
      throw new Error(`Expected the nsw wordmark to draw 3 paths, found ${pathCount}.`)
    }
    const srOnly = canvasElement.querySelectorAll('span.sr-only')
    for (const span of srOnly) {
      if (span.textContent !== 'NSW Government') {
        throw new Error(
          `Expected every Logo accessible name to stay "NSW Government", received "${span.textContent}".`,
        )
      }
    }
  },
}
