/**
 * ButtonGroup — Default, Variants, Dark, CssCheck, and one story per rule
 *
 * A group joins a row (or column) of Buttons into one control. The group
 * draws the boundary — frame or band, dividers, corners — and takes Button's
 * variant family, colour tokens and size steps, handing them to its segments
 * as defaults. The accessibility of each segment is inherited from Button.
 *
 * Every behaviour the group promises has a story whose play would fail with
 * the rule removed: the joining itself, the inherited colour and size, the
 * inset focus ring and its colour on a solid segment, the reversed seam of a
 * split button, the separator's orientation, the disabled divider, the
 * outline-children idiom, ButtonLink as a segment, and the portal boundary.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
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

const groupVariants = [
  'outline',
  'solid',
  'soft',
  'surface',
  'ghost',
] as const satisfies readonly ButtonGroupVariant[]

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Joins related Buttons into one control, horizontally or vertically. Takes Button's variant family (outline by default, solid, soft, surface, ghost), its colour tokens and its size steps, and hands them to its segments as defaults; a segment may name its own emphasis, so a solid Save sits inside an outline group as the row's primary action. Mix in ButtonGroupText for an inline label and ButtonGroupSeparator for a semantic boundary. A popup opened from a segment renders its own Buttons normally: every popup in the package resets the group at its portal.",
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: groupVariants },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
  args: {
    variant: 'outline',
    orientation: 'horizontal',
  },
  render: (args) => (
    <ButtonGroup {...args} aria-label='Clipboard'>
      <Button>Copy</Button>
      <Button>Paste</Button>
      <Button>Cut</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Building blocks ──────────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-2'>
      <span className='text-base text-muted-foreground'>{label}</span>
      <div className='flex flex-wrap items-start gap-4'>{children}</div>
    </div>
  )
}

/** Every composition the design was drawn in, for one group variant. */
function Compositions({ variant }: { variant: ButtonGroupVariant }) {
  return (
    <Row label={variant}>
      <ButtonGroup variant={variant} aria-label='Clipboard'>
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
      <ButtonGroup variant={variant} aria-label='Clipboard'>
        <Button iconOnly aria-label='Copy' leadingVisual={IconContentCopy} />
        <Button iconOnly aria-label='Paste' leadingVisual={IconContentPaste} />
        <Button iconOnly aria-label='Cut' leadingVisual={IconContentCut} />
      </ButtonGroup>
      <ButtonGroup variant={variant} aria-label='Formatting'>
        <Button>Bold</Button>
        <ButtonGroupText>Aa</ButtonGroupText>
        <Button>Italic</Button>
      </ButtonGroup>
      <ButtonGroup variant={variant}>
        <Button>Rest</Button>
        <Button variant='soft'>Soft</Button>
        <Button disabled>Off</Button>
      </ButtonGroup>
    </Row>
  )
}

function AllVariants() {
  return (
    <div className='flex flex-col gap-8'>
      {groupVariants.map((variant) => (
        <Compositions key={variant} variant={variant} />
      ))}

      <Row label='colour tokens'>
        <ButtonGroup color='grey' aria-label='Clipboard'>
          <Button>Copy</Button>
          <Button>Paste</Button>
        </ButtonGroup>
        <ButtonGroup color='danger'>
          <Button variant='solid'>Delete</Button>
          <Button variant='solid' iconOnly aria-label='More' leadingVisual={IconExpandMore} />
        </ButtonGroup>
        <ButtonGroup variant='solid' color='accent'>
          <Button>Yes</Button>
          <Button>No</Button>
        </ButtonGroup>
        <ButtonGroup variant='soft' color='grey'>
          <Button>Day</Button>
          <Button>Week</Button>
        </ButtonGroup>
      </Row>

      <Row label='size steps'>
        <ButtonGroup size='sm'>
          <Button>Copy</Button>
          <Button>Paste</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button>Copy</Button>
          <Button>Paste</Button>
        </ButtonGroup>
        <ButtonGroup size='lg'>
          <Button>Copy</Button>
          <Button>Paste</Button>
        </ButtonGroup>
      </Row>

      <Row label='vertical'>
        <ButtonGroup orientation='vertical'>
          <Button>Top</Button>
          <Button>Middle</Button>
          <Button>Bottom</Button>
        </ButtonGroup>
        <ButtonGroup orientation='vertical' variant='solid'>
          <Button>Top</Button>
          <ButtonGroupSeparator />
          <Button>Middle</Button>
          <Button>Bottom</Button>
        </ButtonGroup>
      </Row>
    </div>
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

    // The group clips its corners, so a ring 2px outside the segment would be
    // clipped away: the ring sits 2px inside instead. Outline is not among
    // the transitioned properties, so the value is final at once.
    middle!.focus()
    const focused = getComputedStyle(middle!)
    await expect(focused.outlineWidth).toBe('2px')
    await expect(focused.outlineOffset).toBe('-2px')
  },
}

