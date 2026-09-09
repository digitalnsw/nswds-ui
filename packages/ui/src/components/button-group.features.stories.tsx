/**
 * ButtonGroup — Features
 *
 * Theme/variant matrices, emphasis, sizes, orientation, compositions, states,
 * and the rules a group promises.
 *
 * Every story that pins a RULE carries a play that fails when the rule is
 * removed. The two `By Variant` matrices are the exception and carry none on
 * purpose: they exist for visual review across the colour set, and every rule
 * they render is already pinned by a story that reads it directly, so a play
 * there would assert the same values twice.
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
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from './drawer.js'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.js'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu.js'
import { Popover, PopoverContent, PopoverTrigger } from './popover.js'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './sheet.js'

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

/** A Button's or group's resolved ink, which steps on a tint (see button.tsx). */
function inkOf(element: Element) {
  return getComputedStyle(element).getPropertyValue('--btn-bg').trim()
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
    docs: {
      description: {
        story: docsTemplate({
          what: 'Theme-first matrix limited to semantic colours (danger, success, warning): each row is a semantic colour and each column is a group variant.',
          why: 'Keeps status-conveying tokens together so their weight can be compared without the brand colours in view.',
          how: 'Scan each row and verify the meaning still reads across every treatment: a ghost danger group should still read as danger.',
          caveat:
            'Semantic colours use the 600 step for the frame, the solid band and the ghost labels; on the soft and surface bands success and warning step to the 700 ink (see styles.tintInk in button.tsx). No grey surface treatment is needed.',
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
            <ButtonGroup variant={variant} aria-label={`${variant} menu`}>
              <Button>Actions</Button>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      iconOnly
                      aria-label={`${variant} menu chevron`}
                      leadingVisual={IconExpandMore}
                    />
                  }
                />
                <PopoverContent>
                  <Button block>Archive</Button>
                </PopoverContent>
              </Popover>
            </ButtonGroup>
            <ButtonGroup variant={variant} aria-label={`${variant} split separated`}>
              <Button variant='solid'>Save</Button>
              <ButtonGroupSeparator />
              <Button
                variant='solid'
                iconOnly
                aria-label={`${variant} more save options separated`}
                leadingVisual={IconExpandMore}
              />
            </ButtonGroup>
          </div>
        </ThemeSurface>
      ))}
      <ThemeSurface color='primary' className='p-3'>
        <div className='flex flex-wrap items-center gap-4'>
          <span className='w-20 text-sm font-semibold text-foreground'>own colour</span>
          <ButtonGroup variant='solid' aria-label='solid own colour'>
            <Button>Day</Button>
            <Button color='secondary'>Own colour</Button>
            <Button variant='soft' color='white'>
              Soft white
            </Button>
          </ButtonGroup>
        </div>
      </ThemeSurface>
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
    // …and the seam survives a separator between the two.
    const separatedSeam = getComputedStyle(
      canvas.getByRole('button', { name: 'outline more save options separated' }),
    ).borderLeftColor
    await expect(separatedSeam).toBe(seam)

    // On a solid band every segment that is not itself solid takes the band's
    // label colour as its ink: a defaulted segment, a soft one, one that named
    // its own colour (whose own label colour must not leak in), and one
    // rendered through a trigger's `render` prop (which carries the trigger's
    // data-slot, so the rule cannot key on the DOM) all read in the same
    // colour as a solid segment's label.
    const solidLabel = getComputedStyle(canvas.getAllByRole('button', { name: 'Save' })[0]!).color
    for (const name of ['solid view', 'solid menu', 'solid own colour']) {
      const band = canvas.getByRole('group', { name })
      for (const segment of within(band).getAllByRole('button')) {
        await expect(getComputedStyle(segment).color).toBe(solidLabel)
      }
    }
    const trigger = within(canvas.getByRole('group', { name: 'solid menu' })).getByRole('button', {
      name: 'solid menu chevron',
    })
    await expect(trigger).toHaveAttribute('data-slot', 'popover-trigger')
    await expect(trigger).toHaveAttribute('data-band', 'solid')
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
          <ButtonGroup aria-label='Icon default group'>
            <Button>Default text</Button>
            <Button size='icon' aria-label='Default icon segment' leadingVisual={IconContentCopy} />
          </ButtonGroup>
          <ButtonGroup size='lg' aria-label='Icon lg group'>
            <Button>Large text</Button>
            <Button size='icon' aria-label='Large icon segment' leadingVisual={IconContentCopy} />
          </ButtonGroup>
          <ButtonGroup size={null} color={null} aria-label='Null props group'>
            <Button>Null props</Button>
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

    // `icon` is not a group step. A segment that asks for it renders as an
    // icon-only square at the GROUP's step, never the 40px chrome square,
    // which the group's clipping would rob of its 44px touch expansion.
    //
    // The comparison has to be against the segment BESIDE it, not against a
    // standalone Button of the step we expect: `styles.iconOnly` sets a
    // definite `size-(--btn-h)`, so `items-stretch` cannot correct a square
    // pinned to the wrong step, and a play that compares it to a lone button
    // passes at every step while the row itself is ragged. Checked at two
    // group steps, since a literal coercion matches exactly one of them.
    for (const [group, text, icon] of [
      ['Icon default group', 'Default text', 'Default icon segment'],
      ['Icon lg group', 'Large text', 'Large icon segment'],
    ] as const) {
      const row = within(canvas.getByRole('group', { name: group }))
      const textBox = row.getByRole('button', { name: text }).getBoundingClientRect()
      const iconBox = row.getByRole('button', { name: icon }).getBoundingClientRect()
      await expect(iconBox.height).toBe(textBox.height)
      await expect(iconBox.width).toBe(iconBox.height)
      await expect(iconBox.height).toBeGreaterThanOrEqual(44)
    }

    // `null` is admitted by both group props and means "unspecified", not
    // "no variant": an unnormalised null reaches cva and strips every size
    // and colour class from the group AND from each segment, leaving a
    // padding-less row and a frame pointing at an undefined token.
    const nullGroup = canvas.getByRole('group', { name: 'Null props group' })
    const nullSegment = canvas.getByRole('button', { name: 'Null props' })
    await expect(nullSegment.getBoundingClientRect().height).toBe(heightOf('Default segment'))
    await expect(isPainted(getComputedStyle(nullGroup).boxShadow)).toBe(true)
    await expect(getComputedStyle(nullSegment).getPropertyValue('--btn-bg').trim()).not.toBe('')
  },
}

