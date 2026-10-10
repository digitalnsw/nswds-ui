/**
 * Drawer — an edge-anchored panel that slides in from any side, built on Vaul.
 * Vaul adds touch-drag dismissal on top of an accessible dialog.
 *
 *   Components/Drawer        → this file: Docs, Default, Playground and one
 *                              story per docs section
 *   Components/Drawer/Tests  → drawer.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
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
// Each section is one example story AND one part of the docs page.

function DirectionsSection() {
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
                <Button variant='outline'>Open from the {direction}</Button>
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

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Quick actions for one item in a list, opened from the bottom of a phone screen. A drawer has no close button of its own, so always give it a DrawerClose — not every reader can drag.'
    >
      <Example
        code={`<DrawerFooter>
  <Button>Reschedule</Button>
  <DrawerClose asChild>
    <Button variant="outline">Cancel</Button>
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

export const Directions: Story = { name: 'Directions', render: () => <DirectionsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
