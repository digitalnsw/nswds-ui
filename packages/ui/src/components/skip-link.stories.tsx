/**
 * SkipLink — Default + Variants + WithMasthead
 *
 * Focus-revealed bypass links (2.4.1 Bypass Blocks). The links are parked
 * above the viewport and slide in when they receive keyboard focus — press
 * Tab in the story canvas to reveal them.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Masthead } from './masthead.js'
import { SkipLink, SkipLinks } from './skip-link.js'

const meta = {
  title: 'Components/SkipLink',
  component: SkipLinks,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Skip Link</h1>
            <p className='text-base text-muted-foreground'>
              Skip links let keyboard and screen-reader users bypass repeated blocks (WCAG 2.4.1)
              and jump straight to the navigation or main content. They are visually hidden above
              the viewport and slide in on keyboard focus — render SkipLinks as the first element in
              the body, before the Masthead. Focus moves to the target on activation, and the
              revealed bar is at least 44px tall (2.5.5 Target Size AAA) with a current-colour focus
              ring (2.4.13 Focus Appearance).
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Usage</h2>
            <p className='text-base text-muted-foreground'>
              With no children, SkipLinks renders the legacy default pair — &ldquo;Skip to
              navigation&rdquo; (#nav) and &ldquo;Skip to content&rdquo; (#content). Compose
              SkipLink children for custom targets or extra links. Open the Default story and press{' '}
              <kbd>Tab</kbd> to see the reveal behaviour.
            </p>
            <p className='text-base text-muted-foreground'>
              The four colour variants, shown un-hidden for comparison:
            </p>
            {/* sb-unstyled stops the Storybook docs stylesheet re-colouring
                the anchors inside this example. */}
            <div className='sb-unstyled space-y-2'>
              {(['dark', 'light', 'white', 'grey'] as const).map((color) => (
                <div key={color} className='relative min-h-11'>
                  <SkipLink
                    color={color}
                    href='#content'
                    className='translate-y-0 border border-border'
                  >
                    Skip to content — {color}
                  </SkipLink>
                </div>
              ))}
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Focus-revealed bypass links that let keyboard and screen-reader users jump past repeated blocks, with the same WCAG 2.2 AAA colour variants as the Masthead.',
      },
    },
  },
  args: {
    color: 'dark',
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['dark', 'light', 'white', 'grey'],
      description:
        'WCAG 2.2 AAA text/background pair applied to the default link pair — matches the Masthead colours.',
      table: { category: 'Appearance' },
    },
    children: {
      table: { disable: true, category: 'Content' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
  // The links are invisible until focused, so every story renders a page
  // stub with focus instructions and real skip targets.
  render: (args) => (
    <div className='min-h-48'>
      <SkipLinks {...args} />
      <Masthead />
      <div className='space-y-4 p-6'>
        <p className='text-sm text-muted-foreground'>
          Click here, then press <kbd>Tab</kbd> to reveal the skip links.
        </p>
        <nav id='nav' aria-label='Main navigation' className='text-sm'>
          Navigation landmark (#nav)
        </nav>
        <main id='content' className='text-sm'>
          Main content landmark (#content)
        </main>
      </div>
    </div>
  ),
} satisfies Meta<typeof SkipLinks>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSkipLinks(canvasElement: HTMLElement) {
  const nav = canvasElement.querySelector<HTMLElement>('[data-slot="skip-links"]')
  if (!nav) {
    throw new Error('Could not find an element with [data-slot="skip-links"].')
  }
  return nav
}

async function waitFor(assertion: () => void, timeoutMs = 1500) {
  const start = Date.now()
  for (;;) {
    try {
      assertion()
      return
    } catch (error) {
      if (Date.now() - start > timeoutMs) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = getSkipLinks(canvasElement)

    if (nav.getAttribute('aria-label') !== 'Skip links') {
      throw new Error('Expected the skip links nav to be labelled "Skip links".')
    }

    const links = nav.querySelectorAll<HTMLAnchorElement>('[data-slot="skip-link"]')
    if (links.length !== 2) {
      throw new Error(`Expected the default pair of skip links, found ${links.length}.`)
    }

    // Hidden until focused: the link's box sits fully above the viewport.
    const first = links[0]!
    if (first.getBoundingClientRect().bottom > 0) {
      throw new Error('Expected the skip link to be parked above the viewport.')
    }

    // Keyboard focus reveals it (animated, so poll until it lands).
    first.focus()
    await waitFor(() => {
      const rect = first.getBoundingClientRect()
      if (rect.top !== 0 || rect.height < 44) {
        throw new Error(
          `Expected the focused skip link to be revealed at the top of the viewport with a ≥44px target (top: ${rect.top}, height: ${rect.height}).`,
        )
      }
    })

    // Activating it moves focus to the target, adding tabindex="-1" when the
    // target is not natively focusable. Suppress the default hash navigation
    // at the document level — it fires after the component's onClick (React
    // delegates at the story root, which is inside document), so the focus
    // behaviour still runs, but the vitest tester page is not navigated.
    const suppressNavigation = (event: Event) => event.preventDefault()
    document.addEventListener('click', suppressNavigation)
    try {
      first.click()
      await waitFor(() => {
        const target = document.getElementById('nav')
        if (document.activeElement !== target) {
          throw new Error('Expected activation to move focus to the #nav target.')
        }
      })
    } finally {
      document.removeEventListener('click', suppressNavigation)
    }

    // Reset so the story canvas is left in its default state.
    ;(document.activeElement as HTMLElement | null)?.blur()
  },
}

export const Variants: Story = {
  render: () => (
    <div className='space-y-4 p-6'>
      <p className='text-sm text-muted-foreground'>
        The bars below are the four colour variants, shown un-hidden for comparison (in real use
        they are revealed on focus).
      </p>
      {(['dark', 'light', 'white', 'grey'] as const).map((color) => (
        <div key={color} className='relative min-h-11 overflow-hidden'>
          <SkipLink color={color} href='#content' className='translate-y-0 border border-border'>
            Skip to content — {color}
          </SkipLink>
        </div>
      ))}
    </div>
  ),
}

export const CustomLinks: Story = {
  name: 'Custom Links',
  play: async ({ canvasElement }) => {
    // Explicit children render exactly as given — the default #nav/#content
    // pair must not be injected alongside composed links.
    const links = [
      ...getSkipLinks(canvasElement).querySelectorAll<HTMLAnchorElement>('[data-slot="skip-link"]'),
    ]
    const hrefs = links.map((link) => link.getAttribute('href'))
    if (hrefs.join() !== '#main-navigation,#main-content,#search') {
      throw new Error(
        `Expected exactly the three composed skip links, found [${hrefs.join(', ')}].`,
      )
    }
  },
  render: (args) => (
    <div className='min-h-48'>
      <SkipLinks {...args}>
        <SkipLink color={args.color} href='#main-navigation'>
          Skip to navigation
        </SkipLink>
        <SkipLink color={args.color} href='#main-content'>
          Skip to content
        </SkipLink>
        <SkipLink color={args.color} href='#search'>
          Skip to search
        </SkipLink>
      </SkipLinks>
      <Masthead />
      <div className='space-y-4 p-6'>
        <p className='text-sm text-muted-foreground'>
          Click here, then press <kbd>Tab</kbd> to cycle through three links.
        </p>
        <nav id='main-navigation' aria-label='Main navigation' className='text-sm'>
          Navigation landmark
        </nav>
        <main id='main-content' className='text-sm'>
          Main content landmark
        </main>
        <div id='search' className='text-sm'>
          Search landmark
        </div>
      </div>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the link resolves bg-primary-800 to a
    // real colour and the reveal translate is applied.
    const nav = getSkipLinks(canvasElement)
    const link = nav.querySelector<HTMLElement>('[data-slot="skip-link"]')
    if (!link) throw new Error('Skip link not found.')

    const bg = getComputedStyle(link).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-primary-800 to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }

    if (link.getBoundingClientRect().bottom > 0) {
      throw new Error(
        'Expected the unfocused skip link to be translated above the viewport. Is globals.css loaded?',
      )
    }
  },
}