export const Variants: Story = {
  render: () => <AllVariants />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A child that asks for emphasis keeps it, whatever the group variant.
    const saves = canvas.getAllByRole('button', { name: 'Save' })
    for (const save of saves) {
      await expect(save).toHaveAttribute('data-variant', 'solid')
      await expect(save).toHaveAttribute('data-segment', 'override')
    }
    const softs = canvas.getAllByRole('button', { name: 'Soft' })
    for (const soft of softs) {
      await expect(soft).toHaveAttribute('data-variant', 'soft')
      await expect(soft).toHaveAttribute('data-segment', 'override')
    }

    // In a solid band every segment that is not itself solid takes the band's
    // label colour as its ink, so nothing is blue on blue: a defaulted segment
    // (Yes) and a soft one (the Soft inside the solid row) both read in the
    // same colour as an emphasised solid segment's label.
    const [firstSave] = saves
    const solidLabel = getComputedStyle(firstSave!).color
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Yes' })).color).toBe(
      solidLabel,
    )
    const softOnBand = softs.find(
      (soft) =>
        soft.closest('[data-slot="button-group"]')?.getAttribute('data-variant') === 'solid',
    )
    await expect(softOnBand).toBeDefined()
    await expect(getComputedStyle(softOnBand!).color).toBe(solidLabel)

    // A solid segment's inset ring is drawn in its label colour: in light mode
    // the ink and the fill are the same token, so an ink ring inside the fill
    // would be invisible.
    firstSave!.focus()
    const focused = getComputedStyle(firstSave!)
    await expect(focused.outlineWidth).toBe('2px')
    await expect(focused.outlineColor).toBe(focused.color)
  },
}

export const Dark: Story = {
  render: () => <AllVariants />,
  globals: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Button's dark-mode hover overlay grows 1px to cover its own border; in
    // a group that 1px is the divider, so a segment keeps the overlay inside.
    const [paste] = canvas.getAllByRole('button', { name: 'Paste' })
    const overlay = getComputedStyle(paste!, '::after')
    await expect(overlay.top).toBe('0px')
    await expect(overlay.left).toBe('0px')

    // The band's label colour still reaches its defaulted segments in dark.
    const [save] = canvas.getAllByRole('button', { name: 'Save' })
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Yes' })).color).toBe(
      getComputedStyle(save!).color,
    )
  },
}

export const GroupColour: Story = {
  render: () => (
    <div className='flex gap-4'>
      <ButtonGroup color='danger' aria-label='Danger'>
        <Button>Inherits</Button>
        <Button color='grey'>Own colour</Button>
      </ButtonGroup>
      <Button color='danger'>Reference</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const reference = fillOf(canvas.getByRole('button', { name: 'Reference' }))
    // The group's colour is the segment's default…
    await expect(fillOf(canvas.getByRole('button', { name: 'Inherits' }))).toBe(reference)
    // …and a segment naming its own colour keeps it.
    await expect(fillOf(canvas.getByRole('button', { name: 'Own colour' }))).not.toBe(reference)
  },
}

export const GroupSize: Story = {
  render: () => (
    <div className='flex items-start gap-4'>
      <ButtonGroup size='sm' aria-label='Small'>
        <Button>Small segment</Button>
      </ButtonGroup>
      <ButtonGroup aria-label='Default'>
        <Button>Default segment</Button>
      </ButtonGroup>
      {/* Segments stretch to the tallest in their group, so the override
          sits in a group of its own to be measured. */}
      <ButtonGroup size='sm' aria-label='Override'>
        <Button size='lg'>Own size</Button>
      </ButtonGroup>
      <Button size='sm'>Small reference</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heightOf = (name: string) =>
      canvas.getByRole('button', { name }).getBoundingClientRect().height
    // The group's size is the segment's default…
    await expect(heightOf('Small segment')).toBe(heightOf('Small reference'))
    await expect(heightOf('Small segment')).toBeLessThan(heightOf('Default segment'))
    // …and a segment naming its own size keeps it.
    await expect(heightOf('Own size')).toBeGreaterThan(heightOf('Default segment'))
  },
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [first, middle] = canvas.getAllByRole('button')
    // The divider moves to the top edge, and the horizontal rule stays off.
    const styles = getComputedStyle(middle!)
    await expect(isPainted(styles.borderTopColor)).toBe(true)
    await expect(isPainted(styles.borderLeftColor)).toBe(false)
    await expect(isPainted(getComputedStyle(first!).borderTopColor)).toBe(false)
  },
}

