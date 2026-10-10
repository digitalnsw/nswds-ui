/**
 * ButtonGroup — the docs page, Default and Playground
 * (docs/reference-storybook-standard.md).
 *
 *   Components/ButtonGroup                → this file
 *   Components/ButtonGroup/Features       → button-group.features.stories.tsx
 *   Components/ButtonGroup/Accessibility  → button-group.accessibility.stories.tsx
 *   Components/ButtonGroup/Tests          → button-group.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import {
  IconChevronLeft,
  IconChevronRight,
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
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

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

/**
 * One row of the colour matrix: a colour name followed by a two-segment group
 * in that colour across the key group treatments. The name inherits the
 * panel's text colour, so it reads on the brand panel too.
 */
function ColorRow({ color }: { color: (typeof colors)[number] }) {
  return (
    <div className='flex flex-wrap items-center gap-3 py-1'>
      <span className='w-20 shrink-0 font-semibold'>{color}</span>
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

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
      description='An outline group of ghost segments in the primary colour — the out-of-the-box configuration.'
    >
      <Example
        code={`<ButtonGroup aria-label="Clipboard">
  <Button>Copy</Button>
  <Button>Paste</Button>
  <Button>Cut</Button>
</ButtonGroup>`}
      >
        <ButtonGroup aria-label='Clipboard'>
          <Button>Copy</Button>
          <Button>Paste</Button>
          <Button>Cut</Button>
        </ButtonGroup>
      </Example>
    </ExampleSection>
  )
}

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description="The variant is the group's: it decides the frame or band every segment sits in. Segments stay ghost, so the group paints once and the labels sit on top."
    >
      <Example
        code={`<ButtonGroup variant="soft" aria-label="Clipboard">
  <Button>Copy</Button>
  <Button>Paste</Button>
  <Button>Cut</Button>
</ButtonGroup>`}
      >
        {variants.map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <ButtonGroup variant={variant} aria-label={`${variant} clipboard`}>
              <Button>Copy</Button>
              <Button>Paste</Button>
              <Button>Cut</Button>
            </ButtonGroup>
          </ExampleCell>
        ))}
      </Example>
      <dl className='grid gap-x-8 gap-y-3 sm:grid-cols-2'>
        {variantDocs.map(([name, desc]) => (
          <div key={name} className='flex gap-3 text-base'>
            <dt className='w-16 shrink-0 font-semibold'>{name}</dt>
            <dd className='text-muted-foreground'>{desc}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

export function EmphasisSection() {
  return (
    <ExampleSection
      title='Emphasis'
      description={
        <>
          A segment may name its own emphasis. A <code>solid</code> or <code>soft</code> child
          paints its own fill inside the group, which is how a Save sits beside a ghost Cancel as
          the row&apos;s primary action, and how a split button pairs an action with its menu. Two
          solid segments divide with a reversed hairline. Any other child variant —{' '}
          <code>outline</code>, <code>ghost</code>, <code>link</code> — renders as a plain segment,
          so the shadcn idiom of writing <code>variant=&apos;outline&apos;</code> on every child
          draws no second border.
        </>
      }
    >
      <Example
        code={`<ButtonGroup aria-label="Application">
  <Button>Cancel</Button>
  <Button variant="solid">Save and continue</Button>
</ButtonGroup>

<ButtonGroup aria-label="Save">
  <Button variant="solid">Save</Button>
  <Button variant="solid" iconOnly aria-label="More save options" leadingVisual={IconExpandMore} />
</ButtonGroup>`}
      >
        <ExampleCell label='primary action'>
          <ButtonGroup aria-label='Application'>
            <Button>Cancel</Button>
            <Button variant='solid'>Save and continue</Button>
          </ButtonGroup>
        </ExampleCell>
        <ExampleCell label='split button'>
          <ButtonGroup aria-label='Save'>
            <Button variant='solid'>Save</Button>
            <Button
              variant='solid'
              iconOnly
              aria-label='More save options'
              leadingVisual={IconExpandMore}
            />
          </ButtonGroup>
        </ExampleCell>
      </Example>
      <Example
        code={`<ButtonGroup aria-label="View">
  <Button>Day</Button>
  <Button variant="soft">Week</Button>
  <Button>Month</Button>
</ButtonGroup>`}
      >
        <ExampleCell label='soft segment'>
          <ButtonGroup aria-label='View'>
            <Button>Day</Button>
            <Button variant='soft'>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
        </ExampleCell>
        <ExampleCell label='on a band'>
          <ButtonGroup variant='solid' aria-label='View on a band'>
            <Button>Day</Button>
            <Button variant='soft'>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          Button&apos;s three scale steps — <code>sm</code>, <code>default</code>, <code>lg</code> —
          as the default for every segment. A group is exactly as tall as the lone Button beside it:
          the frame is drawn inside the box, not around it. <code>icon</code> is not offered,
          because the group clips to its own box and would cut off the 44px touch expansion the 40px
          chrome square relies on; pair <code>iconOnly</code> with <code>sm</code> instead.
        </>
      }
    >
      <Example
        code={`<ButtonGroup size="lg" aria-label="Clipboard">…</ButtonGroup>

<ButtonGroup size="sm" aria-label="Clipboard">
  <Button iconOnly aria-label="Copy" leadingVisual={IconContentCopy} />
  <Button iconOnly aria-label="Paste" leadingVisual={IconContentPaste} />
  <Button iconOnly aria-label="Cut" leadingVisual={IconContentCut} />
</ButtonGroup>`}
      >
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <ButtonGroup size={size} aria-label={`${size} clipboard`}>
              <Button>Copy</Button>
              <Button>Paste</Button>
            </ButtonGroup>
          </ExampleCell>
        ))}
        <ExampleCell label='iconOnly, sm'>
          <ButtonGroup size='sm' aria-label='Clipboard'>
            <Button iconOnly aria-label='Copy' leadingVisual={IconContentCopy} />
            <Button iconOnly aria-label='Paste' leadingVisual={IconContentPaste} />
            <Button iconOnly aria-label='Cut' leadingVisual={IconContentCut} />
          </ButtonGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description="The colour prop is Button's: it sets the ink the frame, band and dividers are drawn in, and the default colour of every segment. Shown here across the main group treatments."
    >
      <div className='space-y-10'>
        <div className='space-y-4'>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold'>Brand colours</h3>
            <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
              Drawn from the active masterbrand theme. Use <code>primary</code> for a group of main
              actions; <code>tertiary</code> and <code>accent</code> for supporting ones;{' '}
              <code>grey</code> for a neutral toolbar.
            </p>
          </div>
          {/* On the page's own white, not the tinted panel: tertiary, success
              and warning ink clears 4.5:1 on white but not on the tint. */}
          <Example
            layout='stack'
            className='bg-background'
            code={`<ButtonGroup color="tertiary" variant="soft" aria-label="Clipboard">…</ButtonGroup>`}
          >
            {brandColors.map((color) => (
              <ColorRow key={color} color={color} />
            ))}
          </Example>
        </div>

        <div className='space-y-4'>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold'>On dark surfaces</h3>
            <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
              Theme colours designed to sit on coloured or dark backgrounds. The outline group draws
              no fill of its own, so a <code>white</code> frame on a primary panel stays a frame.
              Shown here on a primary background.
            </p>
          </div>
          <Example
            layout='stack'
            surface='brand'
            code={`<ButtonGroup color="white" aria-label="Clipboard">…</ButtonGroup>`}
          >
            {onDarkColors.map((color) => (
              <ColorRow key={color} color={color} />
            ))}
          </Example>
        </div>

        <div className='space-y-4'>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold'>Semantic colours</h3>
            <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
              Fixed meanings that stay constant across themes. A <code>danger</code> split button is
              the common case: Delete, with its options under the chevron.
            </p>
          </div>
          <Example
            layout='stack'
            className='bg-background'
            code={`<ButtonGroup color="danger" aria-label="Delete">
  <Button variant="solid">Delete</Button>
  <Button variant="solid" iconOnly aria-label="More delete options" leadingVisual={IconExpandMore} />
</ButtonGroup>`}
          >
            {semanticColors.map((color) => (
              <ColorRow key={color} color={color} />
            ))}
          </Example>
        </div>
      </div>
    </ExampleSection>
  )
}