// ─── Inherited colour ─────────────────────────────────────────────────────────

export const InheritedColour: Story = {
  name: 'Inherited Colour',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Per colour: a group whose segments inherit its colour, next to one segment naming its own, a lone Button of the same colour as the reference, and the same pair of segments on a soft band.',
          why: "A group's colour is every segment's default, and a segment that names its own colour must keep it — on a tinted band too, where the segments step their own colour's ink rather than taking the band's. Both were silent before this story existed: a group that stopped passing its colour down still rendered, in primary.",
          how: 'The inheriting segment should match the lone reference exactly; the overriding segment should not. On the soft band the inheriting segment should read in the band ink and the overriding one in its own. The play compares the resolved fill token of each, and the ink on the band.',
          caveat:
            'The fill comparison is on the `--btn-fill` custom property, which every colour token sets, so it holds in both light and dark mode. The ink comparison is on `--btn-bg`, which the accent band steps to accent-700.',
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
            <ButtonGroup variant='soft' color={color} aria-label={`${color} soft group`}>
              <Button>On tint</Button>
              <Button color='primary'>Own colour on tint</Button>
            </ButtonGroup>
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const references = canvas.getAllByRole('button', { name: 'Reference' })
    for (const [index, color] of (['danger', 'accent', 'grey'] as const).entries()) {
      const reference = fillOf(references[index]!)
      const inside = within(canvas.getByRole('group', { name: `${color} group` }))
      await expect(fillOf(inside.getByRole('button', { name: 'Inherits' }))).toBe(reference)
      await expect(fillOf(inside.getByRole('button', { name: 'Own colour' }))).not.toBe(reference)

      // On a soft band the inheriting segment reads in the band's ink — for
      // accent that is the stepped accent-700, not the -600 the frame draws
      // in — and a segment naming its own colour keeps that colour's ink.
      const band = canvas.getByRole('group', { name: `${color} soft group` })
      const onBand = within(band)
      const onTint = onBand.getByRole('button', { name: 'On tint' })
      const ownColour = onBand.getByRole('button', { name: 'Own colour on tint' })
      await expect(fillOf(onTint)).toBe(reference)
      await expect(inkOf(onTint)).toBe(inkOf(band))
      await expect(inkOf(ownColour)).not.toBe(inkOf(band))
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
            <div dir='rtl'>
              <ButtonGroup variant={variant} aria-label={`${variant} rtl`}>
                <Button>First</Button>
                <Button>Second</Button>
              </ButtonGroup>
            </div>
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

      // The dividers pair LOGICAL properties (border-s/border-e) with
      // DOM-ORDER combinators (~, +), so right-to-left is the case where a
      // physical property would betray them: the second segment's hairline
      // must move to its RIGHT edge, the inline start in this direction, and
      // the segment itself must sit left of the first.
      const rtl = within(canvas.getByRole('group', { name: `${variant} rtl` }))
      const rtlFirst = rtl.getByRole('button', { name: 'First' })
      const rtlSecond = rtl.getByRole('button', { name: 'Second' })
      const rtlSecondStyles = getComputedStyle(rtlSecond)
      await expect(isPainted(rtlSecondStyles.borderRightColor)).toBe(true)
      await expect(isPainted(rtlSecondStyles.borderLeftColor)).toBe(false)
      await expect(rtlSecond.getBoundingClientRect().left).toBeLessThan(
        rtlFirst.getBoundingClientRect().left,
      )
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
              <Button variant='surface'>Undo</Button>
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
                  <ButtonGroup variant={variant} aria-label={`${variant} ${state} split`}>
                    <Button variant='solid' className={solidFocusClass} {...stateProps}>
                      Save
                    </Button>
                    <Button
                      variant='solid'
                      iconOnly
                      aria-label={`${variant} ${state} more save options`}
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pressOverlay = (element: Element) => getComputedStyle(element, '::after').backgroundColor

    // A segment on a solid band presses like the solid segment beside it:
    // black at 15%, the pair `solid` uses, so a band and a lone solid Button
    // give the same feedback.
    //
    // This is the assertion the rule needs, and it is not the same as the ink
    // assertions elsewhere. Both rules key on the same selector, but deleting
    // only the overlay one leaves the ink re-point in place, so the press
    // falls through to the DERIVED overlay — which reads the re-pointed ink
    // and lands on the label colour at 20%. A press that lightens a white
    // label's segment instead of darkening it, and every colour assertion in
    // this folder still passes.
    const band = within(canvas.getByRole('group', { name: 'solid active' }))
    const pressedSegment = pressOverlay(band.getByRole('button', { name: 'Paste' }))
    const pressedSolid = pressOverlay(
      within(canvas.getByRole('group', { name: 'solid active split' })).getByRole('button', {
        name: 'Save',
      }),
    )
    await expect(pressedSegment).toBe(pressedSolid)
    // Named rather than merely equal: both are black, not the band's white.
    await expect(toRgb(pressedSegment)).toBe('rgb(0, 0, 0)')
    await expect(alphaOf(pressedSegment)).toBeCloseTo(0.15, 2)

    // And the rule is scoped to the band: off a solid band the same segment
    // keeps Button's derived overlay, the ink at 20%.
    const framed = within(canvas.getByRole('group', { name: 'outline active' }))
    const pressedFramed = pressOverlay(framed.getByRole('button', { name: 'Paste' }))
    await expect(pressedFramed).not.toBe(pressedSegment)
    await expect(alphaOf(pressedFramed)).toBeCloseTo(0.2, 2)
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Per colour and variant: a three-segment group with its middle segment disabled, and a split button with a disabled action.',
          why: 'A disabled segment fades itself, and a divider drawn on its own edge would fade with it. The boundary before a disabled segment is drawn on the segment before it instead, so a single disabled segment leaves no weak hairline beside an enabled one. Between two ADJACENT disabled segments the shared boundary has no enabled edge to move to, so it fades with the pair it divides.',
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
      <ThemeSurface color='primary' className='p-3'>
        <div className='flex flex-wrap items-center gap-4'>
          <span className='w-20 text-sm font-semibold text-foreground'>separated</span>
          {variants.map((variant) => (
            <ButtonGroup
              key={`separated-${variant}`}
              variant={variant}
              aria-label={`${variant} separated disabled`}
            >
              <Button>Rest</Button>
              <ButtonGroupSeparator />
              <Button disabled>Off</Button>
              <Button>After</Button>
            </ButtonGroup>
          ))}
          <ButtonGroup aria-label='separated disabled seam'>
            <Button variant='solid'>Save</Button>
            <ButtonGroupSeparator />
            <Button
              variant='solid'
              disabled
              iconOnly
              aria-label='Disabled save options'
              leadingVisual={IconExpandMore}
            />
          </ButtonGroup>
          <ButtonGroup orientation='vertical' aria-label='vertical separated column'>
            <Button>Rest</Button>
            <ButtonGroupSeparator />
            <Button disabled>Off</Button>
            <Button>After</Button>
          </ButtonGroup>
          <ButtonGroup orientation='vertical' aria-label='vertical separated seam'>
            <Button variant='solid'>Save</Button>
            <ButtonGroupSeparator />
            <Button variant='solid' disabled>
              Later
            </Button>
          </ButtonGroup>
          <ButtonGroup aria-label='adjacent disabled run'>
            <Button>Rest</Button>
            <Button disabled>Off</Button>
            <Button disabled>Also off</Button>
            <Button>After</Button>
          </ButtonGroup>
        </div>
      </ThemeSurface>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A separator between two solid segments does not lose the seam when the
    // second is disabled: it moves to the first segment's trailing edge, in
    // the label colour, not the ink.
    const seamGroup = within(canvas.getByRole('group', { name: 'separated disabled seam' }))
    const seam = getComputedStyle(seamGroup.getByRole('button', { name: 'Save' })).borderRightColor
    // The label colour at 30%, not the opaque ink the general divider would
    // paint — so deleting the seam rule and falling through to the divider
    // fails here rather than passing on "something is painted".
    await expect(isPainted(seam)).toBe(true)
    await expect(alphaOf(seam)).toBeCloseTo(0.3, 2)
    await expect(toRgb(seam)).toBe(
      toRgb(getComputedStyle(seamGroup.getByRole('button', { name: 'Save' })).color),
    )
    await expect(
      isPainted(
        getComputedStyle(seamGroup.getByRole('button', { name: 'Disabled save options' }))
          .borderLeftColor,
      ),
    ).toBe(false)

    // The same two rules on the vertical axis, which the row cases cannot
    // reach: the boundary moves to the bottom edge of the segment before.
    const column = within(canvas.getByRole('group', { name: 'vertical separated column' }))
    const columnRest = getComputedStyle(column.getByRole('button', { name: 'Rest' }))
    await expect(isPainted(columnRest.borderBottomColor)).toBe(true)
    await expect(isPainted(columnRest.borderRightColor)).toBe(false)
    await expect(
      isPainted(getComputedStyle(column.getByRole('button', { name: 'Off' })).borderTopColor),
    ).toBe(false)
    const columnSeam = getComputedStyle(
      within(canvas.getByRole('group', { name: 'vertical separated seam' })).getByRole('button', {
        name: 'Save',
      }),
    )
    await expect(alphaOf(columnSeam.borderBottomColor)).toBeCloseTo(0.3, 2)
    await expect(toRgb(columnSeam.borderBottomColor)).toBe(toRgb(columnSeam.color))

    // Two disabled segments in a row. Each boundary still has exactly one
    // painted edge and never two, and the boundary INSIDE the disabled run
    // sits on a disabled element — the one hairline the trailing-edge rule
    // cannot lift out of the fade, which the group's comment documents. This
    // fails in both directions: adding `:not([data-disabled])` to the
    // fallback rule would leave that boundary with no painted edge at all.
    const run = within(canvas.getByRole('group', { name: 'adjacent disabled run' }))
    const runRest = getComputedStyle(run.getByRole('button', { name: 'Rest' }))
    const runOff = run.getByRole('button', { name: 'Off' })
    const runAlsoOff = run.getByRole('button', { name: 'Also off' })
    const runAfter = getComputedStyle(run.getByRole('button', { name: 'After' }))
    await expect(isPainted(runRest.borderRightColor)).toBe(true)
    await expect(isPainted(getComputedStyle(runOff).borderLeftColor)).toBe(false)
    await expect(isPainted(getComputedStyle(runOff).borderRightColor)).toBe(true)
    await expect(runOff).toHaveAttribute('data-disabled')
    await expect(isPainted(getComputedStyle(runAlsoOff).borderLeftColor)).toBe(false)
    await expect(isPainted(runAfter.borderLeftColor)).toBe(true)

    // Horizontal groups only: the two vertical cases above read block edges,
    // and their names are outside this filter so they cannot fall in here.
    for (const group of canvas.getAllByRole('group', { name: /disabled$/ })) {
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
          what: 'The By Variant matrix for every colour token, and the Emphasis rows, under the dark theme.',
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
      <ByVariantMatrix rowColors={colors} />
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

// ─── Overlays ─────────────────────────────────────────────────────────────────

export const InOverlays: Story = {
  name: 'In Overlays',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Segments that open a Sheet, a Drawer, a HoverCard and a NavigationMenu panel, each holding a Button or ButtonLink.',
          why: 'Every popup in the package resets the group context at its portal. Popover is pinned by the In a Popup story; this one pins the other overlays a segment is likely to open, since a Sheet even brings its own close Button.',
          how: 'Open each overlay from its segment: the Buttons inside should look like ordinary Buttons with their own corners. The play opens each one and asserts the Button inside carries no segment stamp.',
          caveat:
            'Select, Combobox and SiteSearch carry the same boundary but cannot be exercised this way — SiteSearch renders no Button inside its portal and exposes no slot to inject one, and the Select and Combobox popups take their own item components rather than arbitrary children. `check:portal-boundary` covers all nine at the source level, including those three and any portal added later.',
        }),
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Sheet>
        <SheetTrigger render={<Button>Open sheet</Button>} />
        <SheetContent>
          <SheetTitle>A sheet</SheetTitle>
          <Button>Inside sheet</Button>
        </SheetContent>
      </Sheet>
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>A drawer</DrawerTitle>
          <Button>Inside drawer</Button>
        </DrawerContent>
      </Drawer>
      <HoverCard>
        <HoverCardTrigger render={<Button>Hover card</Button>} />
        <HoverCardContent>
          <Button>Inside card</Button>
        </HoverCardContent>
      </HoverCard>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Open menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ButtonLink href='#panel'>Inside menu</ButtonLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Every trigger is a segment…
    for (const name of ['Open sheet', 'Open drawer', 'Hover card']) {
      await expect(canvas.getByRole('button', { name })).toHaveAttribute('data-segment', 'default')
    }

    // …and nothing inside the overlays is.
    await userEvent.click(canvas.getByRole('button', { name: 'Open sheet' }))
    const inSheet = await screen.findByRole('button', { name: 'Inside sheet' }, { timeout: 3000 })
    await expect(inSheet).not.toHaveAttribute('data-segment')
    await expect(getComputedStyle(inSheet).borderTopLeftRadius).not.toBe('0px')
    await userEvent.keyboard('{Escape}')

    await userEvent.click(canvas.getByRole('button', { name: 'Open drawer' }))
    const inDrawer = await screen.findByRole('button', { name: 'Inside drawer' }, { timeout: 3000 })
    await expect(inDrawer).not.toHaveAttribute('data-segment')
    await userEvent.keyboard('{Escape}')

    await userEvent.hover(canvas.getByRole('button', { name: 'Hover card' }))
    const inCard = await screen.findByRole('button', { name: 'Inside card' }, { timeout: 3000 })
    await expect(inCard).not.toHaveAttribute('data-segment')

    // A NavigationMenu panel is the likeliest of the five to hold something
    // interactive in real markup, and a ButtonLink checks the boundary
    // reaches the anchor path as well as the button one.
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }))
    const inMenu = await screen.findByRole('link', { name: 'Inside menu' }, { timeout: 3000 })
    await expect(inMenu).not.toHaveAttribute('data-segment')
    await expect(getComputedStyle(inMenu).borderTopLeftRadius).not.toBe('0px')
    // Close it before the story settles, as the sheet and drawer cases do.
    // Base UI holds a focus trap open with `aria-hidden` `tabindex=0`
    // sentinels, which the axe run at the end of every story reports as
    // `aria-hidden-focus` — a real rule, firing on the primitive's own
    // focus-guard technique rather than on anything this component does.
    await userEvent.keyboard('{Escape}')
  },
}

