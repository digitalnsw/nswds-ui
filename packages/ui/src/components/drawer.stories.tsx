/**
 * Drawer — an edge-anchored panel that slides in from any side, built on Vaul.
 * Vaul adds touch-drag dismissal on top of an accessible dialog.
 *
 *   Components/Drawer                → this file: Docs, Default, Playground
 *   Components/Drawer/Features       → drawer.features.stories.tsx
 *   Components/Drawer/Accessibility  → drawer.accessibility.stories.tsx
 *   Components/Drawer/Tests          → drawer.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from './button.js'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer.js'
import {
  closeOverlay,
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const directions = ['bottom', 'top', 'right', 'left'] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function DirectionsSection() {
  return (
    <ExampleSection
      title='Directions'
      description={
        <>
          <code>direction</code> on the <code>Drawer</code> root sets the edge it slides in from,
          and the direction the reader drags to dismiss it. Bottom is the default and the one
          readers expect on a phone; it shows a drag handle.
        </>
      }
    >
      <Example code={`<Drawer direction="right">…</Drawer>`}>
        {directions.map((direction) => (
          <ExampleCell key={direction} label={direction}>
            <Drawer direction={direction}>
              <DrawerTrigger asChild>
                <Button variant='outline'>From the {direction}</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Your appointment</DrawerTitle>
                  <DrawerDescription>
                    Tuesday 14 October at 10.30am, Service NSW Parramatta.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant='outline'>Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function FooterActionsSection() {
  return (
    <ExampleSection
      title='Footer actions'
      description={
        <>
          <code>DrawerFooter</code> stacks its buttons full width, primary first, so each is an easy
          thumb target. A drawer has no close button of its own — wrap at least one footer button in{' '}
          <code>DrawerClose</code>, because not every reader can drag.
        </>
      }
    >
      <Example
        code={`<DrawerFooter>
  <Button>Confirm</Button>
  <DrawerClose asChild>
    <Button variant="outline">Cancel</Button>
  </DrawerClose>
</DrawerFooter>`}
      >
        <ExampleCell label='one action'>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant='outline'>Opening hours</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Service NSW Parramatta</DrawerTitle>
                <DrawerDescription>Open Monday to Friday, 8.30am to 5pm.</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant='outline'>Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </ExampleCell>
        <ExampleCell label='primary and cancel'>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant='outline'>Share location</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Share your location?</DrawerTitle>
                <DrawerDescription>
                  We use it once to list the service centres nearest to you.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Share location</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant='outline'>Not now</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function ControlledExample() {
  const [open, setOpen] = useState(false)
  const [reminder, setReminder] = useState<string | null>(null)
  const choose = (when: string) => {
    setReminder(when)
    setOpen(false)
  }
  return (
    <div className='flex flex-col items-start gap-4'>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant='outline'>Set a renewal reminder</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>When should we remind you?</DrawerTitle>
            <DrawerDescription>
              Your registration for ABC12D is due on 14 November.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={() => choose('2 weeks before')}>2 weeks before</Button>
            <Button variant='outline' onClick={() => choose('1 week before')}>
              1 week before
            </Button>
            <DrawerClose asChild>
              <Button variant='ghost'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <p className='text-muted-foreground' aria-live='polite'>
        {reminder ? `We will remind you ${reminder}.` : 'No reminder set.'}
      </p>
    </div>
  )
}

export function ControlledSection() {
  return (
    <ExampleSection
      title='Controlled'
      description={
        <>
          Pass <code>open</code> and <code>onOpenChange</code> to close the drawer from your own
          code once a choice has been saved. Dragging, Escape and an outside click still close it
          through <code>onOpenChange</code>.
        </>
      }
    >
      <Example
        code={`const [open, setOpen] = useState(false)

<Drawer open={open} onOpenChange={setOpen}>
  …
  <Button onClick={async () => {
    await saveReminder()
    setOpen(false)
  }}>2 weeks before</Button>
</Drawer>`}
      >
        <ControlledExample />
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Quick actions for one booking in a list, opened from the bottom of a phone screen. The destructive choice sits below the safe one, and Close is always there for readers who cannot drag.'
    >
      <Example
        code={`<DrawerFooter>
  <DrawerClose asChild>
    <Button>Reschedule</Button>
  </DrawerClose>
  <DrawerClose asChild>
    <Button variant="outline" color="danger">Cancel booking</Button>
  </DrawerClose>
  <DrawerClose asChild>
    <Button variant="ghost">Close</Button>
  </DrawerClose>
</DrawerFooter>`}
      >
        <div className='w-full max-w-sm space-y-3 rounded-md bg-background p-6 ring-1 ring-foreground/10'>
          <p className='font-semibold'>Driver knowledge test</p>
          <p className='text-muted-foreground'>Tuesday 14 October, 10.30am</p>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant='outline' size='sm'>
                Manage booking
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Manage your booking</DrawerTitle>
                <DrawerDescription>Driver knowledge test, Tuesday 14 October.</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Reschedule</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant='outline' color='danger'>
                    Cancel booking
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant='ghost'>Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function DrawerDocs() {
  return (
    <DocsPage
      title='Drawer'
      npm={[
        'Drawer',
        'DrawerTrigger',
        'DrawerContent',
        'DrawerHeader',
        'DrawerTitle',
        'DrawerDescription',
        'DrawerFooter',
        'DrawerClose',
      ]}
      registry='drawer'
      summary={
        <>
          A panel that slides in from an edge and can be dragged away, built on Vaul. It behaves as
          a modal dialog — focus is trapped and Escape closes it — with the touch gesture a phone
          reader expects on top.
        </>
      }
    >
      <DocsUsage
        use={[
          'Quick actions for an item on a phone, opened from the bottom.',
          'Short supporting detail a touch reader swipes away when done.',
          'A mobile-first flow where a bottom sheet is the familiar pattern.',
        ]}
        avoid={[
          'Filters, settings or a long task beside the page — use Sheet.',
          'A focused task or question in the middle of the screen — use Dialog.',
          'Confirming a consequential action — use AlertDialog.',
        ]}
      />
      <DirectionsSection />
      <FooterActionsSection />
      <ControlledSection />
      <InContextSection />
      <DocsApi description='Props of the Drawer root (Vaul). Try them live in the Playground story.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: DrawerDocs },
  },
  args: {
    direction: 'bottom',
    dismissible: true,
    modal: true,
    onOpenChange: fn(),
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: directions,
      description: 'The edge the drawer slides in from, and the way it is dragged to dismiss.',
      table: { category: 'Appearance' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the drawer is open on first render (uncontrolled).',
      table: { category: 'Behavior' },
    },
    open: {
      control: false,
      description: 'Whether the drawer is open. Pair with onOpenChange to control it.',
      table: { category: 'Behavior' },
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether dragging, Escape or an outside click can close the drawer.',
      table: { category: 'Behavior' },
    },
    modal: {
      control: 'boolean',
      description: 'Whether the page behind is inert while the drawer is open.',
      table: { category: 'Behavior' },
    },
    onOpenChange: {
      description: 'Called when the drawer opens or closes (logged in the Actions panel).',
      table: { category: 'Events' },
    },
    children: { table: { disable: true } },
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button>View appointment</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Your appointment</DrawerTitle>
          <DrawerDescription>
            Tuesday 14 October at 10.30am, Service NSW Parramatta.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline'>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'View appointment' }))
    // The drawer is portaled, so query the whole document, not the canvas.
    const drawer = await within(document.body).findByRole(
      'dialog',
      { name: 'Your appointment' },
      { timeout: 3000 },
    )
    await expect(drawer).toHaveAttribute('data-vaul-drawer-direction', 'bottom')
    await closeOverlay('drawer-content')
  },
}

export const Playground: Story = {}
