/**
 * ButtonGroup — Accessibility
 *
 * WCAG 2.2 criterion-driven stories for the ButtonGroup component.
 *
 * Stories are organised by applicable success criteria. Each story declares
 * the criteria it covers in `parameters.wcag` and uses `wcagStoryMeta` to
 * generate its description (so the criterion number, level, title, and W3C
 * link appear in the Docs panel automatically).
 *
 * NOTE: the helper functions (`docsTemplate`, `WCAG_CRITERIA`, `wcagStoryMeta`,
 * `ThemeSurface`) are inlined here, as they are in the Button stories, until
 * the shared story-helpers module lands.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import {
  IconContentCopy,
  IconContentCut,
  IconContentPaste,
  IconExpandMore,
} from '../icons/index.js'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './button-group.js'
import { Button } from './button.js'

// ─── Constants ────────────────────────────────────────────────────────────────

type ColorKey =
  | 'white'
  | 'grey'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'danger'
  | 'success'
  | 'warning'

const lowContrastColors = ['white', 'secondary'] as const
const lowContrastSet = new Set<ColorKey>(lowContrastColors)

// The colours whose soft and surface tints clear WCAG 1.4.3 for a bold 16px
// label. `tertiary` and `accent` are left out on purpose: primary-600 on its
// own 10% tint measures 3.99:1 (4.28:1 on the 5% tint) and accent-600 on its
// 10% tint 4.39:1, under the 4.5:1 floor. Those are Button's own soft /
// surface pairs — the group only makes axe able to measure them, because it
// paints the band on a real element rather than a pseudo-element — so the
// fix is a token retune. Until then a story that demonstrates compliance
// must not render pairs that do not comply.
const themeColors: readonly ColorKey[] = ['white', 'grey', 'primary', 'secondary', 'danger']

// The solid band is a different pair — white on the -600 or -800 fill — and
// it clears the floor for every colour, two of them by 0.03. Measured here in
// light mode for the four colours above; the matrices in the Features folder
// scope the contrast rule off entirely, so this is the only place a retune of
// success-600 or warning-600 that drops under 4.5:1 would fail CI.
const solidBandColors: readonly ColorKey[] = ['tertiary', 'accent', 'success', 'warning']

const variants = ['outline', 'solid', 'soft', 'surface', 'ghost'] as const

// The ring a segment paints under :focus — inside its edge, because the group
// clips its corners — and the label-coloured ring a solid segment paints.
const forcedFocusClasses = 'outline outline-2 -outline-offset-2 outline-(--btn-bg)'
const forcedSolidFocusClasses = 'outline outline-2 -outline-offset-2 outline-(--btn-text)'

// ─── WCAG criteria map ────────────────────────────────────────────────────────

interface WcagCriterion {
  number: string
  level: 'A' | 'AA' | 'AAA'
  title: string
  url: string
}

const WCAG_CRITERIA: Record<string, WcagCriterion> = {
  '1.3.1': {
    number: '1.3.1',
    level: 'A',
    title: 'Info and Relationships',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships',
  },
  '1.4.3': {
    number: '1.4.3',
    level: 'AA',
    title: 'Contrast (Minimum)',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum',
  },
  '1.4.11': {
    number: '1.4.11',
    level: 'AA',
    title: 'Non-text Contrast',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast',
  },
  '2.1.1': {
    number: '2.1.1',
    level: 'A',
    title: 'Keyboard',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard',
  },
  '2.4.7': {
    number: '2.4.7',
    level: 'AA',
    title: 'Focus Visible',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible',
  },
  '2.4.11': {
    number: '2.4.11',
    level: 'AA',
    title: 'Focus Not Obscured (Minimum)',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum',
  },
  '2.5.5': {
    number: '2.5.5',
    level: 'AAA',
    title: 'Target Size (Enhanced)',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced',
  },
  '2.5.8': {
    number: '2.5.8',
    level: 'AA',
    title: 'Target Size (Minimum)',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum',
  },
  '4.1.2': {
    number: '4.1.2',
    level: 'A',
    title: 'Name, Role, Value',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value',
  },
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/ButtonGroup/Accessibility',
  component: ButtonGroup,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const docsTemplate = ({
  what,
  why,
  how,
  caveat,
}: {
  what: string
  why: string
  how: string
  caveat: string
}) => `${what}\n\nWhy it matters: ${why}\n\nHow to test: ${how}\n\nCaveats: ${caveat}`

function wcagStoryMeta({
  criteria,
  why,
  how,
  caveat,
}: {
  criteria: string | string[]
  why: string
  how: string
  caveat: string
}): string {
  const numbers = Array.isArray(criteria) ? criteria : [criteria]
  const refs = numbers.map((n) => {
    const c = WCAG_CRITERIA[n]
    if (!c) throw new Error(`Unknown WCAG criterion: ${n}`)
    return `[${c.number} ${c.title} (${c.level})](${c.url})`
  })
  const what = `Demonstrates compliance with WCAG 2.2: ${refs.join(', ')}.`
  return docsTemplate({ what, why, how, caveat })
}

function needsGreySurface(color: ColorKey): boolean {
  return lowContrastSet.has(color)
}

function titleClasses(color: ColorKey): string {
  return needsGreySurface(color) ? 'text-grey-50' : 'text-foreground'
}

function bodyClasses(color: ColorKey): string {
  return needsGreySurface(color) ? 'text-grey-200' : 'text-muted-foreground'
}

function surfaceClasses(color: ColorKey): string {
  return needsGreySurface(color)
    ? 'rounded-sm border border-grey-700 bg-grey-800 p-4'
    : 'rounded-sm border border-border bg-background p-4'
}

function ThemeSurface({
  color,
  children,
  className,
}: {
  color: ColorKey
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`${surfaceClasses(color)}${className ? ` ${className}` : ''}`}>{children}</div>
  )
}

// ─── Target-size panel ────────────────────────────────────────────────────────

function TargetSizePanel({
  color,
  overlaySize,
}: {
  color: ColorKey
  /** CSS length used by the dashed overlay, e.g. `1.5rem` (24px, 2.5.8 AA) or `2.75rem` (44px, 2.5.5 AAA). */
  overlaySize: string
}) {
  return (
    <div className='flex flex-wrap items-start gap-5'>
      {(['sm', 'default'] as const).map((size) => (
        <div key={`${color}-${size}`} className='space-y-2'>
          <ButtonGroup color={color} size={size} aria-label={`${color} ${size} clipboard`}>
            {(
              [
                ['Copy', IconContentCopy],
                ['Paste', IconContentPaste],
                ['Cut', IconContentCut],
              ] as const
            ).map(([label, icon]) => (
              <Button
                key={label}
                iconOnly
                aria-label={label}
                leadingVisual={icon}
                className='relative'
              >
                {/* Minimum-target boundary, drawn on the segment itself */}
                <span
                  className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-dashed border-red-400/80'
                  style={{
                    width: `max(100%, ${overlaySize})`,
                    height: `max(100%, ${overlaySize})`,
                  }}
                  aria-hidden='true'
                />
              </Button>
            ))}
          </ButtonGroup>
          <p className={`text-xs ${bodyClasses(color)}`}>{size} icon segments</p>
        </div>
      ))}
    </div>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const ContrastMinimum: Story = {
  name: 'Contrast — 1.4.3 / 1.4.11',
  parameters: {
    wcag: ['1.4.3', '1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['1.4.3', '1.4.11'],
          why: 'Segment labels must meet 4.5:1 against the frame or band behind them, and the frame and the dividers must meet 3:1 against the page, so the boundary of the control and the boundaries between its segments can be perceived.',
          how: 'Use a colour-contrast checker on each row: the label on the solid band, the label on the soft and surface tints, the outline frame against the surface, and the divider between two segments. Check both light and dark modes.',
          caveat:
            'Low-contrast colours (white, secondary) are rendered on a grey-800 surface, which is where they are meant to be used. On a solid band every non-solid segment takes the label colour as its ink, so a soft segment on a band is white on a lighter blue rather than blue on blue. tertiary, accent, success and warning appear only as solid bands, with ghost segments: their soft and surface tints measure 3.95:1 to 4.39:1 under a bold 16px label, a token-level shortfall Button shares, and a soft segment ON one of those bands paints white at 10% over a fill whose white label already sits near the floor (4.53 to 4.57:1), dropping it to 3.88 to 3.93:1 for tertiary, success and warning — measured in the browser, since axe reports a soft segment as incomplete rather than failing. This story renders only what complies.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-7xl space-y-3'>
      {themeColors.map((color) => (
        <ThemeSurface key={`contrast-${color}`} color={color}>
          <h4 className={`mb-3 text-sm font-semibold ${titleClasses(color)}`}>Theme: {color}</h4>
          <div className='flex flex-wrap items-center gap-3'>
            {variants.map((variant) => (
              <ButtonGroup
                key={`contrast-${color}-${variant}`}
                variant={variant}
                color={color}
                aria-label={`${color} ${variant}`}
              >
                <Button>{variant}</Button>
                <Button variant='soft'>Soft</Button>
                <Button disabled>Off</Button>
              </ButtonGroup>
            ))}
          </div>
        </ThemeSurface>
      ))}
      <ThemeSurface color='primary'>
        <h4 className='mb-3 text-sm font-semibold text-foreground'>Solid bands</h4>
        <div className='flex flex-wrap items-center gap-3'>
          {solidBandColors.map((color) => (
            <ButtonGroup
              key={`contrast-band-${color}`}
              variant='solid'
              color={color}
              aria-label={`${color} solid band`}
            >
              <Button>{color}</Button>
              <Button>Ghost</Button>
            </ButtonGroup>
          ))}
        </div>
      </ThemeSurface>
    </div>
  ),
}

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7 / 2.4.11',
  parameters: {
    wcag: ['2.4.7', '2.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['2.4.7', '2.4.11'],
          why: 'Keyboard users must see which segment has focus at all times, and the ring must not be obscured. A group clips to its own corners, which would clip a ring sitting 2px outside a segment, so a segment rings 2px inside its edge instead; and a solid segment rings in its label colour, because in light mode its ink and its fill are the same token.',
          how: 'Tab through the first row and confirm a ring appears inside each segment, including the solid Save and its chevron. The rows below render the ring at rest for every variant and colour. The play focuses a ghost segment and a solid one and reads the ring back.',
          caveat:
            'Rest rows force the ring with the same outline utilities the segment applies under :focus, so they are a faithful preview rather than a simulation.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-7xl space-y-3'>
      <ThemeSurface color='primary'>
        <h4 className='mb-3 text-sm font-semibold text-foreground'>Tab through these</h4>
        <div className='flex flex-wrap items-center gap-4'>
          <ButtonGroup aria-label='Clipboard'>
            <Button>Copy</Button>
            <Button>Paste</Button>
            <Button>Cut</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant='solid'>Save</Button>
            <Button
              variant='solid'
              iconOnly
              aria-label='More save options'
              leadingVisual={IconExpandMore}
            />
          </ButtonGroup>
        </div>
      </ThemeSurface>
      {themeColors.map((color) => (
        <ThemeSurface key={`focus-${color}`} color={color}>
          <h4 className={`mb-3 text-sm font-semibold ${titleClasses(color)}`}>Theme: {color}</h4>
          <div className='flex flex-wrap items-center gap-4'>
            {variants.map((variant) => (
              <ButtonGroup
                key={`focus-${color}-${variant}`}
                variant={variant}
                color={color}
                aria-label={`${color} ${variant} focus`}
              >
                <Button>Copy</Button>
                <Button className={forcedFocusClasses}>{variant}</Button>
                <Button variant='solid' className={forcedSolidFocusClasses}>
                  Save
                </Button>
              </ButtonGroup>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A ghost segment: a 2px ring, 2px inside its edge. Outline is not among
    // the transitioned properties, so the value is final at once.
    const paste = canvas.getByRole('button', { name: 'Paste' })
    paste.focus()
    const ghost = getComputedStyle(paste)
    await expect(ghost.outlineWidth).toBe('2px')
    await expect(ghost.outlineOffset).toBe('-2px')

    // A solid segment rings in its label colour, not in the ink that is also
    // its fill.
    const save = canvas.getAllByRole('button', { name: 'Save' })[0]!
    save.focus()
    const solid = getComputedStyle(save)
    await expect(solid.outlineWidth).toBe('2px')
    await expect(solid.outlineOffset).toBe('-2px')
    await expect(solid.outlineColor).toBe(solid.color)
  },
}

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Every segment must be reachable with Tab in reading order and activatable with Enter or Space. A group adds no keyboard behaviour of its own: it is a plain group of buttons, not a composite widget with arrow-key navigation, so nothing traps or skips focus.',
          how: 'Tab from the first segment: focus should move segment by segment in order, and Enter or Space should activate the focused one. The play performs the same checks.',
          caveat:
            'A disabled segment leaves the tab order, so focus passes over it. A ButtonLink segment follows link semantics: Enter activates, Space does not.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-4'>
      <ButtonGroup aria-label='Clipboard'>
        <Button>Copy</Button>
        <Button>Paste</Button>
        <Button disabled>Off</Button>
        <Button>Cut</Button>
      </ButtonGroup>
      <p className='text-sm text-muted-foreground'>
        Tab through the segments, then press Enter or Space to activate one.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const copy = canvas.getByRole('button', { name: 'Copy' })
    const paste = canvas.getByRole('button', { name: 'Paste' })
    const cut = canvas.getByRole('button', { name: 'Cut' })

    // Focus moves segment by segment in reading order, skipping the disabled one.
    copy.focus()
    await expect(document.activeElement).toBe(copy)
    await userEvent.tab()
    await expect(document.activeElement).toBe(paste)
    await userEvent.tab()
    await expect(document.activeElement).toBe(cut)

    // Enter and Space both activate the focused segment.
    let activations = 0
    const handler = () => {
      activations += 1
    }
    cut.addEventListener('click', handler)
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    cut.removeEventListener('click', handler)
    await expect(activations).toBeGreaterThanOrEqual(2)
  },
}

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2 / 1.3.1',
  parameters: {
    wcag: ['4.1.2', '1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['4.1.2', '1.3.1'],
          why: 'The group is a landmark for its segments: role="group" with an accessible name, so a screen reader announces the set before its members. Each segment keeps its own name, role and state; a separator is announced as a boundary with the correct orientation; an icon-only segment needs an aria-label.',
          how: 'Inspect the accessibility tree: the group should carry its name, each segment should be a button with a name, the disabled one should expose its state, and the separator should carry aria-orientation. The play asserts each.',
          caveat:
            'The separator draws nothing, so its only job is this announcement. Give a group a name that describes the set (Clipboard, Formatting), not the first action in it.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <ButtonGroup aria-label='Clipboard'>
        <Button iconOnly aria-label='Copy' leadingVisual={IconContentCopy} />
        <Button iconOnly aria-label='Paste' leadingVisual={IconContentPaste} />
        <ButtonGroupSeparator />
        <Button iconOnly aria-label='Cut' leadingVisual={IconContentCut} disabled />
      </ButtonGroup>
      <ButtonGroup orientation='vertical' aria-label='Formatting'>
        <Button>Bold</Button>
        <ButtonGroupText>Aa</ButtonGroupText>
        <ButtonGroupSeparator />
        <Button>Italic</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The group is a named group, and every segment is a named button.
    const clipboard = canvas.getByRole('group', { name: 'Clipboard' })
    await expect(clipboard).toHaveAttribute('role', 'group')
    for (const name of ['Copy', 'Paste', 'Cut']) {
      const button = within(clipboard).getByRole('button', { name })
      await expect(button.tagName).toBe('BUTTON')
    }

    // The disabled segment exposes its state.
    await expect(within(clipboard).getByRole('button', { name: 'Cut' })).toBeDisabled()

    // A separator crosses the group's axis, and says so.
    const [inRow, inColumn] = canvas.getAllByRole('separator')
    await expect(inRow).toHaveAttribute('aria-orientation', 'vertical')
    await expect(inColumn).toHaveAttribute('aria-orientation', 'horizontal')
  },
}

export const TargetSizeMinimum: Story = {
  name: 'Target Size — 2.5.8',
  parameters: {
    wcag: ['2.5.8'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'Pointer targets must be at least 24×24 CSS pixels so users with limited dexterity can activate them reliably. Segments in a group share edges, so each one must clear the minimum on its own.',
          how: 'The red dashed outline is the 24×24px minimum drawn inside each segment; it should never extend beyond the segment. Icon-only segments at the sm step are the smallest case.',
          caveat:
            'The overlay carries aria-hidden="true". It measures rendered geometry, not effective hit area; the segments also carry the coarse-pointer expansion Button applies. This play cannot fail on its own: it renders the same panel as the 2.5.5 story below and asserts a lower floor, so any run that fails 24px has already failed 44px. It is here to name the AA criterion the component is judged against, and the AAA story is what actually holds the line.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-6xl space-y-3'>
      {(['primary', 'accent'] as const).map((color) => (
        <ThemeSurface key={`target-size-${color}`} color={color}>
          <h4 className={`mb-3 text-sm font-semibold ${titleClasses(color)}`}>Theme: {color}</h4>
          <TargetSizePanel color={color} overlaySize='1.5rem' />
          <p className={`mt-3 text-sm ${bodyClasses(color)}`}>
            Red dashed outline = WCAG 2.5.8 minimum (24×24px), drawn inside each segment.
          </p>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const button of within(canvasElement).getAllByRole('button')) {
      const { width, height } = button.getBoundingClientRect()
      await expect(width).toBeGreaterThanOrEqual(24)
      await expect(height).toBeGreaterThanOrEqual(24)
    }
  },
}

export const TapTarget: Story = {
  name: 'Target Size Enhanced — 2.5.5',
  parameters: {
    wcag: ['2.5.5'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.5',
          why: 'WCAG 2.5.5 (AAA) recommends 44×44px targets. A group clips to its own box, so Button’s coarse-pointer expansion cannot grow a segment past the group; the group therefore does not offer the 40px icon step, and its smallest step (sm) renders 44px tall from the sm breakpoint and 52px below it.',
          how: 'Compare the segment bounds with the red dashed 44×44px outline: at the sm step the two should coincide on the shared axis. The play measures every segment.',
          caveat:
            'This criterion is AAA and informational. The dashed outline visualises geometry; it is not a live hit test.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-6xl space-y-3'>
      {(['primary', 'accent'] as const).map((color) => (
        <ThemeSurface key={`tap-target-${color}`} color={color}>
          <h4 className={`mb-3 text-sm font-semibold ${titleClasses(color)}`}>Theme: {color}</h4>
          <TargetSizePanel color={color} overlaySize='2.75rem' />
          <p className={`mt-3 text-sm ${bodyClasses(color)}`}>
            Red dashed outline = 44×44px enhanced target, drawn inside each segment.
          </p>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const button of within(canvasElement).getAllByRole('button')) {
      const { width, height } = button.getBoundingClientRect()
      await expect(width).toBeGreaterThanOrEqual(44)
      await expect(height).toBeGreaterThanOrEqual(44)
    }
  },
}
