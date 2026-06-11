/**
 * Badge — Accessibility
 *
 * WCAG 2.2 criterion-driven stories for the Badge and BadgeButton components.
 *
 * Stories are organised by applicable success criteria. Each story declares
 * the criteria it covers in `parameters.wcag` and uses `wcagStoryMeta` to
 * generate its description (so the criterion number, level, title, and W3C
 * link appear in the Docs panel automatically).
 *
 * The presentational Badge is exempt from interactive criteria (Keyboard,
 * Focus Visible, Target Size, Name/Role/Value). Those criteria are exercised
 * against the BadgeButton wrapper, which exposes a button (or link) role and
 * an expanded touch target.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent } from 'storybook/test'

import { Badge, BadgeButton, BadgeLink } from './badge.js'
import { Icons } from './icons.js'
import {
  ThemeSurface,
  bodyClasses,
  titleClasses,
  wcagStoryMeta,
} from './story-helpers.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const variants = ['solid', 'soft', 'surface', 'outline'] as const
const colors = [
  'primary/grey',
  'light',
  'primary/white',
  'white',
  'grey',
  'primary',
  'secondary',
  'tertiary',
  'accent',
] as const

type ColorKey = (typeof colors)[number]
type SizeKey = 'sm' | 'default' | 'lg'

const forcedFocusClasses =
  'outline outline-2 outline-offset-2 outline-primary-800'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Badge/Accessibility',
  component: Badge,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'New',
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBadgeButton(canvasElement: HTMLElement, label: string) {
  const candidates = Array.from(
    canvasElement.querySelectorAll<HTMLElement>('button, a')
  )
  const match = candidates.find(
    (el) =>
      el.textContent?.trim() === label ||
      el.getAttribute('aria-label') === label
  )

  if (!match) {
    throw new Error(`Could not find BadgeButton labelled "${label}".`)
  }

  return match
}

// ─── Target-size panel ───────────────────────────────────────────────────────

const sizePresets: ReadonlyArray<{
  id: string
  label: string
  size: SizeKey
  icon?: boolean
}> = [
  { id: 'sm', label: 'Small', size: 'sm' },
  { id: 'default', label: 'Default', size: 'default' },
  { id: 'lg', label: 'Large', size: 'lg' },
  { id: 'icon', label: 'Icon-only', size: 'default', icon: true },
]

function TargetSizePanel({
  color,
  overlaySize,
}: {
  color: ColorKey
  /** CSS length used by the dashed overlay, e.g. `1.5rem` (24px, 2.5.8 AA). */
  overlaySize: string
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-5">
        {sizePresets.map((item) => (
          <div key={`${color}-${item.id}`} className="space-y-2">
            <div className="relative inline-flex items-center justify-center">
              <BadgeButton
                color={color}
                size={item.size}
                aria-label={item.icon ? 'More options' : undefined}
              >
                {item.icon ? <Icons.more_horiz data-slot="icon" /> : item.label}
              </BadgeButton>

              {/* Visible bounds */}
              <span
                className="pointer-events-none absolute inset-0 rounded-sm border border-primary-500/70"
                aria-hidden="true"
              />

              {/* Minimum-target boundary */}
              <span
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-dashed border-red-400/80"
                style={{
                  width: `max(100%, ${overlaySize})`,
                  height: `max(100%, ${overlaySize})`,
                }}
                aria-hidden="true"
              />
            </div>
            <p className={`text-xs ${bodyClasses(color)}`}>
              {item.id.replaceAll('-', ' ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Contrast: Story = {
  name: 'Contrast — 1.4.3 / 1.4.11',
  parameters: {
    wcag: ['1.4.3', '1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['1.4.3', '1.4.11'],
          why: 'Badge labels and visible boundaries must meet minimum contrast ratios (4.5:1 for text, 3:1 for UI component boundaries) so users with low vision can perceive them.',
          how: 'Use a colour-contrast checker (e.g. Chrome DevTools) on each rendered state. Verify text on the solid variant and the boundary of the outline/surface variants pass against the surrounding background, in both light and dark mode.',
          caveat:
            'Contrast values depend on the active theme; check both light and dark modes. Low-contrast colours (white, secondary) are rendered on a grey-800 surface to model how they are intended to be used.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-3">
      {colors.map((color: ColorKey) => (
        <ThemeSurface key={`contrast-${color}`} color={color}>
          <h4 className={`mb-3 text-sm font-semibold ${titleClasses(color)}`}>
            Colour: {color}
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            {variants.map((variant) => (
              <Badge
                key={`contrast-${color}-${variant}`}
                variant={variant}
                color={color}
              >
                {variant}
              </Badge>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const UseOfColour: Story = {
  name: 'Use of Colour — 1.4.1',
  parameters: {
    wcag: ['1.4.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.1',
          why: 'Badge meaning must not be conveyed by colour alone. Users with colour-vision differences (and users on monochrome displays) must be able to identify a badge’s status from its visible text label as well as its colour.',
          how: 'Compare each badge in the row. Each conveys its status (Live, Beta, Deprecated, Updated, New) through both the visible text label AND its colour — never one without the other. Toggling the page to greyscale should not change the meaning that can be perceived.',
          caveat:
            'When a badge is used as a count indicator (e.g. "3"), the number itself is the label. Avoid badges that consist only of a coloured dot with no text.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">
          Status communicated by label + colour (not colour alone)
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <Badge color="accent">Live</Badge>
          <Badge color="secondary">Beta</Badge>
          <Badge color="grey">Deprecated</Badge>
          <Badge color="tertiary">Updated</Badge>
          <Badge color="primary">New</Badge>
        </div>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">
          Count badges — the number is the label
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <Badge color="primary">3</Badge>
          <Badge color="accent">12</Badge>
          <Badge color="grey">99+</Badge>
        </div>
      </section>
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
          why: 'Keyboard users must see which BadgeButton has focus at all times, and the focus indicator must not be entirely obscured by other content.',
          how: 'Tab through each cell and verify the focus ring is visible and not clipped by overflow or surrounding elements. Each cell below renders the focus outline at rest so the indicator can be reviewed without tabbing.',
          caveat:
            'Focus is forced via the same outline utility classes the component applies under :focus, so this is a faithful preview rather than a simulation. The presentational Badge is not focusable; only BadgeButton receives focus.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-3">
      {colors.map((color: ColorKey) => (
        <ThemeSurface key={`focus-${color}`} color={color}>
          <h4 className={`mb-3 text-sm font-semibold ${titleClasses(color)}`}>
            Colour: {color}
          </h4>
          <div className="flex flex-wrap items-center gap-4">
            {variants.map((variant) => (
              <BadgeButton
                key={`focus-${color}-${variant}`}
                variant={variant}
                color={color}
                className={forcedFocusClasses}
              >
                {variant}
              </BadgeButton>
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
          why: 'All BadgeButton functionality must be operable through a keyboard interface — Tab to reach, Enter or Space to activate.',
          how: 'Tab onto the BadgeButton and press Enter then Space; both should fire the click handler. The play() function below performs the same checks programmatically.',
          caveat:
            'This story tests the native button keyboard contract. A BadgeButton rendered with href (anchor) follows link semantics: Enter activates, Space does not.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <BadgeButton>Press me</BadgeButton>
      <p className="text-sm text-muted-foreground">
        Tab to focus, then press Enter or Space to activate.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badge = getBadgeButton(canvasElement, 'Press me')

    if (badge.tabIndex < 0) {
      throw new Error(
        `BadgeButton is not keyboard reachable: tabIndex=${badge.tabIndex}.`
      )
    }

    badge.focus()
    if (document.activeElement !== badge) {
      throw new Error('BadgeButton did not receive focus after .focus().')
    }

    let activations = 0
    const handler = () => {
      activations += 1
    }
    badge.addEventListener('click', handler)

    // userEvent.keyboard() simulates real keyboard input: pressing Enter or
    // Space on a focused native <button> fires the click event via the
    // browser's own activation behaviour, so we're actually testing the
    // keyboard → click pipeline rather than calling .click() ourselves.
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')

    badge.removeEventListener('click', handler)

    if (activations < 2) {
      throw new Error(
        `Expected at least 2 keyboard activations, observed ${activations}.`
      )
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
          why: 'The accessible name of a BadgeButton must contain its visible text so speech-input users can activate it by saying what they see.',
          how: 'Inspect each BadgeButton: the visible text label should be part of (or equal to) its accessible name. For icon-only BadgeButtons, the aria-label should describe the visible action.',
          caveat:
            'Icon-only BadgeButtons have no visible text — they rely entirely on aria-label. Choose aria-label values that match the spoken description a user would associate with the icon.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">
          Text labels (accessible name = visible label)
        </h4>
        <div className="flex flex-wrap gap-3">
          <BadgeButton color="primary">New</BadgeButton>
          <BadgeButton color="accent">Live</BadgeButton>
          <BadgeButton color="grey">Archived</BadgeButton>
        </div>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">
          Icon-only (accessible name supplied via aria-label)
        </h4>
        <div className="flex flex-wrap gap-3">
          <BadgeButton color="primary" aria-label="More options">
            <Icons.more_horiz data-slot="icon" />
          </BadgeButton>
          <BadgeButton color="accent" aria-label="Dismiss notification">
            <Icons.close data-slot="icon" />
          </BadgeButton>
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const live = getBadgeButton(canvasElement, 'Live')
    if (
      live.getAttribute('aria-label') &&
      !live.getAttribute('aria-label')!.toLowerCase().includes('live')
    ) {
      throw new Error(
        'aria-label on "Live" BadgeButton does not contain the visible label text.'
      )
    }

    const iconBadge = getBadgeButton(canvasElement, 'More options')
    const label = iconBadge.getAttribute('aria-label')
    if (!label || label.trim().length === 0) {
      throw new Error('Icon-only BadgeButton is missing an aria-label.')
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
          why: 'Pointer targets must be at least 24×24 CSS pixels so users with limited dexterity can activate them reliably. Badges are visually small, so the BadgeButton wrapper expands the hit area to meet this minimum.',
          how: 'Compare the blue solid outline (the rendered control bounds) with the red dashed outline (the 24×24px minimum). The dashed outline should never extend beyond the blue outline for any size variant; if it does, the control is below the WCAG 2.5.8 minimum.',
          caveat:
            'Overlays carry aria-hidden="true" so they are not exposed to assistive tech. This story measures rendered geometry, not effective hit area — BadgeButton also applies a coarse-pointer expansion via TouchTarget for additional safety on touch devices.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-6xl space-y-3">
      {(['primary', 'accent'] as const).map((color) => (
        <ThemeSurface key={`target-size-${color}`} color={color}>
          <h4 className={`mb-3 text-sm font-semibold ${titleClasses(color)}`}>
            Colour: {color}
          </h4>
          <TargetSizePanel color={color} overlaySize="1.5rem" />
          <p className={`mt-3 text-sm ${bodyClasses(color)}`}>
            Blue solid outline = rendered bounds. Red dashed outline = WCAG
            2.5.8 minimum (24×24px).
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
          why: 'Assistive tech must be able to programmatically determine each interactive control’s name, role, and state. BadgeButton exposes role="button" when rendered as a button, or role="link" when an href is supplied; the presentational Badge has no role and is not announced as an interactive element.',
          how: 'Inspect each control with the browser accessibility tree (e.g. Chrome DevTools → Accessibility tab). The play() function below asserts that the text BadgeButton renders as <button> and the href-bearing BadgeButton renders as <a>.',
          caveat:
            'Native <button> and <a> elements have implicit roles — no explicit role attribute is required. The presentational Badge is intentionally a <span> with no role so it is not announced as a control.',
        }),
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <BadgeButton color="primary">Activate</BadgeButton>
      <BadgeLink color="accent" href="#">
        Go to link
      </BadgeLink>
      <BadgeButton color="grey" aria-label="More options">
        <Icons.more_horiz data-slot="icon" />
      </BadgeButton>
      <Badge color="primary">Static badge</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const button = getBadgeButton(canvasElement, 'Activate')
    if (button.tagName !== 'BUTTON') {
      throw new Error(
        `Text BadgeButton should render as <button>, got <${button.tagName.toLowerCase()}>.`
      )
    }

    const link = getBadgeButton(canvasElement, 'Go to link')
    if (link.tagName !== 'A') {
      throw new Error(
        `href-bearing BadgeButton should render as <a>, got <${link.tagName.toLowerCase()}>.`
      )
    }

    const accessibleName =
      button.getAttribute('aria-label') || button.textContent?.trim() || ''
    if (accessibleName.length === 0) {
      throw new Error('BadgeButton has no accessible name.')
    }

    const icon = getBadgeButton(canvasElement, 'More options')
    const iconName = icon.getAttribute('aria-label')
    if (!iconName || iconName.trim().length === 0) {
      throw new Error('Icon-only BadgeButton is missing an aria-label.')
    }
  },
}