// ─── Paint contract ───────────────────────────────────────────────────────────

/**
 * Normalises any CSS colour to `rgb(r, g, b)`, alpha discarded, by PAINTING it
 * and reading the pixel back. Assigning to `fillStyle` and reading it again is
 * not enough: the token colours here are `oklch()` / `oklab()`, and the getter
 * returns those verbatim, so a string comparison ends up matching lightness
 * and hue against red and green channels. Painting forces the conversion the
 * screen would do. Alpha is dropped so a translucent divider can be compared
 * with an opaque token; `alphaOf` reads the alpha separately.
 */
function toRgb(color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('No 2D canvas context to normalise colours with.')
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const [r = 0, g = 0, b = 0] = context.getImageData(0, 0, 1, 1).data
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * The alpha channel of a computed colour: the trailing number of an `rgba()`
 * or the value after the slash in a colour-space form (`oklab(… / 0.3)`, which
 * is what a `color-mix()` divider computes to); 1 when there is none.
 */
function alphaOf(color: string) {
  const match = /[\s,/]([\d.]+)\)$/.exec(color)
  return match && (color.includes('/') || color.startsWith('rgba')) ? Number(match[1]) : 1
}

export const PaintContract: Story = {
  name: 'Paint Contract',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'One group per variant with two ghost segments and a solid one, beside a lone solid Button, read back through computed styles.',
          why: 'What each variant paints is a contract: the outline and surface frames are inset rings, the solid band is the fill token, the soft and surface bands are the ink at 10% and 5%, ghost paints nothing, the group clips its corners, a segment drops its shadow, a solid segment stops its background at the padding box only where a frame sits beneath it, and the divider is the ink. None of these read from a screenshot in CI, so the play reads them.',
          how: 'Nothing to look at beyond the five groups; the play is the check.',
          caveat:
            'Colours are normalised through a canvas so oklch tokens compare as rgb. Light mode only; the Dark story covers the ink flip.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      {variants.map((variant) => (
        <ButtonGroup key={variant} variant={variant} aria-label={`${variant} paint`}>
          <Button>Copy</Button>
          <Button>Paste</Button>
          <ButtonGroupText>Aa</ButtonGroupText>
          <Button variant='solid'>Save</Button>
        </ButtonGroup>
      ))}
      <Button variant='solid'>Reference</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const reference = getComputedStyle(canvas.getByRole('button', { name: 'Reference' }))
    const fill = toRgb(reference.getPropertyValue('--btn-fill').trim())
    const ink = toRgb(reference.getPropertyValue('--btn-bg').trim())
    const label = toRgb(reference.getPropertyValue('--btn-text').trim())

    for (const variant of variants) {
      const group = canvas.getByRole('group', { name: `${variant} paint` })
      const styles = getComputedStyle(group)
      const inside = within(group)
      const paste = getComputedStyle(inside.getByRole('button', { name: 'Paste' }))
      const save = inside.getByRole('button', { name: 'Save' })

      // The group clips to its own corners.
      await expect(styles.overflow).toBe('hidden')

      // What the band paints.
      const framed = variant === 'outline' || variant === 'surface'
      await expect(styles.boxShadow !== 'none').toBe(framed)
      if (variant === 'solid') {
        await expect(toRgb(styles.backgroundColor)).toBe(fill)
      } else if (variant === 'soft') {
        await expect(alphaOf(styles.backgroundColor)).toBeCloseTo(0.1, 2)
      } else if (variant === 'surface') {
        await expect(alphaOf(styles.backgroundColor)).toBeCloseTo(0.05, 2)
      } else {
        await expect(isPainted(styles.backgroundColor)).toBe(false)
      }

      // The divider is the ink on a frame or on nothing, the ink at 30% on
      // a soft band, the ink at 50% inside a surface frame, and the label
      // colour at 30% on a solid band.
      const divider = paste.borderLeftColor
      if (variant === 'outline' || variant === 'ghost') {
        await expect(toRgb(divider)).toBe(ink)
      } else if (variant === 'soft') {
        await expect(alphaOf(divider)).toBeCloseTo(0.3, 2)
      } else if (variant === 'surface') {
        await expect(alphaOf(divider)).toBeCloseTo(0.5, 2)
      } else {
        // The label colour at 30%, not the ink at 30% — compared with the
        // alpha stripped, since an `rgba()` string never equals an opaque hex
        // whatever the channels are.
        await expect(alphaOf(divider)).toBeCloseTo(0.3, 2)
        await expect(toRgb(divider)).toBe(label)
        await expect(toRgb(divider)).not.toBe(ink)
      }

      // The text cell must never cover the inset ring on a framed band, and
      // there are two ways it does not: on `outline` it keeps its sunken
      // background and stops it at the padding box, so the ring shows through
      // its transparent border; on `surface` (and the two unframed bands) it
      // has no background at all. `ghost` has no ring to protect, so it keeps
      // the sunken background out to the border box.
      const cell = group.querySelector<HTMLElement>('[data-slot="button-group-text"]')
      if (!cell) throw new Error(`No text cell in the ${variant} group.`)
      const cellStyles = getComputedStyle(cell)
      if (variant === 'outline') {
        await expect(isPainted(cellStyles.backgroundColor)).toBe(true)
        await expect(cellStyles.backgroundClip).toBe('padding-box')
      } else if (variant === 'ghost') {
        await expect(isPainted(cellStyles.backgroundColor)).toBe(true)
      } else {
        await expect(isPainted(cellStyles.backgroundColor)).toBe(false)
      }

      // A segment drops its shadow, and a solid segment stops its background
      // at the padding box only where a frame sits beneath it.
      // `shadow-none` computes as transparent shadow parts, not `none`.
      await expect(getComputedStyle(save, '::before').boxShadow).not.toMatch(
        /rgba?\((?!0, 0, 0, 0\))/,
      )
      await expect(getComputedStyle(save).backgroundClip).toBe(
        framed ? 'padding-box' : 'border-box',
      )
    }
  },
}

