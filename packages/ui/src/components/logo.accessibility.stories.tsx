/**
 * Logo — Accessibility
 *
 * WCAG 2.2 criterion-driven stories for the Logo component.
 *
 * The Logo is a presentational mark with an sr-only accessible name — it is
 * not focusable, not interactive, and has no size variants. The applicable
 * criteria are therefore limited to:
 *
 *   - 1.1.1 Non-text Content (A) — accessible name is provided
 *   - 1.4.11 Non-text Contrast (AA) — the mark meets 3:1 against its surface
 *   - 1.4.1  Use of Color (A) — meaning conveyed by more than colour alone
 *
 * Stories for focus visibility, keyboard operation, and target size do not
 * apply (the Logo carries no role or hit area of its own).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Logo } from './logo.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Logo/Accessibility',
  component: Logo,
  tags: ['!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    logoType: 'default',
  },
} satisfies Meta<typeof Logo>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Sanctioned pairings only (DESIGN.md, The Fixed-Mark Rule): full colour on
// light surfaces, full colour reversed on the -800 brand band.
const pageTile = 'space-y-3 rounded-md bg-background p-6 ring-1 ring-foreground/10'
const mutedTile = 'space-y-3 rounded-md bg-muted p-6 ring-1 ring-foreground/10'
const bandTile = 'space-y-3 rounded-md bg-primary-800 p-6 text-white dark:bg-primary-950'

function getLogoSvg(canvasElement: HTMLElement): SVGSVGElement {
  const svg = canvasElement.querySelector('svg')
  if (!svg) throw new Error('Could not find the Logo svg element in canvas.')
  return svg
}

/**
 * The opaque colour an element is painted on: its own background composited
 * over each ancestor's until an opaque one is reached.
 */
function paintedBackground(element: Element): string {
  const layers: string[] = []
  for (let node: Element | null = element; node; node = node.parentElement) {
    const background = getComputedStyle(node).backgroundColor
    layers.push(background)
    if (resolveColor(background).a === 1) {
      const [base, ...tints] = layers.reverse()
      let painted = resolveColor(base!)
      for (const tint of tints) painted = { ...compositeOver(resolveColor(tint), painted), a: 1 }
      return `rgb(${painted.r} ${painted.g} ${painted.b})`
    }
  }
  throw new Error('No opaque background behind the element.')
}

