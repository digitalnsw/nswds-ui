/**
 * Breadcrumb — Looks / Soft
 *
 * A 10% ink tint with a 30% ink hairline under it: quiet page chrome that
 * continues a white or light Header.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Breadcrumb } from './breadcrumb.js'
import { BreadcrumbLookPage, BreadcrumbScene } from './story-helpers.js'

/** The Soft look's docs page, laid out by the shared BreadcrumbLookPage. */
function SoftLookDocs() {
  return (
    <BreadcrumbLookPage
      name='Soft'
      look='soft'
      header='white'
      summary='A light ink tint with a hairline under it. It separates the trail from the content like the band does, but quietly, so it suits pages whose Header is white or light.'
      useWhen={[
        'The page uses Header white or light and the trail should read as part of the page chrome.',
        'Content starts straight after the trail and needs a clear boundary from it.',
        'The band would be too heavy for the page.',
      ]}
      avoidWhen={[
        'The Header is dark (use Band, which continues it).',
        'The page or section behind the trail is already tinted: the tint disappears into it.',
        'The trail sits inside a card or panel (use Default).',
      ]}
      pairing='Pairs with Header white or light. Its content lines up with the Header’s brand at every breakpoint, and its tint follows the ink, so it flips in dark mode with nothing restated.'
      doDont={{
        do: {
          caption: 'place it under a white or light Header, as the first strip of the page.',
          scene: <BreadcrumbScene look='soft' header='white' />,
        },
        dont: {
          caption:
            'place it on a tinted section; the tint vanishes into it and only the hairline is left.',
          scene: <BreadcrumbScene look='soft' header='white' surface='muted' />,
        },
      }}
      code={`<Header color="white">…</Header>
<Breadcrumb variant="soft">
  <BreadcrumbList>…</BreadcrumbList>
</Breadcrumb>`}
    />
  )
}

const meta = {
  title: 'Components/Breadcrumb/Looks/Soft',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { page: SoftLookDocs } },
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

export const InContext: Story = {
  name: 'In context',
  parameters: { layout: 'fullscreen' },
  render: () => <BreadcrumbScene look='soft' header='white' heading='h1' />,
  play: async ({ canvasElement }) => {
    // Its content lines up with the Header's brand.
    const contentStart = (el: HTMLElement) =>
      el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft)
    const headerRow = canvasElement.querySelector<HTMLElement>('header > div')!
    const list = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb-list"]')!
    await expect(Math.abs(contentStart(list) - contentStart(headerRow))).toBeLessThan(1)
  },
}

export const InContextDark: Story = {
  ...InContext,
  name: 'In context (dark)',
  globals: { theme: 'dark' },
}

/**
 * The page at phone width. Embedded in the docs page in a 375px iframe, and
 * opened at a phone viewport in the canvas, so it is the real behaviour: this
 * trail would wrap, so it shortens to Home and the parent page.
 */
export const Phone: Story = {
  name: 'On a phone',
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  render: () => (
    <BreadcrumbScene
      look='soft'
      header='white'
      heading='h1'
      framed={false}
      labels={['Home', 'Services', 'Licences and permits']}
    />
  ),
}

/** The page at phone width with a trail that fits: it stays whole. */
export const PhoneShort: Story = {
  ...Phone,
  name: 'On a phone, short trail',
  render: () => (
    <BreadcrumbScene
      look='soft'
      header='white'
      heading='h1'
      framed={false}
      labels={['Home']}
      current='Contact us'
    />
  ),
}
