/**
 * Breadcrumb — Accessibility
 *
 * WCAG 2.2 criterion-driven stories. Each declares the criteria it covers and
 * uses `wcagStoryMeta` (story-helpers) to generate its description, so the
 * criterion number, level, title and W3C link appear in the Docs panel.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Breadcrumb, BreadcrumbList } from './breadcrumb.js'
import {
  BREADCRUMB_LOOKS,
  BreadcrumbSteps,
  BreadcrumbTrail,
  compositeOver,
  expectContrast,
  resolveColor,
  wcagStoryMeta,
} from './story-helpers.js'

const meta = {
  title: 'Components/Breadcrumb/Accessibility',
  component: Breadcrumb,
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The opaque colour an element's text actually sits on: its own and its
 * ancestors' backgrounds composited from the first opaque one up. The soft
 * look's tint is translucent, so its contrast is only meaningful against the
 * page behind it.
 */
function effectiveBackground(element: Element): string {
  const layers: string[] = []
  for (let el: Element | null = element; el; el = el.parentElement) {
    const bg = getComputedStyle(el).backgroundColor
    if (resolveColor(bg).a === 0) continue
    layers.push(bg)
    if (resolveColor(bg).a >= 1) break
  }
  const base = layers.length && resolveColor(layers.at(-1)!).a >= 1 ? layers.pop()! : 'white'
  let backdrop = resolveColor(base)
  for (const layer of layers.reverse())
    backdrop = { ...compositeOver(resolveColor(layer), backdrop), a: 1 }
  return `rgb(${Math.round(backdrop.r)}, ${Math.round(backdrop.g)}, ${Math.round(backdrop.b)})`
}

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2 / 1.3.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['4.1.2', '1.3.1'],
          why: 'A screen reader user finds the trail as a named landmark, hears it as a list of steps, knows which step is the current page, and knows what the ellipsis does.',
          how: 'With a screen reader, jump to landmarks: "Breadcrumb navigation". Read the list: each link by name, the last step announced as current page. The ellipsis is "Show 2 more pages"; on a phone a collapsed trail is Home, a “Show 1 more page” button and the parent.',
          caveat:
            'Separators are hidden from assistive technology; the list structure carries the order.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-8'>
      <BreadcrumbTrail />
      <div style={{ width: 375 }}>
        <Breadcrumb aria-label='Breadcrumb, collapsed'>
          <BreadcrumbList>
            <BreadcrumbSteps
              labels={['Home', 'Services', 'Licences and permits']}
              current='Apply for a recreational fishing licence'
            />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const landmark = canvas.getByRole('navigation', { name: 'Breadcrumb' })
    await expect(within(landmark).getByRole('list')).toBeInTheDocument()
    await expect(within(landmark).getByText('Apply for a fee exemption')).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(
      within(landmark).getByRole('button', { name: 'Show 2 more pages' }),
    ).toHaveAttribute('aria-haspopup', 'menu')
    for (const separator of landmark.querySelectorAll('[data-slot="breadcrumb-separator"]')) {
      await expect(separator).toHaveAttribute('aria-hidden', 'true')
    }
    const collapsed = canvas.getByRole('navigation', { name: 'Breadcrumb, collapsed' })
    await waitFor(() => expect(collapsed).toHaveAttribute('data-collapsed'))
    await expect(
      within(collapsed)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Home', 'Licences and permits'])
    // The hidden steps are a named button away, between Home and the parent.
    await expect(
      within(collapsed).getByRole('button', { name: 'Show 1 more page' }),
    ).toHaveAttribute('aria-haspopup', 'menu')
  },
}

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Every step and the hidden-steps menu work without a pointer.',
          how: 'Tab: Home, then the ellipsis, then the remaining links. Enter on the ellipsis opens the menu with focus inside it; Escape closes it and returns focus to the ellipsis.',
          caveat: 'The current page is not a link and takes no focus, by design.',
        }),
      },
    },
  },
  render: () => <BreadcrumbTrail />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await waitFor(() => expect(canvas.getByRole('link', { name: 'Home' })).toHaveFocus())
    await userEvent.tab()
    const trigger = canvas.getByRole('button', { name: 'Show 2 more pages' })
    await waitFor(() => expect(trigger).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    const menu = await within(document.body).findByRole('menu')
    await waitFor(() => expect(menu.contains(document.activeElement)).toBe(true))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    await userEvent.tab()
    await waitFor(() =>
      expect(canvas.getByRole('link', { name: 'Recreational fishing' })).toHaveFocus(),
    )
  },
}

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7 / 1.4.11',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['2.4.7', '1.4.11'],
          why: 'A keyboard user always sees which step will be followed.',
          how: 'Tab through the trail: each link and the ellipsis shows the system’s 2px ring in the ink, offset 2px onto the page, appearing at once.',
          caveat: 'On the band the ring is white, the band’s ink.',
        }),
      },
    },
  },
  render: () => <BreadcrumbTrail />,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    const home = within(canvasElement).getByRole('link', { name: 'Home' })
    await waitFor(() => expect(home).toHaveFocus())
    const link = getComputedStyle(home)
    await expect(link.outlineStyle).toBe('solid')
    await expect(link.outlineWidth).toBe('2px')
    await expect(link.outlineOffset).toBe('2px')
    await waitFor(() => expect(getComputedStyle(home).outlineColor).toBe(link.color))
    expectContrast(link.outlineColor, effectiveBackground(home), {
      minimum: 3,
      label: 'Focus ring',
    })

    await userEvent.tab()
    const trigger = within(canvasElement).getByRole('button', { name: 'Show 2 more pages' })
    await waitFor(() => expect(trigger).toHaveFocus())
    const button = getComputedStyle(trigger)
    await expect(button.outlineStyle).toBe('solid')
    await expect(button.outlineWidth).toBe('2px')
    await expect(button.outlineOffset).toBe('2px')
  },
}

