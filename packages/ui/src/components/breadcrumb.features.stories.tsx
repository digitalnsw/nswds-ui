/**
 * Breadcrumb — Features
 *
 * Look matrices, the ellipsis menu, wrapping and collapse, for visual QA and
 * design-token reviews. Like Button's Features stories these show every look
 * at once rather than typical usage; each story says what to look for and how
 * to test it. Guidance for choosing a look lives on the Looks pages.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Breadcrumb, BreadcrumbList } from './breadcrumb.js'
import {
  BREADCRUMB_LOOKS,
  breadcrumbShownItems,
  BreadcrumbSteps,
  BreadcrumbTrail,
  closeOverlay,
  docsTemplate,
  renderedText,
} from './story-helpers.js'

const meta = {
  title: 'Components/Breadcrumb/Features',
  component: Breadcrumb,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

const LONG = ['Home', 'Services', 'Licences and permits']
const LONG_CURRENT = 'Apply for a recreational fishing licence'

export const Looks: Story = {
  name: 'Looks',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'All four looks with the same trail: default, rail, band, soft.',
          why: 'Catches drift between looks after a token retune: weights, colours, glyphs and heights.',
          how: 'Links are medium weight and underlined; the current page is regular; separators are chevrons except the rail’s slashes; every look sits on the 4px grid.',
          caveat:
            'Band and soft take Header’s inset, so their content starts further in than default and rail.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-8'>
      {BREADCRUMB_LOOKS.map((look) => (
        <BreadcrumbTrail key={look} variant={look} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const navs = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="breadcrumb"]')]
    await expect(navs.map((nav) => nav.dataset.variant)).toEqual([...BREADCRUMB_LOOKS])
    // Every look lands on the 4px grid: the hairlines are optical.
    for (const nav of navs) {
      await expect(nav.getBoundingClientRect().height % 4).toBe(0)
    }
    const [first, rail, band, soft] = navs as [HTMLElement, HTMLElement, HTMLElement, HTMLElement]

    // Links read as links at rest, in the link signature's medium weight; the
    // current page is regular on every look, never the heaviest word.
    for (const nav of navs) {
      for (const link of nav.querySelectorAll<HTMLElement>('a[href]')) {
        await expect(getComputedStyle(link).textDecorationLine).toBe('underline')
        await expect(getComputedStyle(link).fontWeight).toBe('500')
      }
      const page = nav.querySelector<HTMLElement>('[data-slot="breadcrumb-page"]')!
      await expect(getComputedStyle(page).fontWeight).toBe('400')
    }

    // Separators are drawn by the item after them: the first item leads with
    // nothing, the rest with a chevron — or a slash on the rail.
    const leads = (nav: HTMLElement) =>
      [...nav.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-lead"]')].map((lead) =>
        getComputedStyle(lead).display === 'none'
          ? 'none'
          : [...lead.children].find((el) => getComputedStyle(el).display !== 'none')?.tagName ===
              'svg'
            ? 'chevron'
            : renderedText(lead),
      )
    await expect(leads(first)).toEqual(['none', 'chevron', 'chevron', 'chevron'])
    await expect(leads(rail)).toEqual(['none', '/', '/', '/'])
    for (const separator of first.querySelectorAll<HTMLElement>(
      '[data-slot="breadcrumb-separator"]',
    )) {
      await expect(getComputedStyle(separator).display).toBe('none')
    }

    // Colour contract. Compared element to element, never against a literal:
    // computed colours come back in whatever space the token was written in.
    const colour = (nav: HTMLElement, selector: string) =>
      getComputedStyle(nav.querySelector(selector)!).color
    const page = '[data-slot="breadcrumb-page"]'
    const link = 'a[href]'
    const lead = '[data-slot="breadcrumb-item"]:nth-child(3) > [data-slot="breadcrumb-lead"]'
    // The band's current page is white like its links, not the page's text colour.
    await expect(colour(band, page)).toBe(colour(band, link))
    await expect(colour(band, page)).not.toBe(colour(first, page))
    await expect(colour(band, lead)).not.toBe(colour(first, lead))
    // The rail and the tint share the default ink.
    await expect(colour(rail, link)).toBe(colour(first, link))
    await expect(colour(soft, link)).toBe(colour(first, link))
  },
}

/** Every look on a real dark page (story-level theme, not a nested `.dark`). */
export const LooksDark: Story = {
  ...Looks,
  name: 'Looks (dark)',
  globals: { theme: 'dark' },
}

