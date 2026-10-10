/**
 * ButtonGroup — the docs page, Default, Playground and one story per section.
 *
 *   Components/ButtonGroup                → this file
 *   Components/ButtonGroup/Tests          → button-group.tests.stories.tsx
 *   Components/ButtonGroup/Accessibility  → button-group.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { expect, within } from 'storybook/test'

import {
  IconChevronLeft,
  IconChevronRight,
  IconContentCopy,
  IconContentCut,
  IconContentPaste,
  IconExpandMore,
  IconGridView,
  IconList,
  IconZoomIn,
  IconZoomOut,
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

// The group treatments shown in each colour row.
const colourVariants = ['outline', 'solid', 'soft', 'surface'] as const

const variantDocs: ReadonlyArray<readonly [(typeof variants)[number], string]> = [
  ['outline', 'Default — a 1px hairline frame in the ink, ghost segments inside.'],
  ['solid', 'High emphasis — the fill band; every segment reads as a primary.'],
  ['soft', 'Medium emphasis — the ink at 10% as a band, no frame.'],
  ['surface', 'Medium emphasis — the ink at 5% inside an ink/50 hairline.'],
  ['ghost', 'Low emphasis — no frame, no fill; only the hairlines between segments.'],
]

/** The appointment-view switcher most sections use as their specimen. */
function ViewSwitcher(props: ComponentProps<typeof ButtonGroup>) {
  return (
    <ButtonGroup aria-label='Appointment view' {...props}>
      <Button>Day</Button>
      <Button>Week</Button>
      <Button>Month</Button>
    </ButtonGroup>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description="The variant is the group's: it decides the frame or band every segment sits in. Segments stay ghost, so the group paints once and the labels sit on top. Button's family, minus link."
    >
      <Example
        code={`<ButtonGroup variant="soft" aria-label="Appointment view">
  <Button>Day</Button>
  <Button>Week</Button>
  <Button>Month</Button>
</ButtonGroup>`}
      >
        {variants.map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <ViewSwitcher variant={variant} aria-label={`Appointment view, ${variant}`} />
          </ExampleCell>
        ))}
      </Example>
      <dl className='grid gap-x-10 gap-y-3 sm:grid-cols-2'>
        {variantDocs.map(([name, description]) => (
          <div key={name} className='flex gap-4'>
            <dt className='w-20 shrink-0 font-semibold'>{name}</dt>
            <dd className='text-muted-foreground'>{description}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          Button&apos;s three scale steps — <code>sm</code>, <code>default</code>, <code>lg</code> —
          as the default for every segment. A group is exactly as tall as the lone Button beside it:
          the frame is drawn inside the box, not around it.
        </>
      }
    >
      <Example
        code={`<ButtonGroup size="sm" aria-label="Appointment view">
  <Button>Day</Button>
  …
</ButtonGroup>`}
      >
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <ViewSwitcher size={size} aria-label={`Appointment view, ${size}`} />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function ColourRow({ color }: { color: (typeof colors)[number] }) {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <span className='w-24 shrink-0 font-semibold'>{color}</span>
      {colourVariants.map((variant) => (
        <ButtonGroup
          key={variant}
          color={color}
          variant={variant}
          aria-label={`Results pages, ${color} ${variant}`}
        >
          <Button>Previous</Button>
          <Button>Next</Button>
        </ButtonGroup>
      ))}
    </div>
  )
}

function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          <code>color</code> is Button&apos;s: it sets the ink the frame, band and dividers are
          drawn in, and the default colour of every segment. Brand colours follow the active theme;{' '}
          <code>white</code> and <code>secondary</code> are for coloured or dark surfaces — an
          outline group draws no fill of its own, so a <code>white</code> frame on a dark panel
          stays a frame; status colours keep their meaning in every theme.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<ButtonGroup color="tertiary" variant="soft" aria-label="Results pages">
  <Button>Previous</Button>
  <Button>Next</Button>
</ButtonGroup>`}
      >
        {(['primary', 'tertiary', 'accent', 'grey'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
      <Example layout='stack' surface='brand'>
        {(['white', 'secondary'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
      <Example layout='stack'>
        {(['danger', 'success', 'warning'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
    </ExampleSection>
  )
}

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description="A disabled segment dims itself and leaves the tab order; the hairline before it is drawn on the segment before it, so the row's dividers stay at one strength. A loading segment shows a spinner and blocks interaction while keeping its label."
    >
      <Example
        code={`<ButtonGroup aria-label="Application">
  <Button>Cancel</Button>
  <Button variant="solid" loading>Submit application</Button>
</ButtonGroup>`}
      >
        <ExampleCell label='disabled'>
          <ButtonGroup aria-label='Results pages'>
            <Button disabled>Previous</Button>
            <Button>1</Button>
            <Button>2</Button>
            <Button>Next</Button>
          </ButtonGroup>
        </ExampleCell>
        <ExampleCell label='loading'>
          <ButtonGroup aria-label='Application'>
            <Button>Cancel</Button>
            <Button variant='solid' loading>
              Submit application
            </Button>
          </ButtonGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function WithIconsSection() {
  return (
    <ExampleSection
      title='With icons'
      description="Segments take Button's icon props. A leading or trailing icon reinforces a label; it never replaces it — reach for iconOnly (below) only when the icon alone is unambiguous."
    >
      <Example
        code={`<ButtonGroup aria-label="Search results pages">
  <Button leadingVisual={IconChevronLeft}>Previous</Button>
  <Button trailingVisual={IconChevronRight}>Next</Button>
</ButtonGroup>`}
      >
        <ButtonGroup aria-label='Search results pages'>
          <Button leadingVisual={IconChevronLeft}>Previous</Button>
          <Button trailingVisual={IconChevronRight}>Next</Button>
        </ButtonGroup>
      </Example>
    </ExampleSection>
  )
}

function IconOnlySection() {
  return (
    <ExampleSection
      title='Icon only'
      description={
        <>
          <code>icon</code> is not a group size: the group clips to its own box and would cut off
          the 44px touch expansion the 40px chrome square relies on. Use <code>iconOnly</code> on
          the segments instead — they square at the group&apos;s step and line up with any text
          segment beside them. Each one needs an <code>aria-label</code>.
        </>
      }
    >
      <Example
        code={`<ButtonGroup size="sm" aria-label="Map zoom">
  <Button iconOnly aria-label="Zoom out" leadingVisual={IconZoomOut} />
  <Button iconOnly aria-label="Zoom in" leadingVisual={IconZoomIn} />
</ButtonGroup>`}
      >
        <ExampleCell label='sm + iconOnly'>
          <ButtonGroup size='sm' aria-label='Map zoom'>
            <Button iconOnly aria-label='Zoom out' leadingVisual={IconZoomOut} />
            <Button iconOnly aria-label='Zoom in' leadingVisual={IconZoomIn} />
          </ButtonGroup>
        </ExampleCell>
        <ExampleCell label='default + iconOnly'>
          <ButtonGroup aria-label='Results layout'>
            <Button iconOnly aria-label='Show as list' leadingVisual={IconList} />
            <Button iconOnly aria-label='Show as grid' leadingVisual={IconGridView} />
          </ButtonGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function EmphasisSection() {
  return (
    <ExampleSection
      title='Emphasis'
      description={
        <>
          A segment may name its own emphasis. A <code>solid</code> or <code>soft</code> child
          paints its own fill inside the group — how a Save sits beside a ghost Cancel as the
          row&apos;s primary action, and how a split button pairs an action with its menu. Two solid
          segments divide with a reversed hairline. Any other child variant renders as a plain
          segment, so writing <code>variant=&quot;outline&quot;</code> on every child draws no
          second border.
        </>
      }
    >
      <Example
        code={`<ButtonGroup aria-label="Application">
  <Button>Cancel</Button>
  <Button variant="solid">Save and continue</Button>
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
            <Button variant='solid'>Save draft</Button>
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
        code={`<ButtonGroup aria-label="Appointment view">
  <Button>Day</Button>
  <Button variant="soft">Week</Button>
  <Button>Month</Button>
</ButtonGroup>`}
      >
        <ExampleCell label='soft segment'>
          <ButtonGroup aria-label='Appointment view, week selected'>
            <Button>Day</Button>
            <Button variant='soft'>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
        </ExampleCell>
        <ExampleCell label='on a solid band'>
          <ButtonGroup variant='solid' aria-label='Appointment view on a band'>
            <Button>Day</Button>
            <Button variant='soft'>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function OrientationSection() {
  return (
    <ExampleSection
      title='Orientation'
      description='The same rules rotated. A vertical group stacks its segments and moves the hairline to the top edge of each one.'
    >
      <Example
        code={`<ButtonGroup orientation="vertical" aria-label="Appointment view">
  …
</ButtonGroup>`}
      >
        {orientations.map((orientation) => (
          <ExampleCell key={orientation} label={orientation}>
            <ViewSwitcher
              orientation={orientation}
              aria-label={`Appointment view, ${orientation}`}
            />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function TextAndSeparatorsSection() {
  return (
    <ExampleSection
      title='Text and separators'
      description={
        <>
          <code>ButtonGroupText</code> is an inline label between segments — a unit, a count, a
          value — at the body size, never fine print. <code>ButtonGroupSeparator</code> is a
          semantic boundary for assistive technology; every segment is already divided by a
          hairline, so it draws nothing of its own.
        </>
      }
    >
      <Example
        code={`<ButtonGroup aria-label="Map zoom">
  <Button iconOnly aria-label="Zoom out" leadingVisual={IconZoomOut} />
  <ButtonGroupText>100%</ButtonGroupText>
  <Button iconOnly aria-label="Zoom in" leadingVisual={IconZoomIn} />
</ButtonGroup>`}
      >
        <ExampleCell label='ButtonGroupText'>
          <ButtonGroup aria-label='Map zoom'>
            <Button iconOnly aria-label='Zoom out' leadingVisual={IconZoomOut} />
            <ButtonGroupText>100%</ButtonGroupText>
            <Button iconOnly aria-label='Zoom in' leadingVisual={IconZoomIn} />
          </ButtonGroup>
        </ExampleCell>
        <ExampleCell label='on a solid band'>
          <ButtonGroup variant='solid' aria-label='Map zoom on a band'>
            <Button iconOnly aria-label='Zoom out' leadingVisual={IconZoomOut} />
            <ButtonGroupText>100%</ButtonGroupText>
            <Button iconOnly aria-label='Zoom in' leadingVisual={IconZoomIn} />
          </ButtonGroup>
        </ExampleCell>
      </Example>
      <Example
        code={`<ButtonGroup aria-label="Clipboard">
  <Button leadingVisual={IconContentCopy}>Copy</Button>
  <Button leadingVisual={IconContentPaste}>Paste</Button>
  <ButtonGroupSeparator />
  <Button leadingVisual={IconContentCut}>Cut</Button>
</ButtonGroup>`}
      >
        <ExampleCell label='ButtonGroupSeparator'>
          <ButtonGroup aria-label='Clipboard'>
            <Button leadingVisual={IconContentCopy}>Copy</Button>
            <Button leadingVisual={IconContentPaste}>Paste</Button>
            <ButtonGroupSeparator />
            <Button leadingVisual={IconContentCut}>Cut</Button>
          </ButtonGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function WithLinksSection() {
  return (
    <ExampleSection
      title='With links'
      description='ButtonLink is a segment like any other. Mix navigation and actions in one row when they belong to one job.'
    >
      <Example
        code={`<ButtonGroup aria-label="Licence record">
  <ButtonLink href="/licence">View</ButtonLink>
  <ButtonLink href="/licence/history">History</ButtonLink>
  <Button variant="solid">Renew</Button>
</ButtonGroup>`}
      >
        <ButtonGroup aria-label='Licence record'>
          <ButtonLink href='#licence'>View</ButtonLink>
          <ButtonLink href='#history'>History</ButtonLink>
          <Button variant='solid'>Renew</Button>
        </ButtonGroup>
      </Example>
    </ExampleSection>
  )
}

function InAPopupSection() {
  return (
    <ExampleSection
      title='In a popup'
      description={
        <>
          A popup opened from a segment renders through a portal, which React context follows. Every
          popup in this package resets the group at its portal, so the Buttons inside render as
          ordinary Buttons. Wrap the contents of an overlay from another library in{' '}
          <code>ButtonGroupBoundary</code> to get the same — without it, a Button inside renders as
          a segment of the group it was opened from.
        </>
      }
    >
      <Example
        code={`<ButtonGroup aria-label="Save">
  <Button variant="solid">Save draft</Button>
  <Popover>
    <PopoverTrigger
      render={<Button variant="solid" iconOnly aria-label="More save options" leadingVisual={IconExpandMore} />}
    />
    <PopoverContent>
      <Button variant="soft" block>Save and close</Button>
    </PopoverContent>
  </Popover>
</ButtonGroup>

// An overlay from another library
<OtherPopup>
  <ButtonGroupBoundary>…</ButtonGroupBoundary>
</OtherPopup>`}
      >
        <ButtonGroup aria-label='Save'>
          <Button variant='solid'>Save draft</Button>
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
                Save and close
              </Button>
              <Button variant='ghost' block>
                Save as a copy
              </Button>
            </PopoverContent>
          </Popover>
        </ButtonGroup>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
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
          <strong>variant</strong> family, <strong>colour</strong> tokens and <strong>size</strong>{' '}
          steps, handing them to its segments as defaults. A segment is an ordinary Button.
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
      <VariantsSection />
      <SizesSection />
      <ColoursSection />
      <StatesSection />
      <WithIconsSection />
      <IconOnlySection />
      <EmphasisSection />
      <OrientationSection />
      <TextAndSeparatorsSection />
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
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ButtonGroupDocs },
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

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const WithIcons: Story = { name: 'With icons', render: () => <WithIconsSection /> }

export const IconOnly: Story = { name: 'Icon only', render: () => <IconOnlySection /> }

export const Emphasis: Story = { name: 'Emphasis', render: () => <EmphasisSection /> }

export const Orientation: Story = { name: 'Orientation', render: () => <OrientationSection /> }

export const TextAndSeparators: Story = {
  name: 'Text and separators',
  render: () => <TextAndSeparatorsSection />,
}

export const WithLinks: Story = { name: 'With links', render: () => <WithLinksSection /> }

export const InAPopup: Story = { name: 'In a popup', render: () => <InAPopupSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
