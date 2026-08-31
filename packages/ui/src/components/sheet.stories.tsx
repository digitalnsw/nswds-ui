/**
 * Sheet — an edge-anchored dialog that slides in from any side, on the Base UI
 * dialog primitive. Base UI owns the focus trap, scroll lock, and dismissal.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet.js'

const triggerClasses = 'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An edge-anchored dialog that slides in from the top, right, bottom, or left. Base UI provides the focus trap, scroll lock, and Escape / outside-click dismissal.',
      },
    },
  },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger className={triggerClasses}>Open sheet</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Save when you are done.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-slot="sheet-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="sheet-trigger"].')
    }
  },
}

/**
 * The close button is icon-only and portaled, so `closeLabel` is the only name
 * AT ever hears for it and the only way a consumer can translate it. Nothing
 * opened the sheet before, so the whole path could have broken silently.
 */
export const TranslatedCloseLabel: Story = {
  name: 'Translated close label',
  render: () => (
    <Sheet>
      <SheetTrigger className={triggerClasses}>Open sheet</SheetTrigger>
      <SheetContent closeLabel='Cerrar panel'>
        <SheetHeader>
          <SheetTitle>Editar perfil</SheetTitle>
          <SheetDescription>Realice cambios en su perfil aquí.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="sheet-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="sheet-trigger"].')
    }
    trigger.click()

    // The popup is PORTALED to the document body, so query the whole document
    // rather than canvasElement — querying the canvas is how this assertion
    // would silently pass on nothing.
    const screen = within(document.body)
    const close = await waitFor(() => screen.getByRole('button', { name: 'Cerrar panel' }))
    await expect(close).toBeInTheDocument()

    // Close again so the suite's next story starts from a clean body and the
    // a11y pass does not run against a mounted dialog's focus guards.
    close.click()
    await waitFor(() =>
      expect(document.querySelector('[data-slot="sheet-content"]')).not.toBeInTheDocument(),
    )
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='flex flex-wrap gap-4'>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground'>
            {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Side: {side}</SheetTitle>
              <SheetDescription>Slides in from the {side}.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the trigger resolves the semantic
    // --primary token to a real, non-transparent colour.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="sheet-trigger"]')
    if (!trigger) throw new Error('Sheet trigger not found.')
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --primary token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}
