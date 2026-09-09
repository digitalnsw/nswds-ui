/**
 * ButtonGroup — Features
 *
 * Theme/variant matrices, emphasis, sizes, orientation, compositions, states,
 * and the rules a group promises, each with a play that fails if the rule is
 * removed.
 *
 * These stories are intended for internal use during design token reviews and
 * CSS refactors to catch regressions across the full component surface. They
 * are not intended as examples of typical usage, so they deliberately show
 * every variant / colour / state combination in one story for efficient
 * visual review.
 *
 * Each story includes a description of what to look for and how to test it,
 * so that non-engineers can use these stories for visual QA without reading
 * the implementation.
 *
 * Low-contrast colours (white and secondary) are rendered on grey-800
 * surfaces, as in the Button stories, so their frames stay visible in visual
 * diffs.
 *
 * Keyboard, focus and target-size checks live in
 * button-group.accessibility.stories.tsx.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'

import {
  IconContentCopy,
  IconContentCut,
  IconContentPaste,
  IconExpandMore,
} from '../icons/index.js'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  type ButtonGroupVariant,
} from './button-group.js'
import { Button, ButtonLink } from './button.js'
import { Popover, PopoverContent, PopoverTrigger } from './popover.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const variants = [
  'outline',
  'solid',
  'soft',
  'surface',
  'ghost',
] as const satisfies readonly ButtonGroupVariant[]
const sizes = ['sm', 'default', 'lg'] as const
const themeColors = ['white', 'grey', 'primary', 'secondary', 'tertiary', 'accent'] as const
const semanticColors = ['danger', 'success', 'warning'] as const
const colors = [...themeColors, ...semanticColors] as const

type ColorKey = (typeof colors)[number]

const lowContrastColors = ['white', 'secondary'] as const
const lowContrastSet = new Set<ColorKey>(lowContrastColors)

// The ring a segment paints under :focus — inside its edge, because the group
// clips its corners — and the label-coloured ring a solid segment paints
// instead, since in light mode its ink and its fill are one token.
const forcedFocusClasses = 'outline outline-2 -outline-offset-2 outline-(--btn-bg)'
const forcedSolidFocusClasses = 'outline outline-2 -outline-offset-2 outline-(--btn-text)'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/ButtonGroup/Features',
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

function needsGreySurface(color: ColorKey): boolean {
  return lowContrastSet.has(color)
}

function titleClasses(color: ColorKey): string {
  return needsGreySurface(color) ? 'text-grey-50' : 'text-foreground'
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

/** Reads a computed colour and reports whether it paints anything. */
function isPainted(color: string) {
  return color !== '' && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)'
}

/** A Button's resolved fill token, for comparing colour inheritance. */
function fillOf(element: Element) {
  return getComputedStyle(element).getPropertyValue('--btn-fill').trim()
}

const matrixGrid = 'grid grid-cols-[9rem_repeat(5,minmax(0,1fr))] items-center gap-2'

function MatrixHeader({ prefix }: { prefix: string }) {
  return (
    <div className={`${matrixGrid} px-3 text-xs font-semibold text-muted-foreground`}>
      <span>Theme</span>
      {variants.map((variant) => (
        <span key={`${prefix}-header-${variant}`} className='text-center capitalize'>
          {variant}
        </span>
      ))}
    </div>
  )
}

// The full matrices render every colour token in every treatment, and four
// of Button's soft / surface pairs do not clear WCAG 1.4.3 for a bold 16px
// label on their own tint: tertiary (primary-600 on its 10% tint, 3.99:1;
// on its 5% tint, 4.28:1), accent (4.39:1 on its 10% tint), success (3.95:1
// and 4.22:1) and warning (3.98:1 and 4.23:1). These are Button's own pairs
// — a lone soft success Button paints the same ink on the same tint — but
// Button's matrices pass axe only because axe cannot compute a background
// through Button's pseudo-element fill and reports those cells as
// "incomplete" rather than as violations. A group paints its band on a real
// element, so axe measures it. The fix is a token retune, not a group
// change; until then the contrast rule is scoped off the matrix stories
// only. The Accessibility folder's Contrast story renders the pairs that
// pass and names the ones that do not.
const contrastRuleOff = {
  options: { rules: { 'color-contrast': { enabled: false } } },
} as const

