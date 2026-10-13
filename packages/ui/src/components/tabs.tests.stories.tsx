/**
 * Tabs — Tests
 *
 * CSS check: proves globals.css loaded and the default list's fill resolves.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { expectNullVariantsMatchDefault, queryVariantPair } from './story-helpers.js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js'

const meta = {
  title: 'Components/Tabs/Tests',
  component: Tabs,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
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

export const CssCheck: Story = {
  name: 'CSS check',
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

/**
 * TabsList resolves its variant once and sends that value to its own classes,
 * its `data-variant` and the context every TabsTrigger styles itself from. A
 * `null` variant once left the list unstyled while its triggers took the
 * default, so the list and a trigger are both held to the default spelling
 * (see `expectNullVariantsMatchDefault`). `variant` has no native attribute to
 * collide with.
 */
export const NullVariantsAreTheDefaults: Story = {
  name: 'Null variants are the defaults',
  render: () => (
    <div className='space-y-4'>
      {[undefined, null].map((variant) => (
        <Tabs key={String(variant)} defaultValue='overview' className='max-w-md'>
          <TabsList variant={variant}>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='details'>Details</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>The overview panel content.</TabsContent>
          <TabsContent value='details'>The details panel content.</TabsContent>
        </Tabs>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [byDefault, byNull] = queryVariantPair(canvasElement, 'tabs-list')
    expectNullVariantsMatchDefault(byDefault, byNull, {
      attrs: { variant: 'default' },
      sentinelClass: 'bg-muted',
    })

    // The context half: a trigger under the null list must style itself
    // exactly as one under the default list.
    const triggerDefault = byDefault.querySelector<HTMLElement>('[data-slot="tabs-trigger"]')
    const triggerNull = byNull.querySelector<HTMLElement>('[data-slot="tabs-trigger"]')
    if (!triggerDefault || !triggerNull) {
      throw new Error('Expected a [data-slot="tabs-trigger"] inside each list.')
    }
    if (triggerNull.className !== triggerDefault.className) {
      throw new Error(
        `Expected a trigger under the null list to match the default:\n  default: ${triggerDefault.className}\n  null:    ${triggerNull.className}`,
      )
    }
  },
}
