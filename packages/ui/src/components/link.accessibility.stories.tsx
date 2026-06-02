/**
 * Link — Accessibility
 *
 * WCAG 2.2 criterion-driven stories for the Link component.
 *
 * Each story declares the criteria it covers in `parameters.wcag` and uses
 * `wcagStoryMeta` to generate its description (so the criterion number,
 * level, title, and W3C link appear in the Docs panel automatically).
 *
 * Link has no explicit size variants, so a target-size story (2.5.8) is
 * intentionally not included — per the storybook-story-standards spec,
 * that criterion only applies to components with explicit size axes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent } from 'storybook/test'

import { Icons } from './icons.js'
import { Link } from './link.js'
import { wcagStoryMeta } from './story-helpers.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Link/Accessibility',
  component: Link,
  parameters: {
    layout: 'padded',
  },
  args: {
    href: '/about',
    children: 'About NSW Government',
  },
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAnchor(canvasElement: HTMLElement, accessibleName: string) {
  const anchor = Array.from(canvasElement.querySelectorAll('a')).find(
    (el) =>
      el.textContent?.trim() === accessibleName ||
      el.getAttribute('aria-label') === accessibleName
  )

  if (!anchor) {
    throw new Error(
      `Could not find <a> with accessible name "${accessibleName}".`
    )
  }

  return anchor
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Contrast: Story = {
  name: 'Contrast — 1.4.3 / 1.4.11',
  parameters: {
    wcag: ['1.4.3', '1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['1.4.3', '1.4.11'],
          why: 'Link text must meet 4.5:1 contrast against its background, and the underline (the non-text indicator that distinguishes the link from surrounding text) must meet 3:1 contrast so users with low vision can both read the label and detect the link.',
          how: 'Use a colour-contrast checker (Chrome DevTools Accessibility pane) on the link text against the background, then on the underline against the background. Repeat for the muted/secondary surface below.',
          caveat:
            'Contrast values depend on the active theme — verify both light and dark modes. The underline is a presentational indicator; if links are distinguished by colour alone, 1.4.1 Use of Color also applies and a separate visual indicator is required.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">
          On default background
        </h4>
        <p className="text-base text-foreground">
          Read more on the{' '}
          <Link href="/about" variant="primary">
            About NSW Government
          </Link>{' '}
          page.
        </p>
      </section>

      <section className="space-y-2 rounded-sm border border-border bg-muted p-4">
        <h4 className="text-sm font-semibold text-foreground">
          On muted surface
        </h4>
        <p className="text-base text-foreground">
          Read more on the{' '}
          <Link href="/about" variant="primary">
            About NSW Government
          </Link>{' '}
          page.
        </p>
      </section>
    </div>
  ),
}

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7 / 2.4.11',
  parameters: {
    wcag: ['2.4.7', '2.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['2.4.7', '2.4.11'],
          why: 'Keyboard users must see which element has focus at all times, and the focus indicator must not be entirely obscured by other content.',
          how: 'Tab onto the first link to see the native focus ring. The second link below renders the focus outline at rest so the indicator can be reviewed without tabbing.',
          caveat:
            'Focus on the second link is forced via outline utility classes — a faithful preview of the focus state rather than a real DOM focus.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <Link href="/tab-me" variant="primary">
        Tab here to see real focus
      </Link>
      <Link
        href="/forced-focus"
        variant="primary"
        className="outline outline-2 outline-offset-2 outline-primary-800"
      >
        Forced focus (rendered at rest)
      </Link>
    </div>
  ),
}

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'All link functionality must be operable via a keyboard interface. For native `<a href>` elements, Tab moves focus to the link and Enter activates it.',
          how: 'Tab onto the link and press Enter — the play() function below asserts focus reaches the link and that pressing Enter triggers activation. Space is intentionally NOT tested because anchors do not activate on Space.',
          caveat:
            'Unlike `<button>`, anchors activate on Enter only — Space scrolls the page. This is the native HTML link contract and is correct behaviour for screen reader users who rely on it.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <Link href="#keyboard-target" variant="primary">
        Press me with Enter
      </Link>
      <p className="text-sm text-muted-foreground">
        Tab to focus, then press Enter to activate. Space does not activate
        links — it scrolls the page.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const anchor = getAnchor(canvasElement, 'Press me with Enter')

    if (anchor.tabIndex < 0) {
      throw new Error(
        `Link is not keyboard reachable: tabIndex=${anchor.tabIndex}.`
      )
    }

    anchor.focus()
    if (document.activeElement !== anchor) {
      throw new Error('Link did not receive focus after .focus().')
    }

    let activations = 0
    const handler = (event: Event) => {
      activations += 1
      // Prevent navigation away from the story page.
      event.preventDefault()
    }
    anchor.addEventListener('click', handler)

    // Pressing Enter on a focused native <a> fires the click event via the
    // browser's own activation behaviour, so this verifies the real
    // keyboard → click pipeline rather than calling .click() directly.
    await userEvent.keyboard('{Enter}')

    anchor.removeEventListener('click', handler)

    if (activations < 1) {
      throw new Error(
        `Expected Enter to activate the link at least once, observed ${activations} activations.`
      )
    }
  },
}

export const LabelInName: Story = {
  name: 'Label in Name — 2.5.3',
  parameters: {
    wcag: ['2.5.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.3',
          why: 'The accessible name of a link must contain its visible text so speech-input users can activate it by saying what they see on screen.',
          how: 'Inspect each link with the browser accessibility tree. For text links, the accessible name should match the visible text. For icon-only links, the `aria-label` must describe the action the user would associate with the icon.',
          caveat:
            'Icon-only links have no visible text — their accessible name comes entirely from `aria-label`. Choose label values that match the spoken description a user would naturally use.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">
          Text link (accessible name = visible label)
        </h4>
        <Link href="/about" variant="primary">
          About NSW Government
        </Link>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">
          Icon-only link (accessible name supplied via aria-label)
        </h4>
        <Link
          href="https://www.nsw.gov.au"
          aria-label="NSW Government home"
          variant="primary"
          className="inline-flex"
        >
          <Icons.open_in_new data-slot="icon" aria-hidden="true" />
        </Link>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const textLink = getAnchor(canvasElement, 'About NSW Government')
    const explicitLabel = textLink.getAttribute('aria-label')
    if (
      explicitLabel &&
      !explicitLabel.toLowerCase().includes('about nsw government')
    ) {
      throw new Error(
        'aria-label on the text link does not contain the visible label.'
      )
    }

    const iconLink = getAnchor(canvasElement, 'NSW Government home')
    const iconLabel = iconLink.getAttribute('aria-label')
    if (!iconLabel || iconLabel.trim().length === 0) {
      throw new Error('Icon-only link is missing an aria-label.')
    }
  },
}

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'Assistive tech must be able to programmatically determine each link\'s role (link), accessible name, and current value (href). A link without an accessible name is announced only as "link" which is meaningless.',
          how: 'Inspect each link with the browser accessibility tree (Chrome DevTools → Accessibility tab). The play() function below asserts the element is an `<a>` (implicit role="link") and exposes a non-empty accessible name.',
          caveat:
            'Native `<a href>` elements expose role="link" implicitly — no `role` attribute is required. When Link is rendered as a different element via the `as` prop, the consumer is responsible for ensuring the new element exposes correct role and name.',
        }),
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Link href="/about" variant="primary">
        About NSW Government
      </Link>
      <Link
        href="https://www.nsw.gov.au"
        aria-label="NSW Government home"
        variant="primary"
        className="inline-flex"
      >
        <Icons.open_in_new data-slot="icon" aria-hidden="true" />
      </Link>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const textLink = getAnchor(canvasElement, 'About NSW Government')

    if (textLink.tagName !== 'A') {
      throw new Error(
        `Text link should render as <a>, got <${textLink.tagName.toLowerCase()}>.`
      )
    }

    const textAccessibleName =
      textLink.getAttribute('aria-label') || textLink.textContent?.trim() || ''
    if (textAccessibleName.length === 0) {
      throw new Error('Text link has no accessible name.')
    }

    const iconLink = getAnchor(canvasElement, 'NSW Government home')
    const iconLabel = iconLink.getAttribute('aria-label')
    if (!iconLabel || iconLabel.trim().length === 0) {
      throw new Error(
        'Icon-only link is missing an aria-label — accessible name cannot be determined.'
      )
    }
  },
}