export const SplitButton: Story = {
  render: () => (
    <div className='flex gap-4'>
      <ButtonGroup>
        <Button variant='solid'>Save</Button>
        <Button
          variant='solid'
          iconOnly
          aria-label='More save options'
          leadingVisual={IconExpandMore}
        />
      </ButtonGroup>
      <ButtonGroup aria-label='Plain'>
        <Button>Copy</Button>
        <Button>Paste</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Two solid segments divide with a reversed hairline, not the ink divider
    // (which would vanish on the fill).
    const seam = getComputedStyle(
      canvas.getByRole('button', { name: 'More save options' }),
    ).borderLeftColor
    const divider = getComputedStyle(canvas.getByRole('button', { name: 'Paste' })).borderLeftColor
    await expect(isPainted(seam)).toBe(true)
    await expect(seam).not.toBe(divider)
  },
}

export const OutlineChildren: Story = {
  render: () => (
    <ButtonGroup aria-label='Idiom'>
      <Button variant='outline'>Copy</Button>
      <Button variant='ghost'>Paste</Button>
      <Button variant='link'>Cut</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    // The shadcn idiom — `variant='outline'` on every child — draws no second
    // border: a child without emphasis renders as a plain segment, whatever
    // it asked for.
    for (const button of within(canvasElement).getAllByRole('button')) {
      await expect(button).toHaveAttribute('data-variant', 'ghost')
      await expect(button).toHaveAttribute('data-segment', 'default')
      await expect(getComputedStyle(button).borderTopWidth).toBe('1px')
    }
  },
}

export const WithButtonLink: Story = {
  render: () => (
    <ButtonGroup aria-label='Mixed'>
      <ButtonLink href='#docs'>Docs</ButtonLink>
      <Button>Act</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'Docs' })
    await expect(link).toHaveAttribute('data-segment', 'default')
    await expect(link).toHaveAttribute('data-variant', 'ghost')
    // The link is a segment like any other, so the Button after it divides
    // from it.
    await expect(
      isPainted(getComputedStyle(canvas.getByRole('button', { name: 'Act' })).borderLeftColor),
    ).toBe(true)
  },
}

export const SeparatorOrientation: Story = {
  render: () => (
    <div className='flex gap-4'>
      <ButtonGroup orientation='vertical' aria-label='Vertical'>
        <Button>Top</Button>
        <ButtonGroupSeparator />
        <Button>Bottom</Button>
      </ButtonGroup>
      <ButtonGroup aria-label='Horizontal'>
        <Button>Left</Button>
        <ButtonGroupSeparator />
        <Button>Right</Button>
      </ButtonGroup>
      <ButtonGroup aria-label='Explicit'>
        <Button>A</Button>
        <ButtonGroupSeparator orientation='horizontal' />
        <Button>B</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // A separator crosses the group's axis unless told otherwise.
    const [inVertical, inHorizontal, explicit] = within(canvasElement).getAllByRole('separator')
    await expect(inVertical).toHaveAttribute('data-orientation', 'horizontal')
    await expect(inHorizontal).toHaveAttribute('data-orientation', 'vertical')
    await expect(explicit).toHaveAttribute('data-orientation', 'horizontal')
  },
}

export const DisabledSegment: Story = {
  render: () => (
    <ButtonGroup aria-label='Clipboard'>
      <Button>Rest</Button>
      <Button disabled>Off</Button>
      <Button>After</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rest = getComputedStyle(canvas.getByRole('button', { name: 'Rest' }))
    const off = getComputedStyle(canvas.getByRole('button', { name: 'Off' }))
    const after = getComputedStyle(canvas.getByRole('button', { name: 'After' }))
    // A disabled segment fades itself, so the boundary before it is drawn on
    // the segment before it, at full strength; its own leading edge stays
    // clear, and the boundary after it belongs to the next segment as usual.
    await expect(isPainted(rest.borderRightColor)).toBe(true)
    await expect(isPainted(off.borderLeftColor)).toBe(false)
    await expect(isPainted(after.borderLeftColor)).toBe(true)
  },
}

export const InPortal: Story = {
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
          <Button>Save as draft</Button>
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
    // its portal, so it renders as an ordinary solid Button.
    const inside = await screen.findByRole('button', { name: 'Save as draft' })
    await expect(inside).not.toHaveAttribute('data-segment')
    await expect(inside).toHaveAttribute('data-variant', 'solid')
    await expect(getComputedStyle(inside).borderTopLeftRadius).not.toBe('0px')
  },
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