function getSrOnlyName(canvasElement: HTMLElement): HTMLSpanElement {
  const span = canvasElement.querySelector<HTMLSpanElement>('span.sr-only')
  if (!span) throw new Error('Could not find the sr-only accessible name span.')
  return span
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const NonTextContent: Story = {
  name: 'Non-text Content — 1.1.1',
  parameters: {
    wcag: ['1.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.1.1',
          why: 'The Logo conveys information (the NSW Government identity) and therefore must expose a text alternative so assistive technology can announce its meaning to users who cannot see it.',
          how: 'Inspect the DOM — there should be a visually hidden span containing the text "NSW Government" immediately before the SVG, and the SVG itself should carry aria-hidden="true" so the path data is not read out. The play() function below asserts both conditions programmatically.',
          caveat:
            'The accessible name is supplied via an adjacent sr-only span rather than an aria-label on the SVG. This pattern keeps the name in the accessibility tree without exposing the inline SVG geometry to screen readers.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-4'>
      <Logo className='h-16 w-auto' />
      <p className='text-base text-muted-foreground'>
        Run a screen reader (VoiceOver, NVDA, JAWS) over the logo above and confirm it is announced
        as &quot;NSW Government&quot;.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const srOnly = getSrOnlyName(canvasElement)
    if (srOnly.textContent !== 'NSW Government') {
      throw new Error(
        `Expected sr-only accessible name "NSW Government", received "${srOnly.textContent}".`,
      )
    }

    const svg = getLogoSvg(canvasElement)
    if (svg.getAttribute('aria-hidden') !== 'true') {
      throw new Error(
        `Expected the Logo svg to carry aria-hidden="true" so its path data is not exposed; received "${svg.getAttribute(
          'aria-hidden',
        )}".`,
      )
    }
  },
}

export const NonTextContrast: Story = {
  name: 'Non-text Contrast — 1.4.11',
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The Logo is essential non-text content. Its visual form must meet a 3:1 contrast ratio against the surface behind it so users with low vision can perceive it.',
          how: 'The play() measures the wordmark of each sanctioned pairing below against the tile it sits on: the full-colour mark against the light surfaces, the reversed mark against the brand band, each at 3:1 or better. The (dark) story repeats it in dark mode, where both marks turn white.',
          caveat:
            'Contrast for multi-colour marks is measured against the darkest stroke or shape that carries identity-bearing detail. For the NSW waratah this is the blue wordmark on light surfaces and the white wordmark on the brand band.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3'>
      <div className={pageTile}>
        <Logo logoType='default' className='h-16 w-auto' />
        <p className='text-base text-muted-foreground'>
          default on the page — blue wordmark and red waratah against white
        </p>
      </div>

      <div className={mutedTile}>
        <Logo logoType='default' className='h-16 w-auto' />
        <p className='text-base text-muted-foreground'>default on a muted section</p>
      </div>

      <div className={bandTile}>
        <Logo logoType='reversed' className='h-16 w-auto' />
        <p className='text-base'>reversed on the brand band — white wordmark, red waratah</p>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg')
    await expect(svgs).toHaveLength(3)
    for (const svg of svgs) {
      // The first path of the full lockup is the wordmark — the identity-bearing
      // detail the caveat names.
      const wordmark = svg.querySelector('path')!
      const tile = svg.parentElement!
      expectContrast(getComputedStyle(wordmark).fill, paintedBackground(tile), {
        minimum: 3,
        label: `Wordmark, ${tile.querySelector('p')?.textContent ?? 'tile'}`,
      })
    }
  },
}

export const NonTextContrastDark: Story = {
  ...NonTextContrast,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

export const UseOfColour: Story = {
  name: 'Use of Color — 1.4.1',
  parameters: {
    wcag: ['1.4.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.1',
          why: 'The Logo must not rely on colour alone to convey the NSW Government identity. The mark must remain recognisable to users with monochromatic vision and to users viewing the page in forced-colours mode.',
          how: 'Compare the full-colour and reversed renderings — the silhouette of the waratah and the wordmark shape must remain identifiable in every treatment. The play() asserts both draw exactly the same geometry, path for path, so only the fills differ, and that both carry the accessible name "NSW Government".',
          caveat:
            'Forced-colours mode (e.g. Windows High Contrast) may replace the SVG fills entirely. The sr-only accessible name guarantees the mark continues to communicate its identity even when no fill colour is rendered.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-5xl space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className={pageTile}>
          <Logo logoType='default' className='h-16 w-auto' />
          <p className='text-base text-muted-foreground'>
            Full colour — silhouette, wordmark and brand fills
          </p>
        </div>
        <div className={bandTile}>
          <Logo logoType='reversed' className='h-16 w-auto' />
          <p className='text-base'>Reversed — the same silhouette and wordmark on the brand band</p>
        </div>
      </div>
      <p className='text-base text-muted-foreground'>
        The mark&apos;s meaning is carried by three independent channels — its distinctive
        silhouette, the &quot;NSW Government&quot; accessible name, and only then by colour. The
        mono marks reproduce the silhouette in one colour, but they are restricted use and need NSW
        Government Brand Team approval, so they are not shown here.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [full, reversed] = canvasElement.querySelectorAll('svg')
    const shapes = (svg: SVGSVGElement) =>
      [...svg.querySelectorAll('path')].map((path) => path.getAttribute('d'))
    await expect(shapes(full!)).toEqual(shapes(reversed!))
    for (const name of canvasElement.querySelectorAll('span.sr-only')) {
      await expect(name).toHaveTextContent('NSW Government')
    }
  },
}