// ─── Matrix stories ───────────────────────────────────────────────────────────

function ByVariantMatrix({ rowColors }: { rowColors: readonly ColorKey[] }) {
  return (
    <div className='w-full max-w-7xl space-y-3'>
      <MatrixHeader prefix='theme' />
      {rowColors.map((color) => (
        <ThemeSurface key={`theme-row-${color}`} color={color} className='p-3'>
          <div className={matrixGrid}>
            <span className={`text-sm font-semibold ${titleClasses(color)}`}>{color}</span>
            {variants.map((variant) => (
              <ButtonGroup
                key={`${color}-${variant}`}
                variant={variant}
                color={color}
                aria-label={`${color} ${variant}`}
                className='justify-self-center'
              >
                <Button>Copy</Button>
                <Button>Paste</Button>
              </ButtonGroup>
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
    a11y: contrastRuleOff,
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix limited to brand theme colours (white, grey, primary, secondary, tertiary, accent): each row is a colour and each column is a group variant, with a two-segment group in every cell.',
          why: "A group's frame, band and dividers are drawn in the colour token's ink, so a token retune shows up here first.",
          how: 'Scan each row: the frame or band should be the same ink across the row, the divider should match, and the labels should read against the band in every cell.',
          caveat:
            'Rows for low-contrast colours (white, secondary) are rendered on grey-800 surfaces, the surfaces those tokens are meant for.',
        }),
      },
    },
  },
  render: () => <ByVariantMatrix rowColors={themeColors} />,
}

export const ByVariantSemantic: Story = {
  name: 'By Variant - Semantic',
  parameters: {
    a11y: contrastRuleOff,
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix limited to semantic colours (danger, success, warning): each row is a semantic colour and each column is a group variant.',
          why: 'Keeps status-conveying tokens together so their weight can be compared without the brand colours in view.',
          how: 'Scan each row and verify the meaning still reads across every treatment: a ghost danger group should still read as danger.',
          caveat: 'All semantic colours use the 600 step, so no grey surface treatment is needed.',
        }),
      },
    },
  },
  render: () => <ByVariantMatrix rowColors={semanticColors} />,
}

// ─── Emphasis ─────────────────────────────────────────────────────────────────

