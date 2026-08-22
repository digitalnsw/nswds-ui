/**
 * OnThisPage — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { OnThisPage } from './on-this-page.js'

const ITEMS = [
  { id: 'specimen', title: 'Specimen' },
  { id: 'try', title: 'Try it' },
  { id: 'download', title: 'Download' },
  { id: 'install', title: 'Install' },
]

/** Real sections for the spy to track — it resolves ids from the document. */
function DemoSections() {
  return (
    <div>
      {ITEMS.map(({ id, title }) => (
        <section key={id} id={id} aria-label={title} className='min-h-[60vh] py-8'>
          <h2 className='text-2xl font-bold text-foreground'>{title}</h2>
          <p className='mt-2 text-muted-foreground'>
            Scroll to see the entry above become current.
          </p>
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: 'Components/On This Page',
  component: OnThisPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'OnThisPage tracks which section of the current page the reader has reached. It is deliberately distinct from the other three navigation components: MainNav moves between sites/sections, SideNav between pages, StepNav through a journey — this moves within the page you are on. It is named OnThisPage rather than SectionNav because SideNav already announces itself as "Section navigation". The tracked entry is marked aria-current="location", not "page": every entry points at the page the reader is already on, so "page" would mark them all.',
      },
    },
  },
  args: {
    items: ITEMS,
    orientation: 'horizontal',
    offset: 0,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { category: 'Appearance' },
    },
    offset: {
      control: 'number',
      description:
        'Y-coordinate of the line a section must cross to count as current. Set it to the height of any chrome overlaying the top of the page — useChromeHeight measures it.',
      table: { category: 'Behaviour' },
    },
    className: { table: { disable: true, category: 'Advanced' } },
  },
  render: (args) => (
    <div>
      <div className='sticky top-0 z-40 bg-background'>
        <OnThisPage {...args} />
      </div>
      <DemoSections />
    </div>
  ),
} satisfies Meta<typeof OnThisPage>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNav(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="on-this-page"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="on-this-page"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    // A named landmark, or it is indistinguishable from the page's other navs.
    if (nav.getAttribute('aria-label') !== 'On this page') {
      throw new Error(`Expected a named landmark, received "${nav.getAttribute('aria-label')}".`)
    }

    // list-style: none strips list semantics in Safari/VoiceOver.
    const list = nav.querySelector('ul')
    if (list?.getAttribute('role') !== 'list') {
      throw new Error('Expected an explicit role="list" on the list.')
    }

    const links = nav.querySelectorAll('a')
    if (links.length !== ITEMS.length) {
      throw new Error(`Expected ${ITEMS.length} links, received ${links.length}.`)
    }

    // The first section starts at the top of the scroll container, so it is
    // current on load — and it must be marked "location", never "page".
    await new Promise((resolve) => requestAnimationFrame(resolve))
    const current = nav.querySelectorAll('[aria-current]')
    if (current.length > 1) {
      throw new Error(`Expected at most one current entry, received ${current.length}.`)
    }
    for (const entry of current) {
      if (entry.getAttribute('aria-current') !== 'location') {
        throw new Error(
          `Expected aria-current="location", received "${entry.getAttribute('aria-current')}".`,
        )
      }
    }
  },
}

export const Variants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className='flex flex-col gap-10'>
      <section>
        <h3 className='mb-3 font-bold text-foreground'>Horizontal</h3>
        <OnThisPage items={ITEMS} orientation='horizontal' activeId='try' />
      </section>
      <section>
        <h3 className='mb-3 font-bold text-foreground'>Vertical</h3>
        <OnThisPage items={ITEMS} orientation='vertical' activeId='download' />
      </section>
      <section>
        <h3 className='mb-3 font-bold text-foreground'>Empty</h3>
        <OnThisPage items={[]} emptyMessage='No sections on this page.' />
      </section>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  parameters: { layout: 'padded' },
  render: () => <OnThisPage items={ITEMS} orientation='horizontal' activeId='specimen' />,
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    // The horizontal bar must be its own scroll container, or a long list of
    // sections overflows the page instead of scrolling within the bar.
    const overflowX = getComputedStyle(nav).overflowX
    if (overflowX !== 'auto' && overflowX !== 'scroll') {
      throw new Error(`Expected the horizontal bar to scroll, received overflow-x "${overflowX}".`)
    }

    // Active state must not be colour-only: the marker rule carries it too.
    const active = nav.querySelector<HTMLElement>('[data-active]')
    if (!active) {
      throw new Error('Could not find the active entry.')
    }
    const borderWidth = getComputedStyle(active).borderBottomWidth
    if (borderWidth !== '2px') {
      throw new Error(`Expected a 2px marker rule on the active entry, received "${borderWidth}".`)
    }
  },
}