export function OrientationSection() {
  return (
    <ExampleSection
      title='Orientation'
      description='The same rules rotated. A vertical group stacks its segments and moves the hairline to the top edge of each one.'
    >
      <Example
        className='items-start'
        code={`<ButtonGroup orientation="vertical" aria-label="Clipboard">…</ButtonGroup>`}
      >
        {orientations.map((orientation) => (
          <ExampleCell key={orientation} label={orientation}>
            <ButtonGroup orientation={orientation} aria-label={`${orientation} group`}>
              <Button>Top</Button>
              <Button>Middle</Button>
              <Button>Bottom</Button>
            </ButtonGroup>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function InlineTextAndSeparatorsSection() {
  return (
    <ExampleSection
      title='Inline text and separators'
      description={
        <>
          <code>ButtonGroupText</code> is an inline label between segments — a unit, a count, a mode
          — at the body size, never fine print. <code>ButtonGroupSeparator</code> is a semantic
          boundary for assistive technology; every segment is already divided by a hairline, so it
          draws nothing of its own.
        </>
      }
    >
      <Example
        code={`<ButtonGroup aria-label="Formatting">
  <Button iconOnly aria-label="Bold" leadingVisual={IconFormatBold} />
  <ButtonGroupText>Aa</ButtonGroupText>
  <Button iconOnly aria-label="Italic" leadingVisual={IconFormatItalic} />
</ButtonGroup>

<ButtonGroup aria-label="Clipboard">
  <Button>Copy</Button>
  <Button>Paste</Button>
  <ButtonGroupSeparator />
  <Button>Cut</Button>
</ButtonGroup>`}
      >
        <ExampleCell label='text cell'>
          <ButtonGroup aria-label='Formatting'>
            <Button iconOnly aria-label='Bold' leadingVisual={IconFormatBold} />
            <ButtonGroupText>Aa</ButtonGroupText>
            <Button iconOnly aria-label='Italic' leadingVisual={IconFormatItalic} />
          </ButtonGroup>
        </ExampleCell>
        <ExampleCell label='separator'>
          <ButtonGroup aria-label='Clipboard'>
            <Button>Copy</Button>
            <Button>Paste</Button>
            <ButtonGroupSeparator />
            <Button>Cut</Button>
          </ButtonGroup>
        </ExampleCell>
        <ExampleCell label='on a band'>
          <ButtonGroup variant='solid' aria-label='Formatting on a band'>
            <Button>Bold</Button>
            <ButtonGroupText>Aa</ButtonGroupText>
            <Button>Italic</Button>
          </ButtonGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description="A disabled segment dims itself and leaves the tab order. The hairline before it is drawn on the segment before it, so the row's dividers stay at one strength. A loading segment shows a spinner and blocks interaction."
    >
      <Example
        code={`<ButtonGroup aria-label="Clipboard">
  <Button>Copy</Button>
  <Button disabled>Paste</Button>
  <Button>Cut</Button>
</ButtonGroup>

<Button variant="solid" loading>Save</Button>`}
      >
        <ExampleCell label='disabled'>
          <ButtonGroup aria-label='Clipboard'>
            <Button>Copy</Button>
            <Button disabled>Paste</Button>
            <Button>Cut</Button>
          </ButtonGroup>
        </ExampleCell>
        <ExampleCell label='loading'>
          <ButtonGroup aria-label='Save changes'>
            <Button>Cancel</Button>
            <Button variant='solid' loading>
              Save
            </Button>
          </ButtonGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function WithIconsSection() {
  return (
    <ExampleSection
      title='With icons'
      description={
        <>
          Segments take Button&apos;s icon props. A <code>leadingVisual</code> or{' '}
          <code>trailingVisual</code> reinforces a label; it never replaces it — reach for{' '}
          <code>iconOnly</code> (see Sizes) only when the icon alone is unambiguous.
        </>
      }
    >
      <Example
        code={`<ButtonGroup aria-label="Search results pages">
  <Button leadingVisual={IconChevronLeft}>Previous</Button>
  <Button trailingVisual={IconChevronRight}>Next</Button>
</ButtonGroup>`}
      >
        <ExampleCell label='leadingVisual and trailingVisual'>
          <ButtonGroup aria-label='Search results pages'>
            <Button leadingVisual={IconChevronLeft}>Previous</Button>
            <Button trailingVisual={IconChevronRight}>Next</Button>
          </ButtonGroup>
        </ExampleCell>
        <ExampleCell label='leadingVisual on every segment'>
          <ButtonGroup aria-label='Clipboard with icons'>
            <Button leadingVisual={IconContentCopy}>Copy</Button>
            <Button leadingVisual={IconContentPaste}>Paste</Button>
            <Button leadingVisual={IconContentCut}>Cut</Button>
          </ButtonGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function WithLinksSection() {
  return (
    <ExampleSection
      title='With links'
      description='ButtonLink is a segment like any other. Mix navigation and actions in one row when they belong to one job.'
    >
      <Example
        code={`<ButtonGroup aria-label="Record">
  <ButtonLink href="/record">View</ButtonLink>
  <ButtonLink href="/record/history">History</ButtonLink>
  <Button variant="solid">Edit</Button>
</ButtonGroup>`}
      >
        <ExampleCell label='mixed'>
          <ButtonGroup aria-label='Record'>
            <ButtonLink href='#view'>View</ButtonLink>
            <ButtonLink href='#history'>History</ButtonLink>
            <Button variant='solid'>Edit</Button>
          </ButtonGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InAPopupSection() {
  return (
    <ExampleSection
      title='In a popup'
      description={
        <>
          A popup opened from a segment renders through a portal, which React context follows. Every
          popup in this package resets the group at its portal, so the Buttons inside render
          normally. Wrap the contents of an overlay from another library in{' '}
          <code>ButtonGroupBoundary</code> to get the same.
        </>
      }
    >
      <Example
        code={`<ButtonGroup aria-label="Save">
  <Button variant="solid">Save</Button>
  <Popover>
    <PopoverTrigger
      render={<Button variant="solid" iconOnly aria-label="More save options" leadingVisual={IconExpandMore} />}
    />
    <PopoverContent>
      <Button variant="soft" block>Save as draft</Button>
      <Button variant="ghost" block>Save and close</Button>
    </PopoverContent>
  </Popover>
</ButtonGroup>

// An overlay from another library
<OtherPopup>
  <ButtonGroupBoundary>…</ButtonGroupBoundary>
</OtherPopup>`}
      >
        <ButtonGroup aria-label='Save'>
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
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A booking page: a view switcher above the list of available appointments, and the paging controls under it.'
    >
      <Example layout='fill'>
        <div className='max-w-md space-y-6'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <p className='text-xl font-semibold'>Available appointments</p>
            <ButtonGroup size='sm' aria-label='Appointment view'>
              <Button>Day</Button>
              <Button variant='soft'>Week</Button>
              <Button>Month</Button>
            </ButtonGroup>
          </div>
          <ul className='divide-y divide-foreground/10 border-y border-foreground/10'>
            {[
              'Service NSW Parramatta — Tue 14 Oct, 9:30am',
              'Service NSW Parramatta — Wed 15 Oct, 2:00pm',
              'Service NSW Haymarket — Thu 16 Oct, 11:15am',
            ].map((slot) => (
              <li key={slot} className='py-3'>
                {slot}
              </li>
            ))}
          </ul>
          <ButtonGroup aria-label='Appointment pages'>
            <Button leadingVisual={IconChevronLeft}>Previous week</Button>
            <Button trailingVisual={IconChevronRight}>Next week</Button>
          </ButtonGroup>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ButtonGroupDocs() {
  return (
    <DocsPage
      title='ButtonGroup'
      npm={['ButtonGroup', 'ButtonGroupText', 'ButtonGroupSeparator', 'ButtonGroupBoundary']}
      registry='button-group'
      summary={
        <>
          A group joins a row or column of Buttons into one control. The group draws the boundary —
          the frame or band, the hairline between segments, the corners — and takes Button&apos;s{' '}
          <strong className='font-semibold text-foreground'>variant</strong> family,{' '}
          <strong className='font-semibold text-foreground'>colour</strong> tokens and{' '}
          <strong className='font-semibold text-foreground'>size</strong> steps, handing them to its
          segments as defaults. A segment is an ordinary Button.
        </>
      }
    >
      <DocsUsage
        use={[
          'A few closely related actions that act on the same thing — Day, Week and Month views of one calendar.',
          'A split button: a primary action beside a menu of its alternatives.',
          'Paging or stepping controls (Previous and Next) that belong together.',
        ]}
        avoid={[
          'Choosing one value that stays selected — use ToggleGroup or RadioGroup.',
          'An input or select with an attached action — use InputGroup.',
          'Unrelated actions that only happen to sit side by side — use separate Buttons with a gap.',
        ]}
      />
      <DefaultSection />
      <VariantsSection />
      <EmphasisSection />
      <SizesSection />
      <ColoursSection />
      <OrientationSection />
      <InlineTextAndSeparatorsSection />
      <StatesSection />
      <WithIconsSection />
      <WithLinksSection />
      <InAPopupSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      page: ButtonGroupDocs,
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
    'aria-label': 'Clipboard',
    children: (
      <>
        <Button>Copy</Button>
        <Button>Paste</Button>
        <Button>Cut</Button>
      </>
    ),
  },
  argTypes: {
    children: {
      control: false,
      description:
        'Buttons, ButtonLinks, ButtonGroupText and ButtonGroupSeparator, as direct children.',
      table: { category: 'Content' },
    },
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
    className: { table: { disable: true } },
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
      <ButtonGroup {...args} />
    </div>
  ),
}
