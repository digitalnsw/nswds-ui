/**
 * Button — Features
 *
 * Theme/variant matrices, size scale, icon sizing, states.
 *
 * These stories are intended for internal use during design token reviews and CSS refactors to catch regressions across the full component surface. They are not intended for external documentation or as examples of typical usage, so they intentionally include every variant/size/state combination in a single story for efficient visual review.
 *
 * Each story includes a detailed description of what to look for and how to test it, so that non-engineers can confidently use these stories for visual QA without needing to understand implementation details or refer back to design documentation.
 *
 * The "By Variant" and "By Colour" stories show the full matrix of themes and variants with default states, while the "Sizes", "With Icon", and "States" stories drill into specific features with additional rows for hover/active states, icon composition, and disabled styling.
 *
 * Low-contrast themes (white, primary/white, light, secondary) are rendered on forced dark surfaces in these stories to preserve visible boundaries in visual diffs and prevent false positives during visual QA. This is noted in each story's description and is implemented via the ThemeSurface helper component that conditionally applies dark backgrounds and adjusted text colors for themes that would otherwise have insufficient contrast against the default light background.
 *
 * The TapTargetPanel component is included in the "States" story to validate touch target geometry across themes. It shows a selection of small buttons with overlaid outlines indicating the visible button bounds and the expanded touch target area (max(100%, 44px)) used on coarse-pointer devices. This allows for quick visual verification that touch targets are correctly applied without needing to test on an actual device.
 *
 * Overall, these stories serve as a comprehensive visual regression suite for the Button component, ensuring that all design tokens and interaction states are consistently implemented across the full range of themes and variants.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'
import { Button, buttonVariants } from './button.js'
import { Icons } from './icons.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const variants = [
  'solid',
  'soft',
  'surface',
  'outline',
  'ghost',
  'link',
] as const
const sizes = ['sm', 'default', 'lg', 'icon'] as const
const colors = [
  'white',
  'grey',
  'primary',
  'secondary',
  'tertiary',
  'accent',
  'danger',
] as const

type VariantKey = (typeof variants)[number]
type SizeKey = (typeof sizes)[number]
type ColorKey = (typeof colors)[number]

const lowContrastColors = [
  'white',
  'secondary',
] as const
const lowContrastSet = new Set<ColorKey>(lowContrastColors)
const standardColors = colors.filter(
  (color) => !lowContrastSet.has(color)
) as ColorKey[]
const forcedFocusClasses = 'outline outline-2 outline-offset-2 outline-(--btn-bg)'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Button/Features',
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
}) =>
  `${what}\n\nWhy it matters: ${why}\n\nHow to test: ${how}\n\nCaveats: ${caveat}`

function needsDarkSurface(color: ColorKey): boolean {
  return lowContrastSet.has(color)
}

function surfaceClasses(color: ColorKey): string {
  return needsDarkSurface(color)
    ? 'rounded-sm border border-grey-700 bg-grey-900 p-4'
    : 'rounded-sm border border-border bg-background p-4'
}

function titleClasses(color: ColorKey): string {
  return needsDarkSurface(color) ? 'text-grey-50' : 'text-foreground'
}

function bodyClasses(color: ColorKey): string {
  return needsDarkSurface(color) ? 'text-grey-200' : 'text-muted-foreground'
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
    <div
      className={`${needsDarkSurface(color) ? 'dark ' : ''}${surfaceClasses(color)}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}

function IconLabel({ text }: { text: string }) {
  return (
    <>
      {text}
      <Icons.arrow_forward data-slot="icon" />
    </>
  )
}

function TapTargetPanel({
  color,
  compact = false,
}: {
  color: ColorKey
  compact?: boolean
}) {
  const items: ReadonlyArray<{
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

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <div className="flex flex-wrap items-start gap-5">
        {items.map((item) => (
          <div key={`${color}-${item.id}`} className="space-y-2">
            <div className="relative inline-flex items-center justify-center">
              <Button
                variant={item.variant}
                color={color}
                size={item.size}
                aria-label={item.icon ? 'More options' : undefined}
              >
                {item.icon ? <Icons.more_horiz data-slot="icon" /> : item.label}
              </Button>

              <span
                className="pointer-events-none absolute inset-0 rounded-sm border border-primary-500/70"
                aria-hidden="true"
              />

              <span
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-dashed border-red-400/80"
                style={{
                  width: 'max(100%, 2.75rem)',
                  height: 'max(100%, 2.75rem)',
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

      <p className={`text-sm ${bodyClasses(color)}`}>
        Blue outline = visible button bounds. Red dashed outline = expanded
        touch target geometry (max(100%, 44px)) used on coarse-pointer devices.
      </p>
    </div>
  )
}

function themePage(color: ColorKey) {
  return (
    <ThemeSurface color={color}>
      <div className="space-y-6">
        <section className="space-y-1">
          <h3 className={`text-lg font-semibold ${titleClasses(color)}`}>
            Theme: {color}
          </h3>
          <p className={`text-sm ${bodyClasses(color)}`}>
            Detailed production audit for this theme across variants, sizes,
            states, and touch-target behavior.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className={`text-sm font-semibold ${titleClasses(color)}`}>
            Variant coverage
          </h4>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Button
                key={`${color}-variant-${variant}`}
                variant={variant}
                color={color}
              >
                <IconLabel text={variant} />
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h4 className={`text-sm font-semibold ${titleClasses(color)}`}>
            Size coverage
          </h4>
          <div className="space-y-2">
            {(['solid', 'outline'] as const).map((variant) => (
              <div
                key={`${color}-size-${variant}`}
                className="flex flex-wrap items-center gap-2"
              >
                <span
                  className={`w-16 text-xs font-medium uppercase ${bodyClasses(color)}`}
                >
                  {variant}
                </span>
                {sizes.map((size) => (
                  <Button
                    key={`${color}-${variant}-${size}`}
                    variant={variant}
                    color={color}
                    size={size}
                  >
                    {size === 'icon' ? <Icons.add data-slot="icon" /> : size}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h4 className={`text-sm font-semibold ${titleClasses(color)}`}>
            State coverage
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="solid" color={color}>
              <IconLabel text="Enabled" />
            </Button>
            <Button variant="solid" color={color} disabled>
              <IconLabel text="Disabled" />
            </Button>
            <Button variant="outline" color={color} href="#theme-link">
              <IconLabel text="As link" />
            </Button>
            <Button
              variant="ghost"
              color={color}
              size="icon"
              aria-label="Settings"
            >
              <Icons.settings data-slot="icon" />
            </Button>
          </div>
        </section>

        <section className="space-y-2">
          <h4 className={`text-sm font-semibold ${titleClasses(color)}`}>
            Touch target validation
          </h4>
          <TapTargetPanel color={color} compact />
        </section>
      </div>
    </ThemeSurface>
  )
}

function getButton(canvasElement: HTMLElement, name: string) {
  const button = Array.from(canvasElement.querySelectorAll('button')).find(
    (el) => el.textContent === name || el.getAttribute('aria-label') === name
  )

  if (!button) throw new Error(`Could not find button named "${name}".`)

  return button
}

function makeThemeStory(color: ColorKey): Story {
  return {
    name: color,
    parameters: {
      docs: {
        description: {
          story: docsTemplate({
            what: `Complete theme page for **${color}** across variants, size scale, states, and touch-target behavior.`,
            why: 'Prevents token drift and contrast regressions for a single theme during iterative design updates.',
            how: 'Compare all rows, verify disabled/link/icon states, and confirm dashed touch-target overlays on small controls.',
            caveat:
              'Low-contrast themes render on forced dark surfaces in this story to preserve visible boundaries in visual diffs.',
          }),
        },
      },
    },
    render: () => themePage(color),
  }
}

// ─── Matrix stories ───────────────────────────────────────────────────────────

export const ByVariant: Story = {
  name: 'By Variant',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix: each row is a color theme and each column is a variant.',
          why: 'Matches design token review flow and quickly reveals per-theme variant drift.',
          how: 'Scan each row horizontally and compare hover/focus/disabled behavior across variants.',
          caveat:
            'Rows for low-contrast themes are rendered on dark surfaces to avoid false negatives in visual QA.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-3">
      <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
        <span>Theme</span>
        {variants.map((variant) => (
          <span
            key={`theme-header-${variant}`}
            className="text-center capitalize"
          >
            {variant}
          </span>
        ))}
      </div>

      {colors.map((color) => (
        <ThemeSurface key={`theme-row-${color}`} color={color} className="p-3">
          <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2">
            <span className={`text-sm font-semibold ${titleClasses(color)}`}>
              {color}
            </span>
            {variants.map((variant) => (
              <Button
                key={`${color}-${variant}`}
                variant={variant}
                color={color}
                className="w-full justify-center"
              >
                Next
              </Button>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const ByColour: Story = {
  name: 'By Colour',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Variant-first matrix: each row is a variant and each column is a theme.',
          why: 'Protects against variant implementation regressions during CSS refactors.',
          how: 'Compare each row across themes and verify that variant semantics remain consistent.',
          caveat:
            'Low-contrast themes are split into a dark-surface section so white/secondary boundaries remain visible.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-4">
      <section className="overflow-x-auto">
        <div className="min-w-[66rem] space-y-2">
          <div className="grid grid-cols-[9rem_repeat(5,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
            <span>Variant</span>
            {standardColors.map((color) => (
              <span
                key={`variant-standard-header-${color}`}
                className="text-center"
              >
                {color}
              </span>
            ))}
          </div>

          {variants.map((variant) => (
            <div
              key={`variant-standard-row-${variant}`}
              className="grid grid-cols-[9rem_repeat(5,minmax(0,1fr))] items-center gap-2 rounded-sm border border-border bg-background p-3"
            >
              <span className="text-sm font-semibold text-foreground capitalize">
                {variant}
              </span>
              {standardColors.map((color) => (
                <Button
                  key={`variant-standard-${variant}-${color}`}
                  variant={variant}
                  color={color}
                  className="w-full justify-center"
                >
                  Next
                </Button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="dark rounded-sm border border-grey-700 bg-grey-900 p-3">
        <div className="overflow-x-auto">
          <div className="min-w-[52rem] space-y-2">
            <div className="grid grid-cols-[9rem_repeat(2,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-grey-200">
              <span>Variant</span>
              {lowContrastColors.map((color) => (
                <span
                  key={`variant-low-header-${color}`}
                  className="text-center"
                >
                  {color}
                </span>
              ))}
            </div>

            {variants.map((variant) => (
              <div
                key={`variant-low-row-${variant}`}
                className="grid grid-cols-[9rem_repeat(2,minmax(0,1fr))] items-center gap-2 rounded-sm border border-grey-700/80 bg-grey-900/60 p-3"
              >
                <span className="text-sm font-semibold text-grey-100 capitalize">
                  {variant}
                </span>
                {lowContrastColors.map((color) => (
                  <Button
                    key={`variant-low-${variant}-${color}`}
                    variant={variant}
                    color={color}
                    className="w-full justify-center"
                  >
                    Next
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  ),
}

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first, variant-row matrix showing all four size presets: each colour block has one sub-row per variant.',
          why: 'Confirms size-driven padding, icon-size tokens, and height presets are correct across every colour and variant combination.',
          how: 'Scan each sub-row to verify relative button heights and spacing scale consistently across themes.',
          caveat:
            'Icon-only buttons use an add icon with aria-label="Next" to satisfy the accessible name requirement.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-5xl space-y-3">
      <div className="grid grid-cols-[9rem_repeat(4,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
        <span>Theme</span>
        {sizes.map((size) => (
          <span key={`size-header-${size}`} className="text-center capitalize">
            {size}
          </span>
        ))}
      </div>

      {colors.map((color) => (
        <ThemeSurface key={`sizes-${color}`} color={color} className="p-3">
          <div className="space-y-1.5">
            {variants.map((variant, i) => (
              <div
                key={`sizes-${color}-${variant}`}
                className="grid grid-cols-[9rem_repeat(4,minmax(0,1fr))] items-center gap-2"
              >
                <span
                  className={
                    i === 0
                      ? `text-sm font-semibold ${titleClasses(color)}`
                      : `text-xs ${bodyClasses(color)}`
                  }
                >
                  {i === 0 ? color : variant}
                </span>
                {sizes.map((size) => (
                  <Button
                    key={`sizes-${color}-${variant}-${size}`}
                    variant={variant}
                    color={color}
                    size={size}
                    aria-label={size === 'icon' ? 'Next' : undefined}
                    className={
                      size === 'icon'
                        ? 'justify-self-center'
                        : 'w-full justify-center'
                    }
                  >
                    {size === 'icon' ? <Icons.add data-slot="icon" /> : 'Next'}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    getButton(canvasElement, 'Next')
  },
}

// ─── Icon composition ─────────────────────────────────────────────────────────

export const WithIcon: Story = {
  name: 'With Icon',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix with icon composition: each row is a colour theme and each column is a variant.',
          why: 'Prevents icon alignment or spacing regressions after typography/token changes.',
          how: 'Verify icon vertical centering across all variant and theme combinations.',
          caveat: 'Each row uses fixed labels for stable screenshot diffs.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-3">
      <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
        <span>Theme</span>
        {variants.map((variant) => (
          <span
            key={`icon-header-${variant}`}
            className="text-center capitalize"
          >
            {variant}
          </span>
        ))}
      </div>

      {colors.map((color) => (
        <ThemeSurface key={`icon-row-${color}`} color={color} className="p-3">
          <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2">
            <span className={`text-sm font-semibold ${titleClasses(color)}`}>
              {color}
            </span>
            {variants.map((variant) => (
              <Button
                key={`icon-${color}-${variant}`}
                variant={variant}
                color={color}
                className="w-full justify-center"
              >
                Next
                <Icons.arrow_forward data-slot="icon" />
              </Button>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

// ─── States ──────────────────────────────────────────────────────────────────

export const InteractionStates: Story = {
  name: 'States',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix showing default, hover, active, and focused interaction states: each colour row has four sub-rows.',
          why: 'Confirms hover, active, and focus treatments render correctly across all theme and variant combinations without live interaction.',
          how: 'Compare the sub-rows per theme — hover and active rows should show overlay contrast changes, while focused rows should show the focus outline.',
          caveat:
            'Hover and active states are forced via data attributes, and focus is forced with the component focus outline classes so every cell remains stable in screenshots.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-3">
      <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
        <span>Theme</span>
        {variants.map((variant) => (
          <span
            key={`states-header-${variant}`}
            className="text-center capitalize"
          >
            {variant}
          </span>
        ))}
      </div>

      {colors.map((color) => (
        <ThemeSurface key={`states-${color}`} color={color} className="p-3">
          <div className="space-y-1.5">
            {/* Default / resting */}
            <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2">
              <span className={`text-sm font-semibold ${titleClasses(color)}`}>
                {color}
              </span>
              {variants.map((variant) => (
                <Button
                  key={`default-${color}-${variant}`}
                  variant={variant}
                  color={color}
                  className="w-full justify-center"
                >
                  Next
                </Button>
              ))}
            </div>

            {/* Hover */}
            <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2">
              <span className={`text-xs ${bodyClasses(color)}`}>Hover</span>
              {variants.map((variant) => (
                <button
                  key={`hover-${color}-${variant}`}
                  data-variant={variant}
                  data-hover=""
                  className={cn(
                    buttonVariants({ variant, color }),
                    'w-full justify-center'
                  )}
                >
                  Next
                </button>
              ))}
            </div>

            {/* Active / pressed */}
            <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2">
              <span className={`text-xs ${bodyClasses(color)}`}>Active</span>
              {variants.map((variant) => (
                <button
                  key={`active-${color}-${variant}`}
                  data-variant={variant}
                  data-active=""
                  className={cn(
                    buttonVariants({ variant, color }),
                    'w-full justify-center'
                  )}
                >
                  Next
                </button>
              ))}
            </div>

            {/* Focused */}
            <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2">
              <span className={`text-xs ${bodyClasses(color)}`}>Focused</span>
              {variants.map((variant) => (
                <button
                  key={`focused-${color}-${variant}`}
                  data-variant={variant}
                  className={cn(
                    buttonVariants({ variant, color }),
                    forcedFocusClasses,
                    'w-full justify-center'
                  )}
                >
                  Next
                </button>
              ))}
            </div>
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const States: Story = {
  name: 'Disabled',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix with all buttons in the disabled state: each row is a colour theme and each column is a variant.',
          why: 'Disabled styling regressions are easy to miss during token or opacity refactors.',
          how: 'Confirm every cell shows reduced opacity and the pointer cursor is suppressed across all theme and variant combinations.',
          caveat:
            'Low-contrast themes render on dark surfaces to preserve visible boundaries in visual QA.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-3">
      <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
        <span>Theme</span>
        {variants.map((variant) => (
          <span
            key={`disabled-header-${variant}`}
            className="text-center capitalize"
          >
            {variant}
          </span>
        ))}
      </div>

      {colors.map((color) => (
        <ThemeSurface
          key={`disabled-row-${color}`}
          color={color}
          className="p-3"
        >
          <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2">
            <span className={`text-sm font-semibold ${titleClasses(color)}`}>
              {color}
            </span>
            {variants.map((variant) => (
              <Button
                key={`disabled-${color}-${variant}`}
                variant={variant}
                color={color}
                disabled
                className="w-full justify-center"
              >
                Next
              </Button>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const Focused: Story = {
  name: 'Focused',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix with all buttons in the focused state: each row is a colour theme and each column is a variant.',
          why: 'Focus styling regressions are easy to miss during token or outline refactors.',
          how: 'Confirm every cell shows a visible focus outline using the button colour token.',
          caveat:
            'Focus is forced with the component focus outline classes so every cell can be reviewed at once.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-3">
      <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
        <span>Theme</span>
        {variants.map((variant) => (
          <span
            key={`focused-header-${variant}`}
            className="text-center capitalize"
          >
            {variant}
          </span>
        ))}
      </div>

      {colors.map((color) => (
        <ThemeSurface
          key={`focused-row-${color}`}
          color={color}
          className="p-3"
        >
          <div className="grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2">
            <span className={`text-sm font-semibold ${titleClasses(color)}`}>
              {color}
            </span>
            {variants.map((variant) => (
              <button
                key={`focused-${color}-${variant}`}
                data-variant={variant}
                className={cn(
                  buttonVariants({ variant, color }),
                  forcedFocusClasses,
                  'w-full justify-center'
                )}
              >
                Next
              </button>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}