export const EllipsisMenu: Story = {
  name: 'Ellipsis menu',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The ellipsis opens a menu of the hidden steps.',
          why: 'Breadcrumb styles any button whose only child is the ellipsis, so the menu is ordinary DropdownMenu composition.',
          how: 'The trigger is a 32px control on the 4px radius; hover tints it 10% and open 20%; the menu opens just clear of the trail and its rows are underlined like the trail’s links.',
          caveat: 'Underlining the rows is the consumer’s className, as shown in the code.',
        }),
      },
    },
  },
  render: () => <BreadcrumbTrail />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Show 2 more pages' })
    await expect(trigger.getBoundingClientRect().height).toBe(32)
    await expect(getComputedStyle(trigger).borderRadius).toBe('4px')
    await expect(
      trigger.querySelector('[data-slot="breadcrumb-ellipsis"] > span[aria-hidden="true"]'),
    ).toBeInTheDocument()
    const resting = getComputedStyle(trigger).backgroundColor

    await userEvent.click(trigger)
    const menu = await within(document.body).findByRole('menu')
    const items = within(menu).getAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Services',
      'Licences and permits',
    ])
    for (const item of items) {
      await expect(getComputedStyle(item).textDecorationLine).toBe('underline')
    }
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(getComputedStyle(trigger).backgroundColor).not.toBe(resting)

    await closeOverlay('dropdown-menu-content')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const Wrapping: Story = {
  name: 'Wrapping',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'A full trail with a long label, wrapping at phone width with collapse off.',
          why: 'Each separator belongs to the step after it, so a new line starts with its separator beside its target; a wrapped link keeps a halo and focus ring per line.',
          how: 'No line ends on a stray separator; hover the long link and the tint follows each line.',
          caveat: 'Rows sit 20px apart on touch screens, which this desktop canvas cannot show.',
        }),
      },
    },
  },
  render: () => (
    <div style={{ width: 375 }}>
      <Breadcrumb collapse={false}>
        <BreadcrumbList>
          <BreadcrumbSteps
            labels={[
              'Home',
              'Recreational fishing licences, fees and exemptions for concession holders',
              'Fees and exemptions',
            ]}
            current='Apply for a recreational fishing fee exemption'
          />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-item"]')]
    const lines = new Set(items.map((item) => Math.round(item.getBoundingClientRect().top)))
    await expect(lines.size).toBeGreaterThan(1)
    for (const item of items.slice(1)) {
      const lead = item.querySelector<HTMLElement>('[data-slot="breadcrumb-lead"]')!
      const target = item.querySelector<HTMLElement>('a, [data-slot="breadcrumb-page"]')!
      // The glyph shares a line with the first line of its target.
      await expect(
        Math.abs(lead.getBoundingClientRect().top - target.getClientRects()[0]!.top),
      ).toBeLessThan(8)
    }
    // The long label wraps as an inline link: one box per line.
    const long = within(canvasElement).getByRole('link', { name: /concession holders/ })
    await expect(getComputedStyle(long).display).toBe('inline')
    await expect(long.getClientRects().length).toBeGreaterThan(1)
    for (const link of canvasElement.querySelectorAll<HTMLElement>('a[href]')) {
      await expect(link.querySelector(':scope > span[aria-hidden="true"]')).toBeInTheDocument()
    }
  },
}