// ─── Segment props ────────────────────────────────────────────────────────────

export const SegmentProps: Story = {
  name: 'Segment Props',
  parameters: {
    docs: {
      description: {
        story:
          'Button props whose meaning the group changes or constrains: `loading`, `block`, `alignContent`, `labelWrap`, `count`, and an explicit `iconOnly={false}` beside the `icon` coercion. Also a group handed `data-orientation` through its props spread.',
        // The four/five-part template does not fit a story that is a list of
        // independent props; each assertion carries its own reasoning inline.
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-4'>
      <ButtonGroup aria-label='Busy'>
        <Button>Rest</Button>
        <Button loading>Saving</Button>
        <Button>After</Button>
      </ButtonGroup>
      <ButtonGroup className='w-96' aria-label='Block'>
        <Button block>Fills the group</Button>
      </ButtonGroup>
      <ButtonGroup className='w-96' aria-label='Aligned'>
        <Button block alignContent='start'>
          Aligned to the start
        </Button>
      </ButtonGroup>
      <ButtonGroup className='w-40' aria-label='Wrapping'>
        <Button labelWrap={false}>A label too long to fit</Button>
      </ButtonGroup>
      <ButtonGroup aria-label='Counted'>
        <Button count={3} countLabel='unread'>
          Messages
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label='Icon override'>
        <Button
          size='icon'
          iconOnly={false}
          aria-label='Not a square'
          leadingVisual={IconContentCopy}
        />
      </ButtonGroup>
      <ButtonGroup data-orientation='vertical' aria-label='Spread override'>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // `loading` sets `disabled`, so a busy segment joins the disabled divider
    // contract: its own leading edge stays clear and the boundary moves to
    // the segment before it. The hairline therefore shifts by one pixel when
    // a request starts. That is the contract holding, not breaking — the
    // alternative is a half-strength hairline beside an enabled control for
    // as long as the request runs — but it is worth pinning, since nothing
    // else in the folder renders a busy segment.
    const busy = within(canvas.getByRole('group', { name: 'Busy' }))
    const saving = busy.getByRole('button', { name: /Saving/ })
    await expect(saving).toHaveAttribute('aria-busy', 'true')
    await expect(saving).toHaveAttribute('data-disabled')
    await expect(saving).toHaveAttribute('data-segment', 'default')
    await expect(
      isPainted(getComputedStyle(busy.getByRole('button', { name: 'Rest' })).borderRightColor),
    ).toBe(true)
    await expect(isPainted(getComputedStyle(saving).borderLeftColor)).toBe(false)

    // `block` still fills, despite the group being `inline-flex w-fit`: the
    // group takes the width its own className gives it and the segment fills
    // that, rather than the segment collapsing to its content.
    const blockGroup = canvas.getByRole('group', { name: 'Block' })
    const blockSegment = canvas.getByRole('button', { name: 'Fills the group' })
    await expect(blockSegment.getBoundingClientRect().width).toBeCloseTo(
      blockGroup.getBoundingClientRect().width,
      0,
    )

    // `alignContent` still reaches the segment's own flex line.
    await expect(
      getComputedStyle(canvas.getByRole('button', { name: 'Aligned to the start' })).justifyContent,
    ).toBe('flex-start')

    // `labelWrap={false}` wraps the label in a nowrap span, which the group's
    // `items-stretch` and clipping must not undo.
    const wrapping = canvas.getByRole('button', { name: 'A label too long to fit' })
    const label = [...wrapping.querySelectorAll('span')].find(
      (node) => node.textContent === 'A label too long to fit',
    )
    await expect(label).toBeDefined()
    await expect(getComputedStyle(label!).whiteSpace).toBe('nowrap')

    // `count` renders its badge and its screen-reader label inside a segment.
    const counted = canvas.getByRole('button', { name: /Messages/ })
    await expect(counted.textContent).toContain('3')
    await expect(counted.textContent).toContain('unread')

    // An explicit `iconOnly={false}` outranks the `icon` coercion, so the
    // segment keeps its padding and is not square.
    const notSquare = canvas.getByRole('button', { name: 'Not a square' }).getBoundingClientRect()
    await expect(notSquare.width).toBeGreaterThan(notSquare.height)

    // `data-orientation` is stamped after the props spread, so a consumer
    // cannot desync the attribute every divider rule keys on from the flex
    // direction, which comes from the cva variant and is out of a prop's
    // reach. Passing `vertical` to a row group leaves both saying row.
    const spread = canvas.getByRole('group', { name: 'Spread override' })
    await expect(spread).toHaveAttribute('data-orientation', 'horizontal')
    await expect(getComputedStyle(spread).flexDirection).toBe('row')
  },
}
