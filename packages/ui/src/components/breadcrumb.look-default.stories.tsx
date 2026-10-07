/**
 * Breadcrumb — Looks / Default
 *
 * The no-chrome look: underlined links above the page heading, in the content
 * column. The docs page is the shared look layout; the stories are the same
 * scenes on their own canvas, in light, dark and at phone width.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Breadcrumb } from './breadcrumb.js'
import { BreadcrumbLookPage, BreadcrumbScene } from './story-helpers.js'

function DefaultLookDocs() {
  return (
    <BreadcrumbLookPage
      name='Default'
      look='default'
      summary='Underlined links in the ink, separated by chevrons, with no background or rules of its own. It is the trail for most pages: it says where the page sits and gets out of the way of the heading below it.'
      useWhen={[
        'The page has an ordinary heading and content column.',
        'You are unsure which look to use.',
        'The trail sits inside a card, panel or narrow column.',
      ]}
      avoidWhen={[
        'The trail should continue a dark Header as page chrome (use Band).',
        'The trail should read as part of a white or light Header (use Soft).',
        'A quiet page wants the line system to frame the trail (use Rail).',
      ]}
      pairing='Sits in the content column, aligned with the heading, under any Header colour.'
      doDont={{
        do: {
          caption: 'place it directly above the page heading, aligned with it.',
          scene: <BreadcrumbScene look='default' header='white' />,
        },
        dont: {
          caption:
            'put it in a coloured strip under the Header. That is page chrome: use Band or Soft, which take the Header’s inset and pair with its colour.',
          scene: (
            <BreadcrumbScene
              look='default'
              header='white'
              placement='chrome'
              strip='bg-muted py-2 max-sm:px-4 sm:max-lg:px-6 lg:px-12'
            />
          ),
        },
      }}
      code={`<Breadcrumb>
  <BreadcrumbList>…</BreadcrumbList>
</Breadcrumb>`}
    />
  )
}

const meta = {
  title: 'Components/Breadcrumb/Looks/Default',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { page: DefaultLookDocs } },
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

export const InContext: Story = {
  name: 'In context',
  parameters: { layout: 'fullscreen' },
  render: () => <BreadcrumbScene look='default' header='white' heading='h1' />,
  play: async ({ canvasElement }) => {
    // The trail is secondary to the heading it sits above.
    const h1 = canvasElement.querySelector<HTMLElement>('h1')!
    const link = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"] a')!
    await expect(parseFloat(getComputedStyle(h1).fontSize)).toBeGreaterThan(
      parseFloat(getComputedStyle(link).fontSize),
    )
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
      look='default'
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
      look='default'
      header='white'
      heading='h1'
      framed={false}
      labels={['Home']}
      current='Contact us'
    />
  ),
}