export const Collapse: Story = {
  name: 'Collapse',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Trails at 375px and 48rem: long and short, every look, and the cases collapse leaves alone.',
          why: 'A trail shortens to Home and the parent only when it would wrap, and only when it can do so sensibly.',
          how: 'At 375px the long default and rail trails show "Home › Licences and permits" and the long band trail just "Home"; the short band trail stays whole; the one-item trail and collapse={false} stay whole; at 48rem nothing collapses.',
          caveat:
            'Measurement runs after mount; the CSS stand-in before it is covered by the Tests stories.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-8'>
      <div className='grid gap-6' style={{ width: 375 }}>
        <Breadcrumb data-testid='full'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='band' data-testid='short'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={['Home']} current='Contact us' />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='band' data-testid='two'>
          <BreadcrumbList>
            <BreadcrumbSteps
              labels={['Home']}
              current='Apply for a recreational fishing fee exemption as a concession holder'
            />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='rail' data-testid='rail'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='soft' data-testid='one'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={[]} current='Home' />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb collapse={false} data-testid='off'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div style={{ width: '48rem' }}>
        <Breadcrumb data-testid='wide'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* A shrink-to-fit parent: without w-full, size containment would give
          the nav no width and overflow a collapsed white-on-band trail. */}
      <div className='flex items-center' style={{ width: '48rem' }}>
        <Breadcrumb variant='band' data-testid='flex'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={['Home', 'Services']} current='Apply online' />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = (id: string) => canvasElement.querySelector<HTMLElement>(`[data-testid="${id}"]`)!
    const longTrail = [...LONG, LONG_CURRENT]
    // Wait for the first measurement; the CSS stand-in applies until then.
    await waitFor(() => expect(nav('full')).toHaveAttribute('data-measured'))

    // Would wrap: it shortens to the first step and the parent, still a
    // breadcrumb of real links, the parent leading with its separator.
    await expect(nav('full')).toHaveAttribute('data-collapsed')
    await expect(breadcrumbShownItems(nav('full'))).toEqual(['Home', 'Licences and permits'])
    await expect(
      within(nav('full')).getByRole('link', { name: 'Licences and permits' }),
    ).toBeVisible()
    // When the parent is the first step, that one step is all that is left.
    await expect(breadcrumbShownItems(nav('two'))).toEqual(['Home'])
    // The rail collapses like every other look.
    await expect(nav('rail')).toHaveAttribute('data-collapsed')
    await expect(breadcrumbShownItems(nav('rail'))).toEqual(['Home', 'Licences and permits'])

    // Fits on one line: stays whole even at 375px.
    await expect(nav('short')).not.toHaveAttribute('data-collapsed')
    await expect(breadcrumbShownItems(nav('short'))).toEqual(['Home', 'Contact us'])

    // Never collapsed: nothing to keep, or collapse turned off.
    await expect(breadcrumbShownItems(nav('one'))).toEqual(['Home'])
    await expect(breadcrumbShownItems(nav('off'))).toEqual(longTrail)

    // Wide enough: the whole trail.
    await expect(nav('wide')).not.toHaveAttribute('data-collapsed')
    await expect(breadcrumbShownItems(nav('wide'))).toEqual(longTrail)
    // In a shrink-to-fit parent the nav still fills the row, so it does not collapse.
    await expect(nav('flex').getBoundingClientRect().width).toBeGreaterThan(700)
    await expect(breadcrumbShownItems(nav('flex'))).toEqual(['Home', 'Services', 'Apply online'])

    // The measuring clone never stays in the document.
    await expect(canvasElement.querySelectorAll('[data-slot="breadcrumb"][inert]')).toHaveLength(0)
  },
}

export const CollapseFollowsWidth: Story = {
  name: 'Collapse follows width',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'One trail in a frame that grows from 375px to 48rem and back.',
          why: 'Collapse is measured against the breadcrumb’s own width and re-measured when it changes.',
          how: 'Resize the frame (or watch the play): collapsed at 375px, whole at 48rem, collapsed again.',
          caveat: 'Measures only when the width changes, so a height-only resize costs nothing.',
        }),
      },
    },
  },
  render: () => (
    <div data-testid='frame' style={{ width: 375 }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector<HTMLElement>('[data-testid="frame"]')!
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await waitFor(() => expect(nav).toHaveAttribute('data-collapsed'))
    frame.style.width = '48rem'
    await waitFor(() => expect(nav).not.toHaveAttribute('data-collapsed'))
    frame.style.width = '375px'
    await waitFor(() => expect(nav).toHaveAttribute('data-collapsed'))
  },
}
