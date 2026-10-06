/**
 * Breadcrumb — Looks / Rail
 *
 * The masterbrand line system: hairlines above and below in the text colour,
 * slash separators.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Breadcrumb } from './breadcrumb.js'
import { BreadcrumbLookPage, BreadcrumbScene } from './story-helpers.js'

function RailLookDocs() {
  return (
    <BreadcrumbLookPage
      name='Rail'
      look='rail'
      summary='The masterbrand line system: a hairline above and below the trail in the text colour, with slash separators. It frames the trail as a deliberate band of page furniture without adding colour.'
      useWhen={[
        'A quiet content page with no hero, where the trail benefits from a frame.',
        'The page already uses hairlines to divide its sections.',
      ]}
      avoidWhen={[
        'The trail sits directly under a Header with its own bottom rule (two lines stack).',
        'The trail should continue a coloured Header (use Band or Soft).',
      ]}
      pairing='Sits in the content column. Its hairlines are a recorded exception to the Hairline Rule: they take the text colour because the line is the look.'
      doDont={{
        do: {
          caption: 'use it on a quiet page whose sections are divided by hairlines.',
          scene: <BreadcrumbScene look='rail' header='white' />,
        },
        dont: {
          caption:
            'stack it under another rule, such as a bordered panel edge; the doubled lines read as a mistake.',
          scene: (
            <div className='rounded-md border-t-2 border-foreground'>
              <BreadcrumbScene look='rail' />
            </div>
          ),
        },
      }}
      code={`<Breadcrumb variant="rail">
  <BreadcrumbList>…</BreadcrumbList>
</Breadcrumb>`}
    />
  )
}

const meta = {
  title: 'Components/Breadcrumb/Looks/Rail',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { page: RailLookDocs } },
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

export const InContext: Story = {
  name: 'In context',
  parameters: { layout: 'fullscreen' },
  render: () => <BreadcrumbScene look='rail' header='white' heading='h1' />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    const style = getComputedStyle(nav)
    // Hairlines in the text colour, above and below.
    await expect(style.borderTopWidth).toBe('1px')
    await expect(style.borderBottomWidth).toBe('1px')
    const heading = canvasElement.querySelector<HTMLElement>('h1')!
    await expect(style.borderTopColor).toBe(getComputedStyle(heading).color)
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
      look='rail'
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
      look='rail'
      header='white'
      heading='h1'
      framed={false}
      labels={['Home']}
      current='Contact us'
    />
  ),
}
