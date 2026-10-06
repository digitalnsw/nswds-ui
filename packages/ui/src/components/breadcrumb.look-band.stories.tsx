/**
 * Breadcrumb — Looks / Band
 *
 * The brand band: Blue 01 with white links, continuing `Header color="dark"`.
 * Its stories pin the pairing — flush under the Header in light and dark,
 * aligned with the brand — and its edge on a dark page with no Header.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Breadcrumb, BreadcrumbList } from './breadcrumb.js'
import { Header, HeaderBrand } from './header.js'
import { BreadcrumbLookPage, BreadcrumbScene, BreadcrumbSteps } from './story-helpers.js'

function BandLookDocs() {
  return (
    <BreadcrumbLookPage
      name='Band'
      look='band'
      header='dark'
      summary='A solid Blue 01 strip with white links: the brand band. It continues a dark Header, so the trail reads as part of the government page chrome rather than the content.'
      useWhen={[
        'The page uses Header dark and the trail should continue it.',
        'The page has no hero, so the band is the only strong colour at the top.',
        'A service wants the trail to feel official and fixed.',
      ]}
      avoidWhen={[
        'The Header is white or light (use Soft).',
        'A hero or banner in Blue 01 sits directly below: the bands merge into one slab.',
        'The trail sits inside content, such as a card (use Default).',
      ]}
      pairing='Pairs with Header dark: both are Blue 01 in light mode and both deepen to primary-950 in dark, so they sit flush in either. Its content lines up with the Header’s brand at every breakpoint. On a dark page with no Header above it, a faint hairline keeps its edge.'
      doDont={{
        do: {
          caption: 'place it directly under Header dark, so the two read as one piece of chrome.',
          scene: <BreadcrumbScene look='band' header='dark' />,
        },
        dont: {
          caption:
            'place it under a white Header; the strip reads as a stray block. Use Soft there.',
          scene: <BreadcrumbScene look='band' header='white' />,
        },
      }}
      code={`<Header color="dark">…</Header>
<Breadcrumb variant="band">
  <BreadcrumbList>…</BreadcrumbList>
</Breadcrumb>`}
    />
  )
}

const meta = {
  title: 'Components/Breadcrumb/Looks/Band',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { page: BandLookDocs } },
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The trail in its place: a band under `Header color="dark"`, above the page
 * heading. It shares the Header's background in both modes, its content lines
 * up with the Header's brand, and it stays secondary to the H1.
 */
export const InContext: Story = {
  name: 'In context',
  parameters: { layout: 'fullscreen' },
  render: () => <BreadcrumbScene look='band' header='dark' heading='h1' />,
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('header')!
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await expect(getComputedStyle(nav).backgroundColor).toBe(
      getComputedStyle(header).backgroundColor,
    )
    const contentStart = (el: HTMLElement) =>
      el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft)
    const headerRow = header.querySelector<HTMLElement>(':scope > div')!
    const list = nav.querySelector<HTMLElement>('[data-slot="breadcrumb-list"]')!
    await expect(Math.abs(contentStart(list) - contentStart(headerRow))).toBeLessThan(1)
    const h1 = canvasElement.querySelector<HTMLElement>('h1')!
    await expect(parseFloat(getComputedStyle(h1).fontSize)).toBeGreaterThan(
      parseFloat(getComputedStyle(nav.querySelector('a')!).fontSize),
    )
  },
}

export const InContextDark: Story = {
  ...InContext,
  name: 'In context (dark)',
  globals: { theme: 'dark' },
}

export const Phone: Story = {
  name: 'On a phone',
  render: () => (
    <BreadcrumbScene
      look='band'
      phone
      heading='h1'
      labels={['Home', 'Services', 'Licences and permits']}
    />
  ),
}

/**
 * On a dark page with no Header above it, the band keeps an edge: a hairline
 * in the ink at 15%, since `primary-950` alone sits ~1.06:1 on the canvas.
 */
export const OnDarkPage: Story = {
  name: 'On a dark page',
  globals: { theme: 'dark' },
  render: () => (
    <Breadcrumb variant='band'>
      <BreadcrumbList>
        <BreadcrumbSteps
          labels={['Home', 'Fishing']}
          current='Apply for a recreational fishing licence'
        />
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    const style = getComputedStyle(nav)
    await expect(style.borderBottomWidth).toBe('1px')
    await expect(style.borderBottomColor).not.toBe('rgba(0, 0, 0, 0)')
    await expect(nav.getBoundingClientRect().height % 4).toBe(0)
  },
}

/** Flush under the Header with no gap, in a full-width page frame. */
export const UnderHeader: Story = {
  name: 'Under Header dark',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      <Header color='dark' sticky={false} shadow={false} border={false}>
        <HeaderBrand sitename='Department of Primary Industries' />
      </Header>
      <Breadcrumb variant='band'>
        <BreadcrumbList>
          <BreadcrumbSteps
            labels={['Home', 'Fishing']}
            current='Apply for a recreational fishing licence'
          />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('header')!
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await expect(nav.getBoundingClientRect().top).toBe(header.getBoundingClientRect().bottom)
    await expect(getComputedStyle(nav).backgroundColor).toBe(
      getComputedStyle(header).backgroundColor,
    )
  },
}

export const UnderHeaderDark: Story = {
  ...UnderHeader,
  name: 'Under Header dark (dark mode)',
  globals: { theme: 'dark' },
}