export const ContrastMinimum: Story = {
  name: 'Contrast (Minimum) — 1.4.3',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'Links and the current page stay readable on every look’s surface.',
          how: 'The play measures each look’s links and current page against the colour they actually sit on, compositing the soft tint over the page.',
          caveat:
            'Separators are decorative and hidden from assistive technology, so they are not held to 4.5:1. The dark story repeats every check.',
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
    for (const nav of canvasElement.querySelectorAll<HTMLElement>('[data-slot="breadcrumb"]')) {
      const look = nav.dataset.variant
      for (const el of nav.querySelectorAll<HTMLElement>(
        'a[href], [data-slot="breadcrumb-page"]',
      )) {
        expectContrast(getComputedStyle(el).color, effectiveBackground(el), {
          label: `${look}: ${el.textContent}`,
        })
      }
    }
  },
}

export const ContrastMinimumDark: Story = {
  ...ContrastMinimum,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

export const TargetSize: Story = {
  name: 'Target Size (Minimum) — 2.5.8 / 2.5.5',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['2.5.8', '2.5.5'],
          why: 'Steps are easy to hit on a touch screen without growing the trail.',
          how: 'The ellipsis is 24px. A link’s box is shorter than 24px, so it meets 2.5.8 by spacing: a 24px circle centred on each target overlaps no other. On a touch screen every link and the ellipsis also carry a 44px TouchTarget layer, and wrapped rows sit 20px apart so the layers never overlap.',
          caveat:
            'The 44px layer appears only on a coarse pointer, which this canvas does not emulate; the play asserts the layer is present.',
        }),
      },
    },
  },
  render: () => <BreadcrumbTrail />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Show 2 more pages' })
    await expect(trigger.getBoundingClientRect().height).toBe(24)
    await expect(trigger.getBoundingClientRect().width).toBeGreaterThanOrEqual(24)
    // The spacing exception: 24px circles centred on each target do not
    // intersect any other target's circle.
    const targets = [...canvasElement.querySelectorAll<HTMLElement>('a[href]'), trigger]
    const centres = targets.map((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    })
    for (const [i, a] of centres.entries()) {
      for (const b of centres.slice(i + 1)) {
        await expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(24)
      }
    }
    for (const link of canvasElement.querySelectorAll<HTMLElement>('a[href]')) {
      await expect(link.querySelector(':scope > span[aria-hidden="true"]')).toBeInTheDocument()
    }
  },
}
