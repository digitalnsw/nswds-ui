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
 * Low-contrast themes (white and secondary) are rendered on grey-800 surfaces in these stories to preserve visible boundaries in visual diffs and prevent false positives during visual QA. This is noted in each story's description and is implemented via the ThemeSurface helper component that conditionally applies a darker background and adjusted text colors for themes that would otherwise have insufficient contrast against the default light background.
 *
 * Touch-target geometry checks live in button.accessibility.stories.tsx (TapTargetPanel) rather than in this file.
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
const themeColors = [
  'white',
  'grey',
  'primary',
  'secondary',
  'tertiary',
  'accent',
] as const
const semanticColors = ['danger', 'success', 'warning'] as const
const colors = [...themeColors, ...semanticColors] as const

type ColorKey = (typeof colors)[number]

const lowContrastColors = ['white', 'secondary'] as const
const lowContrastSet = new Set<ColorKey>(lowContrastColors)

const forcedFocusClasses =
  'outline outline-2 outline-offset-2 outline-(--btn-bg)'

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

function needsGreySurface(color: ColorKey): boolean {
  return lowContrastSet.has(color)
}

function surfaceClasses(color: ColorKey): string {
  return needsGreySurface(color)
    ? 'rounded-sm border border-grey-700 bg-grey-800 p-4'
    : 'rounded-sm border border-border bg-background p-4'
}

function titleClasses(color: ColorKey): string {
  return needsGreySurface(color) ? 'text-grey-50' : 'text-foreground'
}