export const Emphasis: Story = {
  name: 'Emphasis',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Per group variant: a split button (two solid segments), a Cancel / Save row (a solid child beside a ghost one), a soft child, and a solid band holding a soft child.',
          why: 'A segment that names solid or soft keeps its own fill; two solid segments must divide with a reversed hairline rather than the ink divider, and on a solid band every non-solid segment must take the label colour as its ink.',
          how: 'Look for the pale seam between Save and its chevron, and confirm the Day / Week / Month row on the band reads white on blue. The play asserts both.',
          caveat:
            'Only solid and soft carry their fill into a group. A surface child would keep its 2px border inside the frame, so it renders as a plain segment.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-7xl space-y-3'>
      {variants.map((variant) => (
        <ThemeSurface key={`emphasis-${variant}`} color='primary' className='p-3'>
          <div className='flex flex-wrap items-center gap-4'>
            <span className='w-20 text-sm font-semibold text-foreground'>{variant}</span>
            <ButtonGroup variant={variant} aria-label={`${variant} split`}>
              <Button variant='solid'>Save</Button>
              <Button
                variant='solid'
                iconOnly
                aria-label={`${variant} more save options`}
                leadingVisual={IconExpandMore}
              />
            </ButtonGroup>
            <ButtonGroup variant={variant}>
              <Button>Cancel</Button>
              <Button variant='solid'>Save and continue</Button>
            </ButtonGroup>
            <ButtonGroup variant={variant} aria-label={`${variant} view`}>
              <Button>Day</Button>
              <Button variant='soft'>Week</Button>
              <Button>Month</Button>
            </ButtonGroup>
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Emphasis is kept, whatever the group variant.
    for (const save of canvas.getAllByRole('button', { name: 'Save' })) {
      await expect(save).toHaveAttribute('data-variant', 'solid')
      await expect(save).toHaveAttribute('data-segment', 'override')
    }
    for (const week of canvas.getAllByRole('button', { name: 'Week' })) {
      await expect(week).toHaveAttribute('data-variant', 'soft')
      await expect(week).toHaveAttribute('data-segment', 'override')
    }

    // Two solid segments divide with a reversed hairline, not the ink divider
    // (which would vanish on the fill).
    const seam = getComputedStyle(
      canvas.getByRole('button', { name: 'outline more save options' }),
    ).borderLeftColor
    const divider = getComputedStyle(
      within(canvas.getByRole('group', { name: 'outline view' })).getByRole('button', {
        name: 'Month',
      }),
    ).borderLeftColor
    await expect(isPainted(seam)).toBe(true)
    await expect(seam).not.toBe(divider)

    // On a solid band every segment that is not itself solid takes the band's
    // label colour as its ink: a defaulted segment and a soft one both read
    // in the same colour as a solid segment's label.
    const solidLabel = getComputedStyle(canvas.getAllByRole('button', { name: 'Save' })[0]!).color
    const band = canvas.getByRole('group', { name: 'solid view' })
    for (const segment of within(band).getAllByRole('button')) {
      await expect(getComputedStyle(segment).color).toBe(solidLabel)
    }
  },
}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Colour-row matrix of the three size steps, each cell a two-segment group; the last row pairs a group with a lone Button of the same step.',
          why: "The group's size is every segment's default, and a group must be exactly as tall as the lone Button beside it: the frame is an inset ring, not a border, so it adds no height.",
          how: 'Compare the heights within each row, and the group against the lone Button in the last row. The play asserts the inherited size and the equal height.',
          caveat:
            '`icon` is not a group size: the group clips to its own box and would cut off the 44px touch expansion the 40px square relies on. Segments stretch to the tallest in their group, so a child naming a larger size grows the whole row.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-5xl space-y-3'>
      <div className='grid grid-cols-[9rem_repeat(3,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground'>
        <span>Theme</span>
        {sizes.map((size) => (
          <span key={`size-header-${size}`} className='text-center capitalize'>
            {size}
          </span>
        ))}
      </div>
      {(['primary', 'grey', 'danger'] as const).map((color) => (
        <ThemeSurface key={`sizes-${color}`} color={color} className='p-3'>
          <div className='grid grid-cols-[9rem_repeat(3,minmax(0,1fr))] items-center gap-2'>
            <span className={`text-sm font-semibold ${titleClasses(color)}`}>{color}</span>
            {sizes.map((size) => (
              <ButtonGroup
                key={`sizes-${color}-${size}`}
                size={size}
                color={color}
                aria-label={`${color} ${size}`}
                className='justify-self-center'
              >
                <Button>Copy</Button>
                <Button>Paste</Button>
              </ButtonGroup>
            ))}
          </div>
        </ThemeSurface>
      ))}
      <ThemeSurface color='primary' className='p-3'>
        <div className='flex flex-wrap items-start gap-4'>
          <span className='w-20 text-sm font-semibold text-foreground'>beside</span>
          <ButtonGroup size='sm' aria-label='Small group'>
            <Button>Small segment</Button>
          </ButtonGroup>
          <Button size='sm'>Small reference</Button>
          <ButtonGroup aria-label='Default group'>
            <Button>Default segment</Button>
          </ButtonGroup>
          <Button>Default reference</Button>
          <ButtonGroup size='sm' aria-label='Override group'>
            <Button size='lg'>Own size</Button>
          </ButtonGroup>
        </div>
      </ThemeSurface>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heightOf = (name: string) =>
      canvas.getByRole('button', { name }).getBoundingClientRect().height
    // The group's size is the segment's default, and the group adds no height…
    await expect(heightOf('Small segment')).toBe(heightOf('Small reference'))
    await expect(
      canvas.getByRole('group', { name: 'Small group' }).getBoundingClientRect().height,
    ).toBe(heightOf('Small reference'))
    await expect(heightOf('Small segment')).toBeLessThan(heightOf('Default segment'))
    await expect(heightOf('Default segment')).toBe(heightOf('Default reference'))
    // …and a segment naming its own size keeps it.
    await expect(heightOf('Own size')).toBeGreaterThan(heightOf('Default segment'))
  },
}

