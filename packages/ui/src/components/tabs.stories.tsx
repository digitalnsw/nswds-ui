/**
 * Tabs — Default, Variants, CssCheck
 *
 * A set of layered sections shown one at a time, on the Base UI Tabs primitive.
 * Base UI owns the roving-tabindex keyboard model, ARIA and active-panel
 * switching; we style the list, triggers and panels. Each TabsTrigger pairs
 * with a TabsContent sharing the same `value`.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabbed sections built on the Base UI Tabs primitive. Give Tabs a `defaultValue`, and pair each TabsTrigger with a TabsContent by `value`. The `default` and `line` list variants are available via `tabsListVariants`.',
      },
    },
  },
  render: (args) => (
    <Tabs {...args} defaultValue='overview' className='max-w-md'>
      <TabsList>
        <TabsTrigger value='overview'>Overview</TabsTrigger>
        <TabsTrigger value='details'>Details</TabsTrigger>
      </TabsList>
      <TabsContent value='overview'>The overview panel content.</TabsContent>
      <TabsContent value='details'>The details panel content.</TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const triggers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]')
    await expect(triggers.length).toBe(2)

    // The first tab is active on mount — Base UI reflects it in data-selected /
    // aria-selected.
    await expect(triggers[0]).toHaveAttribute('aria-selected', 'true')

    // Activating the second tab must switch the visible panel. Base UI mounts
    // the matching panel and marks the trigger selected.
    await userEvent.click(triggers[1]!)
    await expect(triggers[1]).toHaveAttribute('aria-selected', 'true')

    // The matching panel becomes visible. findByText waits for the switch and
    // is agnostic to whether Base UI unmounts or just hides the inactive panel.
    const panel = await within(canvasElement).findByText('The details panel content.')
    await expect(panel).toBeVisible()
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='flex max-w-2xl flex-col gap-10'>
      {/* default — segmented control */}
      <Tabs defaultValue='one' className='max-w-md'>
        <TabsList>
          <TabsTrigger value='one'>Eligibility</TabsTrigger>
          <TabsTrigger value='two'>How to apply</TabsTrigger>
          <TabsTrigger value='three'>Fees</TabsTrigger>
        </TabsList>
        <TabsContent value='one'>The default variant is a segmented control.</TabsContent>
        <TabsContent value='two'>The steps to submit an application.</TabsContent>
        <TabsContent value='three'>What the service costs.</TabsContent>
      </Tabs>

      {/* line — underline, left-aligned */}
      <Tabs defaultValue='one'>
        <TabsList variant='line'>
          <TabsTrigger value='one'>Eligibility</TabsTrigger>
          <TabsTrigger value='two'>How to apply</TabsTrigger>
          <TabsTrigger value='three'>Fees</TabsTrigger>
        </TabsList>
        <TabsContent value='one'>The line variant underlines the active tab.</TabsContent>
        <TabsContent value='two'>The steps to submit an application.</TabsContent>
        <TabsContent value='three'>What the service costs.</TabsContent>
      </Tabs>

      {/* fullwidth — underline stretched to equal columns */}
      <Tabs defaultValue='team'>
        <TabsList variant='fullwidth'>
          <TabsTrigger value='account'>My Account</TabsTrigger>
          <TabsTrigger value='company'>Company</TabsTrigger>
          <TabsTrigger value='team'>Team Members</TabsTrigger>
          <TabsTrigger value='billing'>Billing</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>Your personal details.</TabsContent>
        <TabsContent value='company'>Organisation settings.</TabsContent>
        <TabsContent value='team'>The fullwidth variant fills equal columns.</TabsContent>
        <TabsContent value='billing'>Payment and invoices.</TabsContent>
      </Tabs>

      {/* bordered — divided cells in an enclosed card */}
      <Tabs defaultValue='team'>
        <TabsList variant='bordered'>
          <TabsTrigger value='account'>My Account</TabsTrigger>
          <TabsTrigger value='company'>Company</TabsTrigger>
          <TabsTrigger value='team'>Team Members</TabsTrigger>
          <TabsTrigger value='billing'>Billing</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>Your personal details.</TabsContent>
        <TabsContent value='company'>Organisation settings.</TabsContent>
        <TabsContent value='team'>The bordered variant divides equal cells.</TabsContent>
        <TabsContent value='billing'>Payment and invoices.</TabsContent>
      </Tabs>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the tabs list's `bg-muted` (default variant)
    // resolves to a real colour rather than staying transparent.
    const list = canvasElement.querySelector<HTMLElement>('[data-slot="tabs-list"]')
    if (!list) {
      throw new Error('Could not find [data-slot="tabs-list"].')
    }
    const background = getComputedStyle(list).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected the --muted token to resolve, received "${background}".`)
    }
  },
}