function bodyClasses(color: ColorKey): string {
  return needsGreySurface(color) ? 'text-grey-200' : 'text-muted-foreground'
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
      className={`${surfaceClasses(color)}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}

function getButton(canvasElement: HTMLElement, name: string) {
  const button = Array.from(canvasElement.querySelectorAll('button')).find(
    (el) => el.textContent === name || el.getAttribute('aria-label') === name
  )

  if (!button) throw new Error(`Could not find button named "${name}".`)

  return button
}

// ─── Matrix stories ───────────────────────────────────────────────────────────

function ByVariantMatrix({ rowColors }: { rowColors: readonly ColorKey[] }) {
  return (
    <div className="w-full max-w-7xl space-y-3">
      <div className="text-muted-foreground grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold">
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

      {rowColors.map((color) => (
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
  )
}

export const ByVariantTheme: Story = {
  name: 'By Variant - Theme',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix limited to brand theme colours (white, grey, primary, secondary, tertiary, accent): each row is a colour theme and each column is a variant.',
          why: 'Matches design token review flow and quickly reveals per-theme variant drift across the brand palette.',
          how: 'Scan each row horizontally and compare hover/focus/disabled behavior across variants.',
          caveat:
            'Rows for low-contrast themes (white, secondary) are rendered on grey-800 surfaces to avoid false negatives in visual QA.',
        }),
      },
    },
  },
  render: () => <ByVariantMatrix rowColors={themeColors} />,
}

export const ByVariantSemantic: Story = {
  name: 'By Variant - Semantic',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix limited to semantic colours (danger, success, warning): each row is a semantic colour and each column is a variant.',
          why: 'Keeps status-conveying tokens together so success/warning/danger contrast and weight can be compared in isolation from brand colours.',
          how: 'Scan each row horizontally and verify the semantic meaning still reads correctly across every variant (e.g. ghost danger still reads as danger).',
          caveat:
            'All semantic colours use high-contrast 600-step values on a white text baseline, so no grey surface treatment is needed.',
        }),
      },
    },
  },
  render: () => <ByVariantMatrix rowColors={semanticColors} />,
}

function ByColourMatrix({ groupColors }: { groupColors: readonly ColorKey[] }) {
  const standard = groupColors.filter((color) => !lowContrastSet.has(color))
  const lowContrast = groupColors.filter((color) => lowContrastSet.has(color))
  const standardCols = standard.length
  const lowCols = lowContrast.length

  return (
    <div className="w-full max-w-7xl space-y-4">
      {standardCols > 0 && (
        <section className="overflow-x-auto">
          <div
            className="space-y-2"
            style={{ minWidth: `${16 + standardCols * 10}rem` }}
          >
            <div
              className="text-muted-foreground grid items-center gap-2 px-3 text-xs font-semibold"
              style={{
                gridTemplateColumns: `9rem repeat(${standardCols}, minmax(0, 1fr))`,
              }}
            >
              <span>Variant</span>
              {standard.map((color) => (
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
                className="border-border bg-background grid items-center gap-2 rounded-sm border p-3"
                style={{
                  gridTemplateColumns: `9rem repeat(${standardCols}, minmax(0, 1fr))`,
                }}
              >
                <span className="text-foreground text-sm font-semibold capitalize">
                  {variant}
                </span>
                {standard.map((color) => (
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
      )}

      {lowCols > 0 && (
        <section className="rounded-sm border border-grey-700 bg-grey-800 p-3">
          <div className="overflow-x-auto">
            <div
              className="space-y-2"
              style={{ minWidth: `${16 + lowCols * 18}rem` }}
            >
              <div
                className="grid items-center gap-2 px-3 text-xs font-semibold text-grey-200"
                style={{
                  gridTemplateColumns: `9rem repeat(${lowCols}, minmax(0, 1fr))`,
                }}
              >
                <span>Variant</span>
                {lowContrast.map((color) => (
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
                  className="grid items-center gap-2 rounded-sm border border-grey-700/80 bg-grey-800 p-3"
                  style={{
                    gridTemplateColumns: `9rem repeat(${lowCols}, minmax(0, 1fr))`,
                  }}
                >
                  <span className="text-sm font-semibold text-grey-100 capitalize">
                    {variant}
                  </span>
                  {lowContrast.map((color) => (
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
      )}
    </div>
  )
}

export const ByColourTheme: Story = {
  name: 'By Colour - Theme',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Variant-first matrix limited to brand theme colours: each row is a variant and each column is a brand colour.',
          why: 'Protects against variant implementation regressions during CSS refactors of the brand palette.',
          how: 'Compare each row across brand colours and verify that variant semantics remain consistent.',
          caveat:
            'Low-contrast themes (white, secondary) are split into a grey-800 surface section so their boundaries remain visible.',
        }),
      },
    },
  },
  render: () => <ByColourMatrix groupColors={themeColors} />,
}

export const ByColourSemantic: Story = {
  name: 'By Colour - Semantic',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Variant-first matrix limited to semantic colours: each row is a variant and each column is a semantic colour (danger, success, warning).',
          why: 'Keeps the status palette together so danger/success/warning can be reviewed for visual parity across every variant.',
          how: 'Compare each row across the semantic columns and verify hover/active/disabled treatments scale the same way as the brand colours.',
          caveat:
            'All semantic colours render on the default background — none qualify as low-contrast.',
        }),
      },
    },
  },
  render: () => <ByColourMatrix groupColors={semanticColors} />,
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
      <div className="text-muted-foreground grid grid-cols-[9rem_repeat(4,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold">
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
      <div className="text-muted-foreground grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold">
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
                <Icons.east data-slot="icon" />
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
            'Button uses native CSS :hover / :active which cannot be triggered without real pointer events. This story mirrors those rules onto a scoped [data-hover] / [data-active] attribute via the <style> block below so each row paints its state at rest. Focus is forced with the same outline utilities the component applies under :focus.',
        }),
      },
    },
  },
  render: () => (
    <div className="force-state-grid w-full max-w-7xl space-y-3">
      {/*
        Mirror the :hover / :active rules from buttonVariants onto [data-hover] /
        [data-active] so the rows below can paint their state without real
        pointer events. Scoped to this story container (.force-state-grid)
        only; the production component still relies on the native pseudo-classes.
        Hover is listed before active so a button carrying both attrs picks
        the active overlay — matching the normal :hover then :active cascade.
      */}
      <style>{`
        .force-state-grid [data-hover]::after { background-color: var(--btn-hover-overlay); }
        .force-state-grid [data-active]::after { background-color: var(--btn-active-overlay); }
        .force-state-grid [data-hover][data-variant="surface"],
        .force-state-grid [data-active][data-variant="surface"] { border-color: var(--btn-bg); }
        .force-state-grid [data-hover][data-variant="link"],
        .force-state-grid [data-active][data-variant="link"] { text-decoration: underline; text-underline-offset: 4px; }
      `}</style>

      <div className="text-muted-foreground grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold">
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
            'Low-contrast themes render on grey-800 surfaces to preserve visible boundaries in visual QA.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-3">
      <div className="text-muted-foreground grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold">
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
      <div className="text-muted-foreground grid grid-cols-[9rem_repeat(6,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold">
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
