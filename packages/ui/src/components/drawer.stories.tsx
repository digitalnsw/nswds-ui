/**
 * Drawer — an edge-anchored panel that slides in from any side, built on Vaul.
 * Vaul adds touch-drag dismissal on top of an accessible dialog.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer.js'

const triggerClasses =
  'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An edge-anchored panel that slides in from any side, built on Vaul. Supports touch-drag dismissal on top of an accessible dialog.',
      },
    },
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger className={triggerClasses}>Open drawer</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>
            A short description of what this drawer contains.
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-slot="drawer-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="drawer-trigger"].')
    }
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['top', 'right', 'bottom', 'left'] as const).map((direction) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
            {direction}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Direction: {direction}</DrawerTitle>
              <DrawerDescription>
                Slides in from the {direction}.
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the trigger resolves the semantic
    // --primary token to a real, non-transparent colour.
    const trigger = canvasElement.querySelector<HTMLElement>(
      '[data-slot="drawer-trigger"]'
    )
    if (!trigger) throw new Error('Drawer trigger not found.')
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --primary token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`
      )
    }
  },
}
