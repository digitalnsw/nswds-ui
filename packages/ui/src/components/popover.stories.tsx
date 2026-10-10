/**
 * Popover — a floating panel anchored to a trigger, on the Base UI popover
 * primitive. Base UI handles focus management, positioning, and dismissal.
 *
 *   Components/Popover        → this file: Docs, Default, Playground and one
 *                               story per docs section
 *   Components/Popover/Tests  → popover.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { IconHelp } from '../icons/index.js'
import { Button } from './button.js'
import { Input } from './input.js'
import { Label } from './label.js'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover.js'
import {
  closeOverlay,
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

type Side = NonNullable<ComponentProps<typeof PopoverContent>['side']>
type Align = NonNullable<ComponentProps<typeof PopoverContent>['align']>

const sides: Side[] = ['bottom', 'top', 'left', 'right']
const aligns: Align[] = ['start', 'center', 'end']

function HoursPopover({ side, align, trigger }: { side?: Side; align?: Align; trigger: string }) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant='outline' />}>{trigger}</PopoverTrigger>
      <PopoverContent side={side} align={align}>
        <PopoverHeader>
          <PopoverTitle>Opening hours</PopoverTitle>
          <PopoverDescription>Monday to Friday, 8.30am to 5pm.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function PlacementSection() {
  return (
    <ExampleSection
      title='Placement'
      description={
        <>
          <code>side</code> picks the edge of the trigger the popover opens from, and{' '}
          <code>align</code> where it lines up along that edge. Both are preferences: Base UI flips
          and shifts the popover to keep it on screen.
        </>
      }
    >
      <Example code={`<PopoverContent side="right">…</PopoverContent>`}>
        {sides.map((side) => (
          <ExampleCell key={side} label={`side="${side}"`}>
            <HoursPopover side={side} trigger={`Hours (${side})`} />
          </ExampleCell>
        ))}
      </Example>
      <Example code={`<PopoverContent align="start">…</PopoverContent>`}>
        {aligns.map((align) => (
          <ExampleCell key={align} label={`align="${align}"`}>
            <HoursPopover align={align} trigger={`Hours (${align})`} />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Help for a form field, opened from an icon button beside its label. The popover holds a short explanation the reader can keep open while they type.'
    >
      <Example
        code={`<Popover>
  <PopoverTrigger render={<Button variant="ghost" size="icon" aria-label="About concession cards" leadingVisual={IconHelp} />} />
  <PopoverContent align="start">…</PopoverContent>
</Popover>`}
      >
        <div className='grid w-full max-w-sm gap-2'>
          <div className='flex items-center gap-1'>
            <Label htmlFor='concession-number'>Concession card number</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label='About concession cards'
                    leadingVisual={IconHelp}
                  />
                }
              />
              <PopoverContent align='start'>
                <PopoverHeader>
                  <PopoverTitle>About concession cards</PopoverTitle>
                  <PopoverDescription>
                    Enter the number on your Pensioner Concession Card or Health Care Card. It is
                    printed under your name.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          </div>
          <Input id='concession-number' inputMode='numeric' />
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function PopoverDocs() {
  return (
    <DocsPage
      title='Popover'
      npm={[
        'Popover',
        'PopoverTrigger',
        'PopoverContent',
        'PopoverHeader',
        'PopoverTitle',
        'PopoverDescription',
      ]}
      registry='popover'
      summary={
        <>
          A small floating panel anchored to the control that opens it, for supporting content the
          reader asks for. It opens on a click, keeps the page usable behind it, and closes on
          Escape or a click outside. Base UI positions it and manages focus.
        </>
      }
    >
      <DocsUsage
        use={[
          'Help or detail a reader asks for, like what a field means.',
          'A few quick settings or a short form tied to one control.',
          'Content that may hold links or buttons the reader needs to reach.',
        ]}
        avoid={[
          'A short label for an icon button — use Tooltip.',
          'A preview of where a link goes, shown on hover — use HoverCard.',
          'A list of actions or options — use DropdownMenu.',
        ]}
      />
      <PlacementSection />
      <InContextSection />
      <DocsApi description='Props of the Popover root, plus the placement set on PopoverContent. Try them live in the Playground story.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * Placement is set on `PopoverContent`, not on the root the meta documents, so
 * the args type is widened to let the Playground switch it.
 */
type StoryArgs = ComponentProps<typeof Popover> & { side?: Side; align?: Align }

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: PopoverDocs },
  },
  args: {
    side: 'bottom',
    align: 'center',
    modal: false,
    onOpenChange: fn(),
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: sides,
      description: 'Set on PopoverContent: the edge of the trigger it opens from.',
      table: { category: 'Appearance' },
    },
    align: {
      control: 'inline-radio',
      options: aligns,
      description: 'Set on PopoverContent: where it lines up along that edge.',
      table: { category: 'Appearance' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the popover is open on first render (uncontrolled).',
      table: { category: 'Behavior' },
    },
    open: {
      control: false,
      description: 'Whether the popover is open. Pair with onOpenChange to control it.',
      table: { category: 'Behavior' },
    },
    modal: {
      control: 'inline-radio',
      options: [false, true, 'trap-focus'],
      description:
        'false leaves the page usable; true locks scroll and blocks outside clicks; trap-focus keeps focus inside.',
      table: { category: 'Behavior' },
    },
    onOpenChange: {
      description: 'Called when the popover opens or closes (logged in the Actions panel).',
      table: { category: 'Events' },
    },
    onOpenChangeComplete: {
      description: 'Called once the open or close transition has finished.',
      table: { category: 'Events' },
    },
    actionsRef: { table: { disable: true } },
    handle: { table: { disable: true } },
    triggerId: { table: { disable: true } },
    defaultTriggerId: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: ({ side, align, ...args }) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant='outline' />}>Opening hours</PopoverTrigger>
      <PopoverContent side={side} align={align}>
        <PopoverHeader>
          <PopoverTitle>Service NSW Parramatta</PopoverTitle>
          <PopoverDescription>Open Monday to Friday, 8.30am to 5pm.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Opening hours' }))
    // The popup is portaled, so query the whole document, not the canvas.
    const popover = await within(document.body).findByRole(
      'dialog',
      { name: 'Service NSW Parramatta' },
      { timeout: 3000 },
    )
    await expect(popover).toHaveAccessibleDescription('Open Monday to Friday, 8.30am to 5pm.')
    await closeOverlay('popover-content')
  },
}

export const Playground: Story = {}

export const Placement: Story = { name: 'Placement', render: () => <PlacementSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
