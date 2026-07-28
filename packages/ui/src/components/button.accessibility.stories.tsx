/**
 * Button — Accessibility
 *
 * WCAG 2.2 criterion-driven stories for the Button component.
 *
 * Stories are organised by applicable success criteria. Each story declares
 * the criteria it covers in `parameters.wcag` and uses `wcagStoryMeta` to
 * generate its description (so the criterion number, level, title, and W3C
 * link appear in the Docs panel automatically).
 *
 * NOTE: the helper functions (`docsTemplate`, `WCAG_CRITERIA`, `wcagStoryMeta`,
 * `ThemeSurface`) are inlined here because the shared `story-helpers.tsx`
 * module described in `.kiro/specs/storybook-story-standards` has not yet
 * been extracted. When it lands, replace the inlined copies with imports.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { userEvent } from 'storybook/test'

import { IconAdd, IconClose, IconMoreHoriz, IconSearch } from '../icons/index.js'
import { Button } from './button.js'

// ─── Constants ────────────────────────────────────────────────────────────────

type VariantKey = 'solid' | 'soft' | 'surface' | 'outline' | 'ghost' | 'link'
type SizeKey = 'sm' | 'default' | 'lg' | 'icon'
type ColorKey = 'white' | 'grey' | 'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger'

const lowContrastColors = ['white', 'secondary'] as const
const lowContrastSet = new Set<ColorKey>(lowContrastColors)

const themeColors: readonly ColorKey[] = [
  'white',
  'grey',
  'primary',
  'secondary',
  'tertiary',
  'accent',
  'danger',
]

const forcedFocusClasses = 'outline outline-2 outline-offset-2 outline-(--btn-bg)'

// ─── WCAG criteria map ────────────────────────────────────────────────────────

interface WcagCriterion {
  number: string
  level: 'A' | 'AA' | 'AAA'
  title: string
  url: string
}

const WCAG_CRITERIA: Record<string, WcagCriterion> = {
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
  '2.5.3': {
    number: '2.5.3',
    level: 'A',
    title: 'Label in Name',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/label-in-name',
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
  title: 'Components/Button/Accessibility',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Next',
  },
} satisfies Meta<typeof Button>

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

function getButton(canvasElement: HTMLElement, name: string) {
  const button = Array.from(canvasElement.querySelectorAll('button')).find(
    (el) => el.textContent === name || el.getAttribute('aria-label') === name,
  )

  if (!button) throw new Error(`Could not find button named "${name}".`)

  return button
}

// ─── Target-size panels ───────────────────────────────────────────────────────

const sizeVariants: ReadonlyArray<{
  id: string
  label: string
  variant: VariantKey
  size: SizeKey
  icon?: boolean
}> = [
  { id: 'small-solid', label: 'Small', variant: 'solid', size: 'sm' },
  {
    id: 'small-outline',
    label: 'Small outline',
    variant: 'outline',
    size: 'sm',
  },
  {
    id: 'default-solid',
    label: 'Default',
    variant: 'solid',
    size: 'default',
  },
  {
    id: 'icon-ghost',
    label: 'Icon',
    variant: 'ghost',
    size: 'icon',
    icon: true,
  },
]

function TargetSizePanel({
  color,
  overlaySize,
  compact = false,
}: {
  color: ColorKey
  /** CSS length used by the dashed overlay, e.g. `1.5rem` (24px, 2.5.8 AA) or `2.75rem` (44px, 2.5.5 AAA). */
  overlaySize: string
  compact?: boolean
}) {
  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <div className='flex flex-wrap items-start gap-5'>
        {sizeVariants.map((item) => (
          <div key={`${color}-${item.id}`} className='space-y-2'>
            <div className='relative inline-flex items-center justify-center'>
              <Button
                variant={item.variant}
                color={color}
                size={item.size}
                aria-label={item.icon ? 'More options' : undefined}
              >
                {item.icon ? <IconMoreHoriz data-slot='icon' /> : item.label}
              </Button>

              {/* Visible bounds */}
              <span
                className='pointer-events-none absolute inset-0 rounded-sm border border-primary-500/70'
                aria-hidden='true'
              />

              {/* Minimum-target boundary */}
              <span
                className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-dashed border-red-400/80'
                style={{
                  width: `max(100%, ${overlaySize})`,
                  height: `max(100%, ${overlaySize})`,
                }}
                aria-hidden='true'
              />
            </div>
            <p className={`text-xs ${bodyClasses(color)}`}>{item.id.replaceAll('-', ' ')}</p>
          </div>
        ))}
      </div>
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
          why: 'Button labels and visible boundaries must meet minimum contrast ratios (4.5:1 for text, 3:1 for UI component boundaries) so users with low vision can perceive them.',
          how: 'Use a colour-contrast checker (e.g. Chrome DevTools) on each rendered state. Verify text on the solid variant and the boundary of the outline/surface variants pass against the surrounding background.',
          caveat:
            'Contrast values depend on the active theme; check both light and dark modes. Low-contrast brand colours (white, secondary) are rendered on a grey-800 surface to model how they are intended to be used.',
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
            <Button variant='solid' color={color}>
              Solid
            </Button>
            <Button variant='soft' color={color}>
              Soft
            </Button>
            <Button variant='surface' color={color}>
              Surface
            </Button>
            <Button variant='outline' color={color}>
              Outline
            </Button>
            <Button variant='ghost' color={color}>
              Ghost
            </Button>
            <Button variant='solid' color={color} disabled>
              Disabled
            </Button>
          </div>
        </ThemeSurface>
      ))}
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
          why: 'Keyboard users must see which element has focus at all times, and the focus indicator must not be entirely obscured by other content.',
          how: 'Tab through each cell and verify the focus ring is visible and not clipped by overflow or surrounding elements. Each cell below renders the focus outline at rest so the indicator can be reviewed without tabbing.',
          caveat:
            'Focus is forced via the same outline utility classes the component applies under :focus, so this is a faithful preview rather than a simulation.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-7xl space-y-3'>
      {themeColors.map((color) => (
        <ThemeSurface key={`focus-${color}`} color={color}>
          <h4 className={`mb-3 text-sm font-semibold ${titleClasses(color)}`}>Theme: {color}</h4>
          <div className='flex flex-wrap items-center gap-4'>
            {(['solid', 'soft', 'outline', 'ghost'] as const).map((variant) => (
              <Button
                key={`focus-${color}-${variant}`}
                variant={variant}
                color={color}
                className={forcedFocusClasses}
              >
                {variant}
              </Button>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'All button functionality must be operable through a keyboard interface — Tab to reach, Enter or Space to activate.',
          how: 'Tab onto the button and press Enter then Space; both should fire the click handler. The play() function below performs the same checks programmatically.',
          caveat:
            'This story tests the native HTML button keyboard contract. Components rendered as anchors (href present) follow link semantics: Enter activates, Space does not.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-4'>
      <Button>Press me</Button>
      <p className='text-sm text-muted-foreground'>
        Tab to focus, then press Enter or Space to activate.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const button = getButton(canvasElement, 'Press me')

    if (button.tabIndex < 0) {
      throw new Error(`Button is not keyboard reachable: tabIndex=${button.tabIndex}.`)
    }

    button.focus()
    if (document.activeElement !== button) {
      throw new Error('Button did not receive focus after .focus().')
    }

    let activations = 0
    const handler = () => {
      activations += 1
    }
    button.addEventListener('click', handler)

    // userEvent.keyboard() simulates real keyboard input: pressing Enter or
    // Space on a focused native <button> fires the click event via the
    // browser's own activation behaviour, so we're actually testing the
    // keyboard → click pipeline rather than calling .click() ourselves.
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')

    button.removeEventListener('click', handler)

    if (activations < 2) {
      throw new Error(`Expected at least 2 keyboard activations, observed ${activations}.`)
    }
  },
}

export const LabelInName: Story = {
  name: 'Label in Name — 2.5.3',
  parameters: {
    wcag: ['2.5.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.3',
          why: 'The accessible name of a button must contain its visible text so speech-input users can activate it by saying what they see.',
          how: 'Inspect each button: the visible text label should be part of (or equal to) its accessible name. For icon-only buttons, the aria-label should describe the visible action.',
          caveat:
            'Icon-only buttons have no visible text — they rely entirely on aria-label. Choose aria-label values that match the spoken description a user would associate with the icon.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-6'>
      <section className='space-y-2'>
        <h4 className='text-sm font-semibold text-foreground'>
          Text labels (accessible name = visible label)
        </h4>
        <div className='flex flex-wrap gap-3'>
          <Button>Save</Button>
          <Button variant='outline'>Cancel</Button>
          <Button variant='link'>Learn more</Button>
        </div>
      </section>

      <section className='space-y-2'>
        <h4 className='text-sm font-semibold text-foreground'>
          Icon-only (accessible name supplied via aria-label)
        </h4>
        <div className='flex flex-wrap gap-3'>
          <Button size='icon' variant='ghost' aria-label='More options'>
            <IconMoreHoriz data-slot='icon' />
          </Button>
          <Button size='icon' variant='outline' aria-label='Add item'>
            <IconAdd data-slot='icon' />
          </Button>
          <Button size='icon' variant='solid' aria-label='Search'>
            <IconSearch data-slot='icon' />
          </Button>
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const save = getButton(canvasElement, 'Save')
    if (
      save.getAttribute('aria-label') &&
      !save.getAttribute('aria-label')!.toLowerCase().includes('save')
    ) {
      throw new Error('aria-label on "Save" button does not contain the visible label text.')
    }

    const iconButton = getButton(canvasElement, 'More options')
    const label = iconButton.getAttribute('aria-label')
    if (!label || label.trim().length === 0) {
      throw new Error('Icon-only button is missing an aria-label.')
    }
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
          why: 'Pointer targets must be at least 24×24 CSS pixels so users with limited dexterity can activate them reliably.',
          how: 'Compare the blue solid outline (the rendered control bounds) with the red dashed outline (the 24×24px minimum). The dashed outline should never extend beyond the blue outline for any size variant; if it does, the control is below the WCAG 2.5.8 minimum.',
          caveat:
            'Overlays carry aria-hidden="true" so they are not exposed to assistive tech. This story measures rendered geometry, not effective hit area — the component also applies a coarse-pointer expansion via TouchTarget for additional safety.',
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
            Blue solid outline = rendered bounds. Red dashed outline = WCAG 2.5.8 minimum (24×24px).
          </p>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const TapTarget: Story = {
  name: 'Target Size Enhanced — 2.5.5',
  parameters: {
    wcag: ['2.5.5'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.5',
          why: 'WCAG 2.5.5 (AAA) recommends 44×44px targets — larger than the 2.5.8 AA minimum — to make controls easier to acquire on touch devices and for users with motor impairments.',
          how: 'Compare blue (rendered bounds) vs red dashed (expanded 44×44px geometry). The Button component already expands its hit area to 44×44px via the TouchTarget element on coarse-pointer devices.',
          caveat:
            'This criterion is AAA and informational rather than required. The dashed outline visualises the CSS hit-area geometry (max(100%, 44px)); it is not a live DOM hit test.',
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
            Blue solid outline = visible bounds. Red dashed outline = expanded 44×44px touch target
            geometry applied on coarse-pointer devices.
          </p>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'Assistive tech must be able to programmatically determine each control’s name, role, and state. For a button: role="button", a non-empty accessible name, and a correct disabled state.',
          how: 'Inspect each button with the browser accessibility tree (e.g. Chrome DevTools → Accessibility tab). The play() function below asserts role and name programmatically.',
          caveat:
            'Native <button> elements have an implicit role of "button" — no role attribute is required. Disabled buttons expose disabled state via the disabled property (and data-disabled for styling).',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <Button>Submit</Button>
      <Button variant='outline' disabled>
        Disabled
      </Button>
      <Button size='icon' variant='ghost' aria-label='Close'>
        <IconClose data-slot='icon' />
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const submit = getButton(canvasElement, 'Submit')
    if (submit.tagName !== 'BUTTON') {
      throw new Error(
        `Submit button should render as <button>, got <${submit.tagName.toLowerCase()}>.`,
      )
    }

    const accessibleName = submit.getAttribute('aria-label') || submit.textContent?.trim() || ''
    if (accessibleName.length === 0) {
      throw new Error('Submit button has no accessible name.')
    }

    const disabled = getButton(canvasElement, 'Disabled')
    if (!disabled.hasAttribute('disabled')) {
      throw new Error('Disabled button does not expose the disabled state to assistive tech.')
    }

    const icon = getButton(canvasElement, 'Close')
    const iconName = icon.getAttribute('aria-label')
    if (!iconName || iconName.trim().length === 0) {
      throw new Error('Icon-only button is missing an aria-label.')
    }
  },
}
