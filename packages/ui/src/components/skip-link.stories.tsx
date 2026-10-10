/**
 * SkipLink — focus-revealed bypass links (2.4.1 Bypass Blocks).
 *
 *   Components/SkipLink        → this file: Docs, Default, Playground and one
 *                                story per docs section
 *   Components/SkipLink/Tests  → skip-link.tests.stories.tsx
 *
 * The links are parked above the viewport and slide in when they receive
 * keyboard focus, so Default and Playground render a page stub with real skip
 * targets — press Tab in the canvas to reveal them.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'

import { Header, HeaderBrand } from './header.js'
import { Masthead } from './masthead.js'
import { SkipLink, SkipLinks } from './skip-link.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

/** The four curated colours, matching Masthead's set. */
const SKIP_LINK_COLORS = ['dark', 'light', 'white', 'grey'] as const

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

/**
 * One bar shown as it looks when revealed, with its label above. The bar is
 * absolutely positioned (it needs a positioned ancestor outside SkipLinks), and
 * `translate-y-0` holds it in its revealed position without focus.
 */
function RevealedBar({
  label,
  color,
  children,
}: {
  label: React.ReactNode
  color: (typeof SKIP_LINK_COLORS)[number]
  children: React.ReactNode
}) {
  return (
    <div className='space-y-2'>
      <p className='text-base text-muted-foreground'>{label}</p>
      <div className='relative min-h-11 ring-1 ring-foreground/10'>
        <SkipLink color={color} href='#content' className='translate-y-0'>
          {children}
        </SkipLink>
      </div>
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          The same four AAA pairs as <code>Masthead</code> and <code>Header</code>; theme them with
          the same word. Each bar is shown as it appears when focused. Every colour deepens in dark
          mode on the Masthead&apos;s ramp steps — a bar that arrives on focus must never be a
          pure-white flash on a dark page.
        </>
      }
    >
      <Example layout='fill' code={`<SkipLinks color="light" />`}>
        <div className='space-y-6'>
          {SKIP_LINK_COLORS.map((color) => (
            <RevealedBar
              key={color}
              color={color}
              label={color === 'dark' ? 'dark (default)' : color}
            >
              Skip to content
            </RevealedBar>
          ))}
        </div>
      </Example>
      <Example layout='fill' surface='dark'>
        <div className='space-y-6'>
          {SKIP_LINK_COLORS.map((color) => (
            <RevealedBar key={color} color={color} label={`${color} — dark mode`}>
              Skip to content
            </RevealedBar>
          ))}
        </div>
      </Example>
    </ExampleSection>
  )
}

function CustomLinksSection() {
  return (
    <ExampleSection
      title='Custom links'
      description={
        <>
          With no children, <code>SkipLinks</code> renders “Skip to navigation” (<code>#nav</code>)
          and “Skip to content” (<code>#content</code>). Pass <code>SkipLink</code> children when
          your targets have other ids or you need a third link; they then replace the defaults
          entirely. Give each link the same <code>color</code> as the bar around it.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<SkipLinks>
  <SkipLink href="#main-navigation">Skip to navigation</SkipLink>
  <SkipLink href="#main-content">Skip to content</SkipLink>
  <SkipLink href="#search">Skip to search</SkipLink>
</SkipLinks>`}
      >
        <div className='space-y-6'>
          <RevealedBar color='dark' label='first Tab'>
            Skip to navigation
          </RevealedBar>
          <RevealedBar color='dark' label='second Tab'>
            Skip to content
          </RevealedBar>
          <RevealedBar color='dark' label='third Tab'>
            Skip to search
          </RevealedBar>
        </div>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Rendered first in the body, before the Masthead. Click inside the frame, then press Tab: the bar slides in over the masthead, and activating it moves focus to the target.'
    >
      <Example layout='fill'>
        {/* SkipLinks is `fixed` to the viewport; `absolute` keeps it inside
            this frame instead of the top of the docs page. */}
        <div className='relative overflow-hidden ring-1 ring-foreground/10'>
          <SkipLinks color='dark' className='absolute'>
            <SkipLink color='dark' href='#skip-link-context-nav'>
              Skip to navigation
            </SkipLink>
            <SkipLink color='dark' href='#skip-link-context-content'>
              Skip to content
            </SkipLink>
          </SkipLinks>
          <Masthead id='skip-link-context-masthead' color='dark' />
          <Header id='skip-link-context-header' color='dark' sticky={false}>
            <HeaderBrand sitename='Department of Primary Industries' />
          </Header>
          <nav
            id='skip-link-context-nav'
            aria-label='Main navigation'
            className='border-b border-border px-6 py-3 text-base'
          >
            Fishing · Farming · Biosecurity
          </nav>
          <div id='skip-link-context-content' className='space-y-2 px-6 py-6'>
            <p className='text-2xl font-bold'>Apply for a recreational fishing licence</p>
            <p className='text-base'>
              You need a licence to fish in NSW waters, including from the shore.
            </p>
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SkipLinkDocs() {
  return (
    <DocsPage
      title='SkipLink'
      npm={['SkipLinks', 'SkipLink']}
      registry='skip-link'
      summary={
        <>
          Skip links let keyboard and screen-reader users jump past the blocks repeated on every
          page (WCAG 2.4.1) straight to the navigation or the main content. They are parked above
          the viewport until they take focus, then slide in as a full-width bar at least 44px tall
          at the 16px body size.
        </>
      }
    >
      <DocsUsage
        use={[
          'The first element in the body of every page, before the Masthead.',
          'Jumping to the main navigation and the main content — the default pair.',
          'A third target a keyboard user reaches often, such as site search.',
        ]}
        avoid={[
          'Jumping between headings within a long page — use OnThisPage.',
          'Moving to another page — use Link.',
          'Telling people which site they are on — use Masthead.',
        ]}
      />
      <ColoursSection />
      <CustomLinksSection />
      <InContextSection />
      <DocsApi description='Props of SkipLinks. SkipLink takes the same color plus href and children.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/SkipLink',
  component: SkipLinks,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: SkipLinkDocs },
  },
  args: {
    color: 'dark',
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: SKIP_LINK_COLORS,
      description:
        'WCAG 2.2 AAA text/background pair applied to the default link pair — matches the Masthead colours.',
      table: { category: 'Appearance' },
    },
    children: {
      control: false,
      description:
        'SkipLink elements. Omit for the default “Skip to navigation” / “Skip to content” pair.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
  // The links are invisible until focused and need real targets to move focus
  // to, so the canvas renders a page stub with focus instructions.
  render: (args) => (
    <div className='min-h-48'>
      <SkipLinks {...args} />
      <Masthead />
      <div className='space-y-4 p-6'>
        <p className='text-base text-muted-foreground'>
          Click here, then press <kbd>Tab</kbd> to reveal the skip links.
        </p>
        <nav id='nav' aria-label='Main navigation' className='text-base'>
          Navigation landmark (#nav)
        </nav>
        <main id='content' className='text-base'>
          Main content landmark (#content)
        </main>
      </div>
    </div>
  ),
} satisfies Meta<typeof SkipLinks>

export default meta

type Story = StoryObj<typeof meta>

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

export const Playground: Story = {}

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const CustomLinks: Story = { name: 'Custom links', render: () => <CustomLinksSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
