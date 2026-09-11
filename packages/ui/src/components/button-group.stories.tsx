/**
 * ButtonGroup — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/ButtonGroup/Features        → button-group.features.stories.tsx
 *   Components/ButtonGroup/Accessibility   → button-group.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { cn } from '../lib/utils.js'

import {
  IconContentCopy,
  IconContentCut,
  IconContentPaste,
  IconExpandMore,
  IconFormatBold,
  IconFormatItalic,
} from '../icons/index.js'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  type ButtonGroupVariant,
} from './button-group.js'
import { Button, ButtonLink } from './button.js'
import { Popover, PopoverContent, PopoverTrigger } from './popover.js'

const variants = [
  'outline',
  'solid',
  'soft',
  'surface',
  'ghost',
] as const satisfies readonly ButtonGroupVariant[]
const orientations = ['horizontal', 'vertical'] as const
const sizes = ['sm', 'default', 'lg'] as const
const colors = [
  'white',
  'grey',
  'primary',
  'secondary',
  'tertiary',
  'accent',
  'danger',
  'success',
  'warning',
] as const

// Colour groupings used by the docs page — the same three roles Button
// documents, because a group's `color` is Button's `color`.
const brandColors = ['primary', 'tertiary', 'accent', 'grey'] as const
const onDarkColors = ['white', 'secondary'] as const
const semanticColors = ['danger', 'success', 'warning'] as const

// The group treatments shown in each colour row of the colour matrix.
const matrixVariants = ['outline', 'solid', 'soft', 'surface'] as const

const variantDocs: ReadonlyArray<readonly [(typeof variants)[number], string]> = [
  ['outline', 'Default — a 1px hairline frame in the ink, ghost segments inside.'],
  ['solid', 'High emphasis — the fill band; every segment reads as a primary.'],
  ['soft', 'Medium emphasis — the ink at 10% as a band, no frame.'],
  ['surface', 'Medium emphasis — the ink at 5% inside an ink/50 hairline.'],
  ['ghost', 'Low emphasis — no frame, no fill; only the hairlines between segments.'],
]

// ─── Docs page building blocks ──────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className='space-y-5'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
        {description ? (
          <p className='max-w-2xl text-sm leading-relaxed text-muted-foreground'>{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

// A neutral, generously padded surface that frames live examples and gives
// each section plenty of breathing room.
function Preview({
  children,
  dark = false,
  className,
}: {
  children: React.ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-8',
        dark ? 'border-transparent bg-primary' : 'border-border bg-muted/40',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='flex min-h-12 items-center'>{children}</div>
      <span className='text-xs font-medium tracking-wide text-muted-foreground'>{label}</span>
    </div>
  )
}

// One row of the colour matrix: a colour name followed by a two-segment group
// in that colour across the key group treatments.
function ColorRow({ color, dark = false }: { color: (typeof colors)[number]; dark?: boolean }) {
  return (
    <div className='flex flex-wrap items-center gap-3 py-1'>
      <span
        className={cn(
          'w-20 shrink-0 text-sm font-semibold',
          dark ? 'text-primary-foreground' : 'text-foreground',
        )}
      >
        {color}
      </span>
      {matrixVariants.map((variant) => (
        <ButtonGroup
          key={variant}
          color={color}
          variant={variant}
          aria-label={`${color} ${variant}`}
        >
          <Button>Copy</Button>
          <Button>Paste</Button>
        </ButtonGroup>
      ))}
    </div>
  )
}

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        // `sb-unstyled` opts these anchors out of Storybook's docs stylesheet —
        // see the same note on Button's docs page.
        <div className='sb-unstyled max-w-4xl space-y-16 py-2 text-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_code]:font-medium [&_code]:text-foreground'>
          {/* Intro */}
          <section className='space-y-4'>
            <h1 className='text-5xl font-bold tracking-tight'>ButtonGroup</h1>
            <p className='max-w-2xl text-lg leading-relaxed text-muted-foreground'>
              A group joins a row or column of Buttons into one control. The group draws the
              boundary — the frame or band, the hairline between segments, the corners — and takes
              Button&apos;s <strong className='font-semibold text-foreground'>variant</strong>{' '}
              family, <strong className='font-semibold text-foreground'>colour</strong> tokens and{' '}
              <strong className='font-semibold text-foreground'>size</strong> steps, handing them to
              its segments as defaults. A segment is an ordinary Button.
            </p>
          </section>

          {/* Default */}
          <Section
            title='Default'
            description='An outline group of ghost segments in the primary colour — the out-of-the-box configuration.'
          >
            <Preview className='flex items-center'>
              <ButtonGroup aria-label='Clipboard'>
                <Button>Copy</Button>
                <Button>Paste</Button>
                <Button>Cut</Button>
              </ButtonGroup>
            </Preview>
          </Section>

          {/* Variants */}
          <Section
            title='Variants'
            description="The variant is the group's: it decides the frame or band every segment sits in. Segments stay ghost, so the group paints once and the labels sit on top."
          >
            <Preview>
              <div className='flex flex-wrap items-center gap-8'>
                {variants.map((variant) => (
                  <Cell key={variant} label={variant}>
                    <ButtonGroup variant={variant} aria-label={`${variant} clipboard`}>
                      <Button>Copy</Button>
                      <Button>Paste</Button>
                      <Button>Cut</Button>
                    </ButtonGroup>
                  </Cell>
                ))}
              </div>
            </Preview>
            <dl className='grid gap-x-8 gap-y-3 sm:grid-cols-2'>
              {variantDocs.map(([name, desc]) => (
                <div key={name} className='flex gap-3 text-sm'>
                  <dt className='w-16 shrink-0 font-semibold'>{name}</dt>
                  <dd className='text-muted-foreground'>{desc}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* Emphasis */}
          <Section
            title='Emphasis'
            description={
              <>
                A segment may name its own emphasis. A <code>solid</code> or <code>soft</code> child
                paints its own fill inside the group, which is how a Save sits beside a ghost Cancel
                as the row&apos;s primary action, and how a split button pairs an action with its
                menu. Two solid segments divide with a reversed hairline. Any other child variant —{' '}
                <code>outline</code>, <code>ghost</code>, <code>link</code> — renders as a plain
                segment, so the shadcn idiom of writing <code>variant=&apos;outline&apos;</code> on
                every child draws no second border.
              </>
            }
          >
            <Preview>
              <div className='flex flex-wrap items-center gap-8'>
                <Cell label='primary action'>
                  <ButtonGroup>
                    <Button>Cancel</Button>
                    <Button variant='solid'>Save and continue</Button>
                  </ButtonGroup>
                </Cell>
                <Cell label='split button'>
                  <ButtonGroup>
                    <Button variant='solid'>Save</Button>
                    <Button
                      variant='solid'
                      iconOnly
                      aria-label='More save options'
                      leadingVisual={IconExpandMore}
                    />
                  </ButtonGroup>
                </Cell>
                <Cell label='soft segment'>
                  <ButtonGroup aria-label='View'>
                    <Button>Day</Button>
                    <Button variant='soft'>Week</Button>
                    <Button>Month</Button>
                  </ButtonGroup>
                </Cell>
                <Cell label='on a band'>
                  <ButtonGroup variant='solid' aria-label='View'>
                    <Button>Day</Button>
                    <Button variant='soft'>Week</Button>
                    <Button>Month</Button>
                  </ButtonGroup>
                </Cell>
              </div>
            </Preview>
          </Section>

          {/* Sizes */}
          <Section
            title='Sizes'
            description={
              <>
                Button&apos;s three scale steps — <code>sm</code>, <code>default</code>,{' '}
                <code>lg</code> — as the default for every segment. A group is exactly as tall as
                the lone Button beside it: the frame is drawn inside the box, not around it.{' '}
                <code>icon</code> is not offered, because the group clips to its own box and would
                cut off the 44px touch expansion the 40px chrome square relies on; pair{' '}
                <code>iconOnly</code> with <code>sm</code> instead.
              </>
            }
          >
            <Preview>
              <div className='flex flex-wrap items-end gap-8'>
                {sizes.map((size) => (
                  <Cell key={size} label={size}>
                    <ButtonGroup size={size} aria-label={`${size} clipboard`}>
                      <Button>Copy</Button>
                      <Button>Paste</Button>
                    </ButtonGroup>
                  </Cell>
                ))}
                <Cell label='iconOnly, sm'>
                  <ButtonGroup size='sm' aria-label='Clipboard'>
                    <Button iconOnly aria-label='Copy' leadingVisual={IconContentCopy} />
                    <Button iconOnly aria-label='Paste' leadingVisual={IconContentPaste} />
                    <Button iconOnly aria-label='Cut' leadingVisual={IconContentCut} />
                  </ButtonGroup>
                </Cell>
              </div>
            </Preview>
          </Section>

          {/* Colours */}
          <Section
            title='Colours'
            description="The colour prop is Button's: it sets the ink the frame, band and dividers are drawn in, and the default colour of every segment. Shown here across the main group treatments."
          >
            <div className='space-y-10'>
              <div className='space-y-4'>
                <div className='space-y-1'>
                  <h3 className='text-lg font-semibold'>Brand colours</h3>
                  <p className='max-w-2xl text-sm leading-relaxed text-muted-foreground'>
                    Drawn from the active masterbrand theme. Use <code>primary</code> for a group of
                    main actions; <code>tertiary</code> and <code>accent</code> for supporting ones;{' '}
                    <code>grey</code> for a neutral toolbar.
                  </p>
                </div>
                <Preview className='space-y-3'>
                  {brandColors.map((color) => (
                    <ColorRow key={color} color={color} />
                  ))}
                </Preview>
              </div>

              <div className='space-y-4'>
                <div className='space-y-1'>
                  <h3 className='text-lg font-semibold'>On dark surfaces</h3>
                  <p className='max-w-2xl text-sm leading-relaxed text-muted-foreground'>
                    Theme colours designed to sit on coloured or dark backgrounds. The outline group
                    draws no fill of its own, so a <code>white</code> frame on a primary panel stays
                    a frame. Shown here on a primary background.
                  </p>
                </div>
                <Preview dark className='space-y-3'>
                  {onDarkColors.map((color) => (
                    <ColorRow key={color} color={color} dark />
                  ))}
                </Preview>
              </div>

              <div className='space-y-4'>
                <div className='space-y-1'>
                  <h3 className='text-lg font-semibold'>Semantic colours</h3>
                  <p className='max-w-2xl text-sm leading-relaxed text-muted-foreground'>
                    Fixed meanings that stay constant across themes. A <code>danger</code> split
                    button is the common case: Delete, with its options under the chevron.
                  </p>
                </div>
                <Preview className='space-y-3'>
                  {semanticColors.map((color) => (
                    <ColorRow key={color} color={color} />
                  ))}
                </Preview>
              </div>
            </div>
          </Section>

          {/* Orientation */}
          <Section
            title='Orientation'
            description='The same rules rotated. A vertical group stacks its segments and moves the hairline to the top edge of each one.'
          >
            <Preview>
              <div className='flex flex-wrap items-start gap-8'>
                {orientations.map((orientation) => (
                  <Cell key={orientation} label={orientation}>
                    <ButtonGroup orientation={orientation} aria-label={`${orientation} group`}>
                      <Button>Top</Button>
                      <Button>Middle</Button>
                      <Button>Bottom</Button>
                    </ButtonGroup>
                  </Cell>
                ))}
              </div>
            </Preview>
          </Section>

          {/* Inline text and separators */}
          <Section
            title='Inline text and separators'
            description={
              <>
                <code>ButtonGroupText</code> is an inline label between segments — a unit, a count,
                a mode — at the body size, never fine print. <code>ButtonGroupSeparator</code> is a
                semantic boundary for assistive technology; every segment is already divided by a
                hairline, so it draws nothing of its own.
              </>
            }
          >
            <Preview>
              <div className='flex flex-wrap items-center gap-8'>
                <Cell label='text cell'>
                  <ButtonGroup aria-label='Formatting'>
                    <Button iconOnly aria-label='Bold' leadingVisual={IconFormatBold} />
                    <ButtonGroupText>Aa</ButtonGroupText>
                    <Button iconOnly aria-label='Italic' leadingVisual={IconFormatItalic} />
                  </ButtonGroup>
                </Cell>
                <Cell label='separator'>
                  <ButtonGroup aria-label='Clipboard'>
                    <Button>Copy</Button>
                    <Button>Paste</Button>
                    <ButtonGroupSeparator />
                    <Button>Cut</Button>
                  </ButtonGroup>
                </Cell>
                <Cell label='on a band'>
                  <ButtonGroup variant='solid' aria-label='Formatting'>
                    <Button>Bold</Button>
                    <ButtonGroupText>Aa</ButtonGroupText>
                    <Button>Italic</Button>
                  </ButtonGroup>
                </Cell>
              </div>
            </Preview>
          </Section>

          {/* States */}
          <Section
            title='States'
            description="A disabled segment dims itself and leaves the tab order. The hairline before it is drawn on the segment before it, so the row's dividers stay at one strength. A loading segment shows a spinner and blocks interaction."
          >
            <Preview>
              <div className='flex flex-wrap items-center gap-8'>
                <Cell label='disabled'>
                  <ButtonGroup aria-label='Clipboard'>
                    <Button>Copy</Button>
                    <Button disabled>Paste</Button>
                    <Button>Cut</Button>
                  </ButtonGroup>
                </Cell>
                <Cell label='loading'>
                  <ButtonGroup>
                    <Button>Cancel</Button>
                    <Button variant='solid' loading>
                      Save
                    </Button>
                  </ButtonGroup>
                </Cell>
              </div>
            </Preview>
          </Section>

          {/* As links */}
          <Section
            title='With links'
            description='ButtonLink is a segment like any other. Mix navigation and actions in one row when they belong to one job.'
          >
            <Preview className='flex flex-wrap items-center gap-8'>
              <Cell label='mixed'>
                <ButtonGroup aria-label='Record'>
                  <ButtonLink href='#view'>View</ButtonLink>
                  <ButtonLink href='#history'>History</ButtonLink>
                  <Button variant='solid'>Edit</Button>
                </ButtonGroup>
              </Cell>
            </Preview>
          </Section>

          {/* In a popup */}
          <Section
            title='In a popup'
            description={
              <>
                A popup opened from a segment renders through a portal, which React context follows.
                Every popup in this package resets the group at its portal, so the Buttons inside
                render normally. Wrap the contents of an overlay from another library in{' '}
                <code>ButtonGroupBoundary</code> to get the same.
              </>
            }
          >
            <Preview className='flex items-center'>
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
                    <Button variant='ghost' block>
                      Save and close
                    </Button>
                  </PopoverContent>
                </Popover>
              </ButtonGroup>
            </Preview>
          </Section>
        </div>
      ),
      description: {
        component:
          "Joins related Buttons into one control, horizontally or vertically. Takes Button's variant family (outline by default, solid, soft, surface, ghost), its colour tokens and its size steps, and hands them to its segments as defaults; a segment may name its own emphasis, so a solid Save sits inside an outline group as the row's primary action. Mix in ButtonGroupText for an inline label and ButtonGroupSeparator for a semantic boundary.",
      },
    },
  },
  args: {
    variant: 'outline',
    orientation: 'horizontal',
    color: 'primary',
    size: 'default',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: variants,
      description: 'The frame or band every segment sits in.',
      table: { category: 'Appearance' },
    },
    orientation: {
      control: 'inline-radio',
      options: orientations,
      description: 'Row or column.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: colors,
      description:
        "Colour token, with Button's meaning: the ink of the frame, band and dividers, and every segment's default colour.",
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: "Scale step, with Button's meaning: every segment's default size.",
      table: { category: 'Appearance' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the group, announced before its segments.',
      table: { category: 'Accessibility' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Reads a computed colour and reports whether it paints anything. */
function isPainted(color: string) {
  return color !== '' && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)'
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label='Clipboard'>
      <Button>Copy</Button>
      <Button>Paste</Button>
      <Button>Cut</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The three Buttons render as real buttons…
    const buttons = canvas.getAllByRole('button')
    await expect(buttons).toHaveLength(3)

    // …inside the grouping wrapper, which is the accessible group.
    const group = canvas.getByRole('group', { name: 'Clipboard' })
    await expect(group).toContainElement(buttons[0] ?? null)

    // A segment reads its variant from the group: no child named one, so all
    // three render as ghost segments, and each is stamped as one.
    for (const button of buttons) {
      await expect(button).toHaveAttribute('data-variant', 'ghost')
      await expect(button).toHaveAttribute('data-segment', 'default')
    }

    // The joining is real, not a doubled border: the middle segment has no
    // corners of its own, and the divider on its leading edge is painted
    // while its trailing edge stays transparent (that edge belongs to the
    // next segment).
    const [first, middle] = buttons
    const styles = getComputedStyle(middle!)
    await expect(styles.borderTopLeftRadius).toBe('0px')
    await expect(styles.borderTopRightRadius).toBe('0px')
    await expect(isPainted(styles.borderLeftColor)).toBe(true)
    await expect(isPainted(styles.borderRightColor)).toBe(false)
    // The first segment has no divider: nothing precedes it.
    await expect(isPainted(getComputedStyle(first!).borderLeftColor)).toBe(false)
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      {variants.map((variant) => (
        <div key={variant} className='flex flex-wrap items-start gap-4'>
          <ButtonGroup variant={variant} aria-label={`${variant} clipboard`}>
            <Button>Copy</Button>
            <Button>Paste</Button>
            <Button>Cut</Button>
          </ButtonGroup>
          <ButtonGroup variant={variant}>
            <Button variant='solid'>Save</Button>
            <Button
              variant='solid'
              iconOnly
              aria-label='More save options'
              leadingVisual={IconExpandMore}
            />
          </ButtonGroup>
          <ButtonGroup variant={variant}>
            <Button>Cancel</Button>
            <Button variant='solid'>Save and continue</Button>
          </ButtonGroup>
          <ButtonGroup variant={variant} aria-label={`${variant} formatting`}>
            <Button>Bold</Button>
            <ButtonGroupText>Aa</ButtonGroupText>
            <Button>Italic</Button>
          </ButtonGroup>
          <ButtonGroup variant={variant}>
            <Button>Rest</Button>
            <Button variant='soft'>Soft</Button>
            <Button disabled>Off</Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A child that asks for emphasis keeps it, whatever the group variant.
    for (const save of canvas.getAllByRole('button', { name: 'Save' })) {
      await expect(save).toHaveAttribute('data-variant', 'solid')
      await expect(save).toHaveAttribute('data-segment', 'override')
    }
    for (const soft of canvas.getAllByRole('button', { name: 'Soft' })) {
      await expect(soft).toHaveAttribute('data-variant', 'soft')
      await expect(soft).toHaveAttribute('data-segment', 'override')
    }

    // In a solid band every segment that is not itself solid takes the band's
    // label colour as its ink, so nothing is blue on blue.
    const band = canvas.getByRole('group', { name: 'solid clipboard' })
    const solidLabel = getComputedStyle(canvas.getAllByRole('button', { name: 'Save' })[0]!).color
    for (const segment of within(band).getAllByRole('button')) {
      await expect(getComputedStyle(segment).color).toBe(solidLabel)
    }
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      // Compact view: Name + Control only, no description/type/default columns
      expanded: false,
      sort: 'requiredFirst',
    },
  },
  render: (args) => (
    <div className='w-full max-w-xl rounded-sm border border-border bg-background p-6'>
      <ButtonGroup {...args} aria-label='Clipboard'>
        <Button>Copy</Button>
        <Button>Paste</Button>
        <Button>Cut</Button>
      </ButtonGroup>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  render: () => (
    <ButtonGroup aria-label='Clipboard'>
      <Button>One</Button>
      <ButtonGroupText>Aa</ButtonGroupText>
      <Button>Two</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Clipboard' })

    // Proves globals.css loaded: the outline frame is an inset ring in the
    // ink, which only resolves when the token layers are present.
    const shadow = getComputedStyle(group).boxShadow
    if (shadow === '' || shadow === 'none') {
      throw new Error(`Expected the outline frame ring to paint, received "${shadow}".`)
    }

    // The text cell sits at the body size, never fine print, and its
    // background stops at the padding box so the frame shows through.
    const cell = canvasElement.querySelector<HTMLElement>('[data-slot="button-group-text"]')
    if (!cell) {
      throw new Error('Could not find [data-slot="button-group-text"].')
    }
    await expect(parseFloat(getComputedStyle(cell).fontSize)).toBeGreaterThanOrEqual(16)
    await expect(getComputedStyle(cell).backgroundClip).toBe('padding-box')

    // The group is exactly one button tall: the frame adds no height.
    const button = canvas.getByRole('button', { name: 'One' })
    await expect(group.getBoundingClientRect().height).toBe(button.getBoundingClientRect().height)
  },
}