// ─── Inherited colour ─────────────────────────────────────────────────────────

export const InheritedColour: Story = {
  name: 'Inherited Colour',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Per colour: a group whose segments inherit its colour, next to one segment naming its own, and a lone Button of the same colour as the reference.',
          why: "A group's colour is every segment's default, and a segment that names its own colour must keep it. Both were silent before this story existed: a group that stopped passing its colour down still rendered, in primary.",
          how: 'The inheriting segment should match the lone reference exactly; the overriding segment should not. The play compares the resolved fill token of each.',
          caveat:
            'The comparison is on the `--btn-fill` custom property, which every colour token sets, so it holds in both light and dark mode.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-5xl space-y-3'>
      {(['danger', 'accent', 'grey'] as const).map((color) => (
        <ThemeSurface key={`inherit-${color}`} color={color} className='p-3'>
          <div className='flex flex-wrap items-center gap-4'>
            <span className={`w-20 text-sm font-semibold ${titleClasses(color)}`}>{color}</span>
            <ButtonGroup color={color} aria-label={`${color} group`}>
              <Button>Inherits</Button>
              <Button color='primary'>Own colour</Button>
            </ButtonGroup>
            <Button color={color}>Reference</Button>
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const groups = canvas.getAllByRole('group')
    const references = canvas.getAllByRole('button', { name: 'Reference' })
    for (const [index, group] of groups.entries()) {
      const reference = fillOf(references[index]!)
      const inside = within(group)
      await expect(fillOf(inside.getByRole('button', { name: 'Inherits' }))).toBe(reference)
      await expect(fillOf(inside.getByRole('button', { name: 'Own colour' }))).not.toBe(reference)
    }
  },
}

// ─── Orientation ──────────────────────────────────────────────────────────────

export const Orientation: Story = {
  name: 'Orientation',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Per group variant: the same three segments as a row and as a column.',
          why: 'A vertical group moves the divider from the leading edge to the top edge of each segment; the horizontal rule must not leak across orientations or a column grows a stray left border on every segment.',
          how: 'The column should show one hairline between each pair of segments and nothing on the left. The play reads the middle segment of each column.',
          caveat:
            'Corners are clipped by the group in both orientations, so segments never round their own.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-7xl space-y-3'>
      {variants.map((variant) => (
        <ThemeSurface key={`orientation-${variant}`} color='primary' className='p-3'>
          <div className='flex flex-wrap items-start gap-4'>
            <span className='w-20 text-sm font-semibold text-foreground'>{variant}</span>
            <ButtonGroup variant={variant} aria-label={`${variant} row`}>
              <Button>Top</Button>
              <Button>Middle</Button>
              <Button>Bottom</Button>
            </ButtonGroup>
            <ButtonGroup variant={variant} orientation='vertical' aria-label={`${variant} column`}>
              <Button>Top</Button>
              <Button>Middle</Button>
              <Button>Bottom</Button>
            </ButtonGroup>
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const variant of variants) {
      const column = within(canvas.getByRole('group', { name: `${variant} column` }))
      const [first, middle] = column.getAllByRole('button')
      const styles = getComputedStyle(middle!)
      await expect(isPainted(styles.borderTopColor)).toBe(true)
      await expect(isPainted(styles.borderLeftColor)).toBe(false)
      await expect(isPainted(getComputedStyle(first!).borderTopColor)).toBe(false)

      const row = within(canvas.getByRole('group', { name: `${variant} row` }))
      const rowMiddle = getComputedStyle(row.getAllByRole('button')[1]!)
      await expect(isPainted(rowMiddle.borderLeftColor)).toBe(true)
      await expect(isPainted(rowMiddle.borderTopColor)).toBe(false)
    }
  },
}

// ─── Compositions ─────────────────────────────────────────────────────────────

export const Compositions: Story = {
  name: 'Text, Separators and Links',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Per group variant: icon-only segments, a text cell, a separator, a ButtonLink segment, and children written with the shadcn idiom (variant="outline" on every child).',
          why: 'Every child kind must sit inside the same boundary: the text cell at the body size with the frame showing through it, the separator audible but invisible, the link divided like a button, and an outline child drawing no second border.',
          how: 'Nothing in a row should have its own corners or a doubled edge. The play checks the separator orientation, the link divider, and that outline children render as ghost segments.',
          caveat:
            'The separator draws nothing: every segment is already divided by a hairline, so it exists for assistive technology only.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-7xl space-y-3'>
      {variants.map((variant) => (
        <ThemeSurface key={`compose-${variant}`} color='primary' className='p-3'>
          <div className='flex flex-wrap items-center gap-4'>
            <span className='w-20 text-sm font-semibold text-foreground'>{variant}</span>
            <ButtonGroup variant={variant} aria-label={`${variant} icons`}>
              <Button iconOnly aria-label='Copy' leadingVisual={IconContentCopy} />
              <Button iconOnly aria-label='Paste' leadingVisual={IconContentPaste} />
              <Button iconOnly aria-label='Cut' leadingVisual={IconContentCut} />
            </ButtonGroup>
            <ButtonGroup variant={variant} aria-label={`${variant} formatting`}>
              <Button>Bold</Button>
              <ButtonGroupText>Aa</ButtonGroupText>
              <Button>Italic</Button>
            </ButtonGroup>
            <ButtonGroup variant={variant} aria-label={`${variant} separated`}>
              <Button>Copy</Button>
              <ButtonGroupSeparator />
              <Button>Paste</Button>
            </ButtonGroup>
            <ButtonGroup variant={variant} aria-label={`${variant} mixed`}>
              <ButtonLink href='#docs'>Docs</ButtonLink>
              <Button>Act</Button>
            </ButtonGroup>
            <ButtonGroup variant={variant} aria-label={`${variant} idiom`}>
              <Button variant='outline'>Copy</Button>
              <Button variant='ghost'>Paste</Button>
              <Button variant='link'>Cut</Button>
            </ButtonGroup>
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A separator crosses the group's axis: vertical in a row.
    for (const separator of canvas.getAllByRole('separator')) {
      await expect(separator).toHaveAttribute('data-orientation', 'vertical')
    }

    for (const variant of variants) {
      // The link is a segment like any other, so the Button after it divides
      // from it.
      const mixed = within(canvas.getByRole('group', { name: `${variant} mixed` }))
      const link = mixed.getByRole('link', { name: 'Docs' })
      await expect(link).toHaveAttribute('data-segment', 'default')
      await expect(link).toHaveAttribute('data-variant', 'ghost')
      await expect(
        isPainted(getComputedStyle(mixed.getByRole('button', { name: 'Act' })).borderLeftColor),
      ).toBe(true)

      // The shadcn idiom draws no second border: a child without emphasis
      // renders as a plain segment, whatever it asked for.
      const idiom = within(canvas.getByRole('group', { name: `${variant} idiom` }))
      for (const button of idiom.getAllByRole('button')) {
        await expect(button).toHaveAttribute('data-variant', 'ghost')
        await expect(button).toHaveAttribute('data-segment', 'default')
        await expect(getComputedStyle(button).borderTopWidth).toBe('1px')
      }
    }
  },
}

// ─── States ───────────────────────────────────────────────────────────────────

export const InteractionStates: Story = {
  name: 'States',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Per group variant: default, hover, active and focused sub-rows for a three-segment group whose middle segment carries the state, plus a split button whose action carries it.',
          why: 'Hover and active are overlays derived from the ink, so a band whose ink was re-pointed to the label colour must hover white, not blue; the focus ring must sit inside the segment and, on a solid segment, take the label colour.',
          how: 'Compare the sub-rows: hover and active should tint only the middle segment, and the focused row should show a ring inside that segment, never clipped by the group.',
          caveat:
            'Hover and active use native pseudo-classes that cannot be triggered without real pointer events, so this story mirrors those rules onto scoped [data-hover] / [data-active] attributes. Focus is forced with the same outline utilities the segment applies under :focus.',
        }),
      },
    },
  },
  render: () => (
    <div className='force-state-grid w-full max-w-7xl space-y-3'>
      {/*
        Mirror the :hover / :active rules from Button onto [data-hover] /
        [data-active] so the rows below can paint their state without real
        pointer events. Scoped to this story container only.
      */}
      <style>{`
        .force-state-grid [data-hover]::after { background-color: var(--btn-hover-overlay); }
        .force-state-grid [data-active]::after { background-color: var(--btn-active-overlay); }
      `}</style>

      {variants.map((variant) => (
        <ThemeSurface key={`states-${variant}`} color='primary' className='p-3'>
          <div className='space-y-2'>
            {(['default', 'hover', 'active', 'focused'] as const).map((state) => {
              const stateProps =
                state === 'hover'
                  ? { 'data-hover': '' }
                  : state === 'active'
                    ? { 'data-active': '' }
                    : {}
              const focusClass = state === 'focused' ? forcedFocusClasses : undefined
              const solidFocusClass = state === 'focused' ? forcedSolidFocusClasses : undefined
              return (
                <div key={`${variant}-${state}`} className='flex flex-wrap items-center gap-4'>
                  <span
                    className={
                      state === 'default'
                        ? 'w-20 text-sm font-semibold text-foreground'
                        : 'w-20 text-xs text-muted-foreground'
                    }
                  >
                    {state === 'default' ? variant : state}
                  </span>
                  <ButtonGroup variant={variant} aria-label={`${variant} ${state}`}>
                    <Button>Copy</Button>
                    <Button className={focusClass} {...stateProps}>
                      Paste
                    </Button>
                    <Button>Cut</Button>
                  </ButtonGroup>
                  <ButtonGroup variant={variant}>
                    <Button variant='solid' className={solidFocusClass} {...stateProps}>
                      Save
                    </Button>
                    <Button
                      variant='solid'
                      iconOnly
                      aria-label='More save options'
                      leadingVisual={IconExpandMore}
                    />
                  </ButtonGroup>
                </div>
              )
            })}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  name: 'Disabled',
  parameters: {
    a11y: contrastRuleOff,
    docs: {
      description: {
        story: docsTemplate({
          what: 'Per colour and variant: a three-segment group with its middle segment disabled, and a split button with a disabled action.',
          why: 'A disabled segment fades itself, and a divider drawn on its own edge would fade with it. The boundary before a disabled segment is drawn on the segment before it instead, so every hairline in the row stays at one strength.',
          how: 'The two hairlines around the disabled segment should look identical to each other and to the rest of the row. The play asserts where each one is painted.',
          caveat: 'Low-contrast colours render on grey-800 surfaces so the frame stays visible.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-7xl space-y-3'>
      <MatrixHeader prefix='disabled' />
      {colors.map((color) => (
        <ThemeSurface key={`disabled-${color}`} color={color} className='p-3'>
          <div className={matrixGrid}>
            <span className={`text-sm font-semibold ${titleClasses(color)}`}>{color}</span>
            {variants.map((variant) => (
              <ButtonGroup
                key={`disabled-${color}-${variant}`}
                variant={variant}
                color={color}
                aria-label={`${color} ${variant} disabled`}
                className='justify-self-center'
              >
                <Button>Rest</Button>
                <Button disabled>Off</Button>
                <Button>After</Button>
              </ButtonGroup>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const group of canvas.getAllByRole('group')) {
      const inside = within(group)
      const rest = getComputedStyle(inside.getByRole('button', { name: 'Rest' }))
      const off = getComputedStyle(inside.getByRole('button', { name: 'Off' }))
      const after = getComputedStyle(inside.getByRole('button', { name: 'After' }))
      // The boundary before the disabled segment lives on the segment before
      // it; the disabled segment's own leading edge stays clear; the boundary
      // after it belongs to the next segment as usual.
      await expect(isPainted(rest.borderRightColor)).toBe(true)
      await expect(isPainted(off.borderLeftColor)).toBe(false)
      await expect(isPainted(after.borderLeftColor)).toBe(true)
    }
  },
}

// ─── Dark mode ────────────────────────────────────────────────────────────────

export const Dark: Story = {
  name: 'Dark',
  globals: { theme: 'dark' },
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The By Variant matrix and the Emphasis rows under the dark theme.',
          why: "The ink flips to the -200 step in dark mode while a solid fill stays at -800, so the frame, dividers and labels must follow the ink while the band keeps its fill. Button's dark hover overlay also grows 1px to cover its own border; in a group that pixel is the divider, so a segment keeps the overlay inside.",
          how: 'Frames and dividers should be pale, bands should stay dark blue with white labels, and nothing should be dark on dark. The play checks the overlay inset and the band label colour.',
          caveat:
            'Storybook applies the theme through the same class selector the package uses, so this is a faithful preview.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-8'>
      <ByVariantMatrix rowColors={themeColors} />
      <ThemeSurface color='primary' className='p-3'>
        <div className='flex flex-wrap items-center gap-4'>
          <ButtonGroup variant='solid' aria-label='band'>
            <Button>Day</Button>
            <Button variant='soft'>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button>Cancel</Button>
            <Button variant='solid'>Save and continue</Button>
          </ButtonGroup>
        </div>
      </ThemeSurface>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Button's dark-mode hover overlay grows 1px to cover its own border; in
    // a group that 1px is the divider, so a segment keeps the overlay inside.
    const [paste] = canvas.getAllByRole('button', { name: 'Paste' })
    const overlay = getComputedStyle(paste!, '::after')
    await expect(overlay.top).toBe('0px')
    await expect(overlay.left).toBe('0px')

    // The band's label colour still reaches its non-solid segments in dark.
    const solidLabel = getComputedStyle(
      canvas.getByRole('button', { name: 'Save and continue' }),
    ).color
    for (const segment of within(canvas.getByRole('group', { name: 'band' })).getAllByRole(
      'button',
    )) {
      await expect(getComputedStyle(segment).color).toBe(solidLabel)
    }
  },
}

// ─── Portals ──────────────────────────────────────────────────────────────────

export const InPortal: Story = {
  name: 'In a Popup',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'A split button whose chevron opens a Popover holding more Buttons.',
          why: "React context follows a portal, so without a reset the Buttons inside the popup would render as segments: squared, shadowless, ghost, and under a solid group inked white on the popup's surface. Every popup in the package resets the group at its portal.",
          how: 'Open the popup: its Buttons should look like ordinary Buttons with their own corners. The play opens it and asserts the Button inside carries no segment stamp.',
          caveat:
            'An overlay from another library opened from inside a group needs the same reset: wrap its contents in ButtonGroupBoundary.',
        }),
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button variant='solid'>Save</Button>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant='solid'
              iconOnly
              aria-label='More save options'
              leadingVisual={IconExpandMore}
            />
          }
        />
        <PopoverContent>
          <Button variant='soft' block>
            Save as draft
          </Button>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The trigger is a segment…
    const trigger = canvas.getByRole('button', { name: 'More save options' })
    await expect(trigger).toHaveAttribute('data-segment', 'override')
    await userEvent.click(trigger)
    // …but the Button inside the popup is not: the popup resets the group at
    // its portal, so it renders as an ordinary Button.
    const inside = await screen.findByRole('button', { name: 'Save as draft' })
    await expect(inside).not.toHaveAttribute('data-segment')
    await expect(inside).toHaveAttribute('data-variant', 'soft')
    await expect(getComputedStyle(inside).borderTopLeftRadius).not.toBe('0px')
  },
}
