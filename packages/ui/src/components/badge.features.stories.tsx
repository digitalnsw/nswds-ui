/**
 * Badge — Features
 *
 * Variant/colour matrices, size scale, interaction states, and the
 * interactive BadgeButton showcase.
 *
 * These stories are intended for internal use during design token reviews and CSS refactors to catch regressions across the full Badge component surface. They are not intended for external documentation or as examples of typical usage, so they intentionally include every variant/size/state combination in a single story for efficient visual review.
 *
 * Each story includes a detailed description of what to look for and how to test it, so that non-engineers can confidently use these stories for visual QA without needing to understand implementation details or refer back to design documentation.
 *
 * The "By Variant" and "By Colour" stories show the full matrix of themes and variants with default states, while the "Sizes" and "States" stories drill into specific features with additional rows for size scale and hover/active/focused/disabled styling. The "Badge Button Showcase" story demonstrates the interactive BadgeButton wrapper that expands the hit area to 44×44px.
 *
 * Low-contrast themes (white, secondary) are rendered on grey-800 surfaces in these stories to preserve visible boundaries in visual diffs and prevent false positives during visual QA. This is noted in each story's description and is implemented via the ThemeSurface helper imported from `./story-helpers.js`.
 *
 * Touch-target geometry checks live in badge.accessibility.stories.tsx (TargetSizePanel) rather than in this file.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { cn } from '../lib/utils.js'
import { Badge, BadgeButton, badgeVariants } from './badge.js'
import { Icons } from './icons.js'
import {
  ThemeSurface,
  bodyClasses,
  docsTemplate,
  lowContrastSet,
  titleClasses,
} from './story-helpers.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const variants = ['solid', 'soft', 'surface', 'outline'] as const
const sizes = ['sm', 'default', 'lg'] as const
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

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Badge/Features',
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

// ─── Matrix stories ───────────────────────────────────────────────────────────

export const ByVariant: Story = {
  name: 'By Variant',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix across every Badge colour: each row is a colour and each column is a variant (solid, soft, surface, outline).',
          why: 'Matches design token review flow and quickly reveals per-colour variant drift across the full palette in a single view.',
          how: 'Scan each row horizontally and verify the badge surface, border, and label contrast behave consistently across variants.',
          caveat:
            'Rows for low-contrast colours (white, secondary) are rendered on grey-800 surfaces via ThemeSurface so their boundaries remain visible during visual QA.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-3">
      <div className="grid grid-cols-[10rem_repeat(4,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
        <span>Colour</span>
        {variants.map((variant) => (
          <span
            key={`by-variant-header-${variant}`}
            className="text-center capitalize"
          >
            {variant}
          </span>
        ))}
      </div>

      {colors.map((color) => (
        <ThemeSurface
          key={`by-variant-row-${color}`}
          color={color}
          className="p-3"
        >
          <div className="grid grid-cols-[10rem_repeat(4,minmax(0,1fr))] items-center gap-2">
            <span className={`text-sm font-semibold ${titleClasses(color)}`}>
              {color}
            </span>
            {variants.map((variant) => (
              <div
                key={`by-variant-${color}-${variant}`}
                className="flex justify-center"
              >
                <Badge variant={variant} color={color}>
                  New
                </Badge>
              </div>
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
          what: 'Variant-first matrix across every Badge colour: each row is a variant and each column is a colour.',
          why: 'Protects against variant implementation regressions during CSS refactors — comparing across columns surfaces drift in border/background tokens for a given variant.',
          how: 'Compare each row across colours and verify variant semantics remain consistent (e.g. outline always shows a 1px border, soft always uses a tinted background).',
          caveat:
            'Low-contrast colours (white, secondary) are split into a grey-800 surface section so their boundaries remain visible.',
        }),
      },
    },
  },
  render: () => {
    const standard = colors.filter((color) => !lowContrastSet.has(color))
    const lowContrast = colors.filter((color) => lowContrastSet.has(color))
    const standardCols = standard.length
    const lowCols = lowContrast.length

    return (
      <div className="w-full max-w-7xl space-y-4">
        {standardCols > 0 && (
          // The matrix overflows horizontally on narrow viewports. axe's
          // `scrollable-region-focusable` rule requires the scrollable
          // container to be keyboard-reachable OR contain focusable
          // descendants — Badge renders a non-interactive <span>, so we
          // make the section itself focusable and label it for AT.
          <section
            className="overflow-x-auto"
            tabIndex={0}
            aria-label="Badge variant × colour matrix"
          >
            <div
              className="space-y-2"
              style={{ minWidth: `${16 + standardCols * 9}rem` }}
            >
              <div
                className="grid items-center gap-2 px-3 text-xs font-semibold text-muted-foreground"
                style={{
                  gridTemplateColumns: `9rem repeat(${standardCols}, minmax(0, 1fr))`,
                }}
              >
                <span>Variant</span>
                {standard.map((color) => (
                  <span
                    key={`by-colour-standard-header-${color}`}
                    className="text-center"
                  >
                    {color}
                  </span>
                ))}
              </div>

              {variants.map((variant) => (
                <div
                  key={`by-colour-standard-row-${variant}`}
                  className="grid items-center gap-2 rounded-sm border border-border bg-background p-3"
                  style={{
                    gridTemplateColumns: `9rem repeat(${standardCols}, minmax(0, 1fr))`,
                  }}
                >
                  <span className="text-sm font-semibold text-foreground capitalize">
                    {variant}
                  </span>
                  {standard.map((color) => (
                    <div
                      key={`by-colour-standard-${variant}-${color}`}
                      className="flex justify-center"
                    >
                      <Badge variant={variant} color={color}>
                        New
                      </Badge>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {lowCols > 0 && (
          <section className="rounded-sm border border-grey-700 bg-grey-800 p-3">
            <div
              className="overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Low-contrast badge variant × colour matrix"
            >
              <div
                className="space-y-2"
                style={{ minWidth: `${16 + lowCols * 16}rem` }}
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
                      key={`by-colour-low-header-${color}`}
                      className="text-center"
                    >
                      {color}
                    </span>
                  ))}
                </div>

                {variants.map((variant) => (
                  <div
                    key={`by-colour-low-row-${variant}`}
                    className="grid items-center gap-2 rounded-sm border border-grey-700/80 bg-grey-800 p-3"
                    style={{
                      gridTemplateColumns: `9rem repeat(${lowCols}, minmax(0, 1fr))`,
                    }}
                  >
                    <span className="text-sm font-semibold text-grey-100 capitalize">
                      {variant}
                    </span>
                    {lowContrast.map((color) => (
                      <div
                        key={`by-colour-low-${variant}-${color}`}
                        className="flex justify-center"
                      >
                        <Badge variant={variant} color={color}>
                          New
                        </Badge>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    )
  },
}

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first, variant-row matrix showing all three size presets: each colour block has one sub-row per variant.',
          why: 'Confirms size-driven padding and label typography tokens scale correctly across every colour and variant combination.',
          how: 'Scan each sub-row to verify relative badge heights and label spacing scale consistently across colours.',
          caveat:
            'Badges have three size presets (sm, default, lg). Low-contrast colours (white, secondary) are rendered on grey-800 surfaces to preserve visible boundaries.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-5xl space-y-3">
      <div className="grid grid-cols-[10rem_repeat(3,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
        <span>Colour</span>
        {sizes.map((size) => (
          <span key={`sizes-header-${size}`} className="text-center capitalize">
            {size}
          </span>
        ))}
      </div>

      {colors.map((color: ColorKey) => (
        <ThemeSurface key={`sizes-${color}`} color={color} className="p-3">
          <div className="space-y-1.5">
            {variants.map((variant, i) => (
              <div
                key={`sizes-${color}-${variant}`}
                className="grid grid-cols-[10rem_repeat(3,minmax(0,1fr))] items-center gap-2"
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
                  <div
                    key={`sizes-${color}-${variant}-${size}`}
                    className="flex justify-center"
                  >
                    <Badge variant={variant} color={color} size={size}>
                      New
                    </Badge>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

// ─── States ──────────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'States',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix showing default, hover, active, and disabled interaction states for the interactive BadgeButton wrapper: each colour row has four sub-rows.',
          why: 'Confirms hover, active, and disabled treatments render correctly across all colour and variant combinations without requiring live pointer interaction.',
          how: 'Compare the sub-rows per colour — hover and active rows should show overlay contrast changes, while the disabled row should show reduced opacity and a non-interactive cursor.',
          caveat:
            'BadgeButton uses native CSS :hover / :active which cannot be triggered without real pointer events. This story mirrors those rules onto a scoped [data-hover] / [data-active] attribute via the <style> block below so each row paints its state at rest. The disabled row uses real disabled BadgeButtons.',
        }),
      },
    },
  },
  render: () => (
    <div className="force-state-grid w-full max-w-7xl space-y-3">
      {/*
        Mirror the :hover / :active rules from badgeVariants onto [data-hover] /
        [data-active] so the rows below can paint their state without real
        pointer events. Scoped to this story container (.force-state-grid)
        only; the production component still relies on the native pseudo-classes.
        Hover is listed before active so a badge carrying both attrs picks
        the active overlay — matching the normal :hover then :active cascade.
      */}
      <style>{`
        .force-state-grid [data-hover]::after { background-color: var(--badge-hover-overlay); }
        .force-state-grid [data-active]::after { background-color: var(--badge-hover-overlay); }
        .force-state-grid [data-hover][data-variant="surface"],
        .force-state-grid [data-active][data-variant="surface"] { border-color: var(--badge-bg); }
      `}</style>

      <div className="grid grid-cols-[10rem_repeat(4,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
        <span>Colour</span>
        {variants.map((variant) => (
          <span
            key={`states-header-${variant}`}
            className="text-center capitalize"
          >
            {variant}
          </span>
        ))}
      </div>

      {colors.map((color: ColorKey) => (
        <ThemeSurface key={`states-${color}`} color={color} className="p-3">
          <div className="space-y-1.5">
            {/* Default / resting */}
            <div className="grid grid-cols-[10rem_repeat(4,minmax(0,1fr))] items-center gap-2">
              <span className={`text-sm font-semibold ${titleClasses(color)}`}>
                {color}
              </span>
              {variants.map((variant) => (
                <div
                  key={`default-${color}-${variant}`}
                  className="flex justify-center"
                >
                  <Badge variant={variant} color={color}>
                    New
                  </Badge>
                </div>
              ))}
            </div>

            {/* Hover */}
            <div className="grid grid-cols-[10rem_repeat(4,minmax(0,1fr))] items-center gap-2">
              <span className={`text-xs ${bodyClasses(color)}`}>Hover</span>
              {variants.map((variant) => (
                <div
                  key={`hover-${color}-${variant}`}
                  className="flex justify-center"
                >
                  <span
                    data-variant={variant}
                    data-hover=""
                    className={cn(badgeVariants({ variant, color }))}
                  >
                    New
                  </span>
                </div>
              ))}
            </div>

            {/* Active / pressed */}
            <div className="grid grid-cols-[10rem_repeat(4,minmax(0,1fr))] items-center gap-2">
              <span className={`text-xs ${bodyClasses(color)}`}>Active</span>
              {variants.map((variant) => (
                <div
                  key={`active-${color}-${variant}`}
                  className="flex justify-center"
                >
                  <span
                    data-variant={variant}
                    data-active=""
                    className={cn(badgeVariants({ variant, color }))}
                  >
                    New
                  </span>
                </div>
              ))}
            </div>

            {/* Disabled */}
            <div className="grid grid-cols-[10rem_repeat(4,minmax(0,1fr))] items-center gap-2">
              <span className={`text-xs ${bodyClasses(color)}`}>Disabled</span>
              {variants.map((variant) => (
                <div
                  key={`disabled-${color}-${variant}`}
                  className="flex justify-center"
                >
                  <BadgeButton variant={variant} color={color} disabled>
                    New
                  </BadgeButton>
                </div>
              ))}
            </div>
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

// ─── BadgeButton showcase ────────────────────────────────────────────────────

export const BadgeButtonShowcase: Story = {
  name: 'Badge Button Showcase',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Interactive BadgeButton variant rendered in every colour. BadgeButton is polymorphic — it renders as a Base UI Button by default, or as a Link when an href is supplied — and wraps the inner Badge in a TouchTarget so the hit area expands to 44×44px on coarse pointers.',
          why: 'Verifies the interactive wrapper preserves the badge visual treatment while introducing the focus outline, expanded hit area, and link/button semantics that distinguish it from the presentational Badge.',
          how: 'Tab through the rows to confirm the focus outline appears for every colour. Click any badge to confirm the button activates; the href-bearing example should render as an anchor with the same visual treatment.',
          caveat:
            'BadgeButton inherits its accessible role from the underlying primitive (button or link). Use the presentational Badge when the badge conveys information only, and BadgeButton when the badge itself should be activatable.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-5xl space-y-3">
      {colors.map((color: ColorKey) => (
        <ThemeSurface key={`bb-${color}`} color={color} className="p-3">
          <div className="space-y-2">
            <span className={`text-sm font-semibold ${titleClasses(color)}`}>
              {color}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {variants.map((variant) => (
                <BadgeButton
                  key={`bb-${color}-${variant}`}
                  variant={variant}
                  color={color}
                >
                  New
                </BadgeButton>
              ))}
              <BadgeButton color={color} href="#">
                <Icons.east data-slot="icon" />
                Link badge
              </BadgeButton>
            </div>
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}
