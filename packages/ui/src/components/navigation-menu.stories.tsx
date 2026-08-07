/**
 * NavigationMenu — Default + Switching + Current page + CssCheck + Playground
 *
 * A menubar of triggers whose panels open into one shared, animated popup.
 * Wraps @base-ui/react/navigation-menu; the Portal → Positioner → Popup →
 * Viewport plumbing lives inside the root component, so stories only compose
 * Trigger/Content pairs.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerVariants,
  type NavigationMenuProps,
} from './navigation-menu.js'

const meta = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>NavigationMenu</h1>
            <p className='text-base text-muted-foreground'>
              A row of menubar triggers that open link panels inside one shared popup — the popup
              morphs and glides between sections instead of closing and reopening. Compose{' '}
              <code>NavigationMenuList</code> → <code>NavigationMenuItem</code> →{' '}
              <code>NavigationMenuTrigger</code> + <code>NavigationMenuContent</code>; the popup
              plumbing is built into <code>NavigationMenu</code> itself.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>Links</h2>
            <p className='text-base text-muted-foreground'>
              <code>NavigationMenuLink</code> renders through the design system&rsquo;s{' '}
              <code>Link</code>, so a framework link (e.g. next/link) injected via{' '}
              <code>LinkProvider</code> is used automatically while Base UI keeps the keyboard and
              close-on-navigate behaviour. Mark the current page with <code>active</code> — there is
              no router coupling here; compare your app&rsquo;s pathname to each <code>href</code>{' '}
              and pass the result down.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>Accessibility</h2>
            <p className='text-base text-muted-foreground'>
              Triggers are real buttons with <code>aria-expanded</code>/<code>aria-controls</code>;
              ArrowDown or Enter opens from the keyboard, arrow keys rove along the list, Escape and
              focus-out close, and <code>active</code> links announce{' '}
              <code>aria-current=&quot;page&quot;</code>. The root is a <code>&lt;nav&gt;</code>{' '}
              landmark — pass <code>aria-label</code> when a page has more than one.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'Menubar navigation with link panels in one shared, animated popup. Base UI navigation-menu underneath; panels teleport into a single viewport so section switches cross-fade instead of reopening.',
      },
    },
  },
  args: {
    sideOffset: 8,
  },
  argTypes: {
    delay: {
      control: 'number',
      description: 'Milliseconds a trigger must be hovered before its panel opens. Default 50.',
      table: { category: 'Behaviour' },
    },
    closeDelay: {
      control: 'number',
      description: 'Milliseconds the pointer can leave before the popup closes. Default 50.',
      table: { category: 'Behaviour' },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Arrow-key axis of the menubar. Horizontal menus open panels with ArrowDown.',
      table: { category: 'Behaviour' },
    },
    side: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Side of the trigger row the popup anchors to.',
      table: { category: 'Positioning' },
    },
    sideOffset: {
      control: 'number',
      description: 'Gap in px between the trigger row and the popup surface.',
      table: { category: 'Positioning' },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alignment of the popup against the active trigger.',
      table: { category: 'Positioning' },
    },
    alignOffset: {
      control: 'number',
      description: 'Additional alignment offset in px.',
      table: { category: 'Positioning' },
    },
    collisionPadding: {
      table: { disable: true, category: 'Positioning' },
    },
    collisionAvoidance: {
      table: { disable: true, category: 'Positioning' },
    },
    children: {
      table: { disable: true, category: 'Content' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
    popupClassName: {
      table: { disable: true, category: 'Advanced' },
    },
  },
} satisfies Meta<typeof NavigationMenu>

export default meta

type Story = StoryObj<typeof meta>

// ─── Demo content (adapted from nswds-app NavigationMenuBasicDemo) ───────────

type DemoLink = { title: string; description: string; href: string }
type DemoSection = { title: string; links: DemoLink[] }

const sections: DemoSection[] = [
  {
    title: 'Services',
    links: [
      {
        title: 'Talk to someone',
        description: 'Immediate support options and counselling pathways.',
        href: '#talk-to-someone',
      },
      {
        title: 'Get a quit plan',
        description: 'Simple tools for setting a date and managing triggers.',
        href: '#quit-plan',
      },
      {
        title: 'Track progress',
        description: 'Basic self-monitoring for cravings and milestones.',
        href: '#track-progress',
      },
    ],
  },
  {
    title: 'Learn',
    links: [
      {
        title: 'Why quitting is hard',
        description: 'Short explainer content about cravings and habits.',
        href: '#why-quitting-is-hard',
      },
      {
        title: 'Medication options',
        description: 'Overview of common therapies and GP conversations.',
        href: '#medication-options',
      },
      {
        title: 'Support articles',
        description: 'Reference content for common questions and next steps.',
        href: '#support-articles',
      },
    ],
  },
  {
    title: 'About',
    links: [
      {
        title: 'About the service',
        description: 'Background on the program and how it helps people quit.',
        href: '#about-the-service',
      },
      {
        title: 'For health professionals',
        description: 'Information for referrals and clinical support.',
        href: '#health-professionals',
      },
      {
        title: 'Contact us',
        description: 'General contact details and feedback pathways.',
        href: '#contact-us',
      },
    ],
  },
]

/**
 * Shared demo menu. `currentHref` marks the matching link as the current page
 * — the pattern consumers use instead of the app source's `usePathname`.
 * The spacer div leaves room in the canvas for the portalled popup.
 */
function DemoMenu({
  currentHref,
  ...args
}: NavigationMenuProps & {
  currentHref?: string
}) {
  return (
    <div className='min-h-[360px]'>
      <NavigationMenu aria-label='Demo navigation menu' {...args}>
        <NavigationMenuList>
          {sections.map((section) => (
            <NavigationMenuItem key={section.title}>
              <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[420px] max-w-full gap-1'>
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <NavigationMenuLink href={link.href} active={link.href === currentHref}>
                        <span className='font-medium text-foreground'>{link.title}</span>
                        <span className='text-muted-foreground'>{link.description}</span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}

          {/* A panel-less item: the exported trigger cva restyles a plain link
              to sit visually beside the triggers (flex-row overrides the
              link's stacked layout via cn's conflict merge). */}
          <NavigationMenuItem>
            <NavigationMenuLink
              href='#contact'
              className={navigationMenuTriggerVariants({ className: 'flex-row' })}
            >
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Poll until `predicate` holds, so popup mount/teleport has time to settle. */
async function waitFor(predicate: () => boolean, message: string, timeout = 2000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (predicate()) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 16))
  }
  throw new Error(message)
}

function getTriggers(canvasElement: HTMLElement) {
  const triggers = canvasElement.querySelectorAll<HTMLButtonElement>(
    '[data-slot="navigation-menu-trigger"]',
  )
  if (triggers.length === 0) {
    throw new Error('Could not find any [data-slot="navigation-menu-trigger"] buttons.')
  }
  return Array.from(triggers)
}

// The popup renders through a portal on document.body, outside canvasElement.
function queryPopup() {
  return document.querySelector<HTMLElement>('[data-slot="navigation-menu-popup"]')
}

/**
 * Close the menu and wait for the popup to unmount. Every play() that opens a
 * menu must end with this: while the popup is mounted, Base UI renders
 * focus-guard sentinels (aria-hidden spans with tabindex="0" — deliberately
 * focusable, that is how they catch focus leaving the popup), and the a11y
 * addon's after-play axe pass would flag them as aria-hidden-focus violations.
 * Closing first means axe audits the resting state, which is also what real
 * pages leave behind.
 */
async function closeMenu() {
  ;(document.activeElement ?? document.body).dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
  )
  await waitFor(() => queryPopup() === null, 'Expected Escape to close the menu before axe runs.')
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => <DemoMenu {...args} />,
  play: async ({ canvasElement }) => {
    const [trigger] = getTriggers(canvasElement)

    if (trigger!.tagName !== 'BUTTON') {
      throw new Error(`Expected the trigger to render a <button>, got <${trigger!.tagName}>.`)
    }
    if (trigger!.getAttribute('aria-expanded') !== 'false') {
      throw new Error('Expected a closed trigger to have aria-expanded="false".')
    }
    if (!trigger!.querySelector('[data-slot="navigation-menu-icon"]')) {
      throw new Error('Expected the trigger to render its chevron icon part.')
    }

    // Keyboard open: focus the trigger, then ArrowDown (Base UI's open key for
    // a horizontal menubar — handled in React, so a dispatched event works).
    trigger!.focus()
    if (document.activeElement !== trigger) {
      throw new Error('Expected the trigger to take keyboard focus.')
    }
    trigger!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
    )

    await waitFor(() => queryPopup() !== null, 'Expected ArrowDown to open the popup.')
    await waitFor(
      () => trigger!.hasAttribute('data-popup-open'),
      'Expected the open trigger to carry data-popup-open.',
    )
    if (trigger!.getAttribute('aria-expanded') !== 'true') {
      throw new Error('Expected the open trigger to have aria-expanded="true".')
    }

    // The first section's links teleported into the popup and are visible.
    await waitFor(() => {
      const link = queryPopup()?.querySelector<HTMLElement>('[data-slot="navigation-menu-link"]')
      return (
        !!link &&
        link.getBoundingClientRect().height > 0 &&
        !!link.textContent?.includes('Talk to someone')
      )
    }, 'Expected the Services links to be visible inside the popup.')

    // Escape closes. Dispatch from wherever focus landed so the event bubbles
    // through the React tree that owns the dismiss handler.
    const escapeTarget =
      document.activeElement instanceof HTMLElement ? document.activeElement : trigger!
    escapeTarget.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )
    await waitFor(
      () => !trigger!.hasAttribute('data-popup-open'),
      'Expected Escape to close the menu.',
    )
  },
}

export const Switching: Story = {
  name: 'Switching sections',
  render: (args) => <DemoMenu {...args} />,
  play: async ({ canvasElement }) => {
    const [first, second] = getTriggers(canvasElement)

    // Open the first section with a click (what Enter produces on a button).
    first!.click()
    await waitFor(
      () => first!.hasAttribute('data-popup-open') && queryPopup() !== null,
      'Expected clicking the first trigger to open its panel.',
    )
    await waitFor(
      () => !!queryPopup()?.textContent?.includes('Talk to someone'),
      'Expected the Services panel inside the popup.',
    )

    // Click the second trigger: same popup, content swaps — no close/reopen.
    const popupBeforeSwitch = queryPopup()
    second!.click()
    await waitFor(
      () => second!.hasAttribute('data-popup-open') && !first!.hasAttribute('data-popup-open'),
      'Expected the open state to move to the second trigger.',
    )
    await waitFor(
      () => !!queryPopup()?.textContent?.includes('Medication options'),
      'Expected the Learn panel to replace the Services panel.',
    )
    if (queryPopup() !== popupBeforeSwitch) {
      throw new Error('Expected section switching to reuse the shared popup, not remount it.')
    }

    await closeMenu()
  },
}

export const CurrentPage: Story = {
  name: 'Current page link',
  render: (args) => <DemoMenu {...args} currentHref='#quit-plan' />,
  play: async ({ canvasElement }) => {
    const [trigger] = getTriggers(canvasElement)
    trigger!.click()
    await waitFor(() => queryPopup() !== null, 'Expected the popup to open.')

    await waitFor(
      () => !!queryPopup()?.querySelector('[data-slot="navigation-menu-link"][data-active]'),
      'Expected the matching link to carry data-active.',
    )
    const activeLink = queryPopup()!.querySelector<HTMLAnchorElement>(
      '[data-slot="navigation-menu-link"][data-active]',
    )!
    if (activeLink.getAttribute('aria-current') !== 'page') {
      throw new Error('Expected the active link to announce aria-current="page".')
    }
    if (!activeLink.textContent?.includes('Get a quit plan')) {
      throw new Error(
        `Expected the "#quit-plan" link to be the active one, got "${activeLink.textContent}".`,
      )
    }

    await closeMenu()
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  render: (args) => <DemoMenu {...args} />,
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the ink token chain resolves on the trigger,
    // and the popup surface paints a real bg-popover colour.
    const [trigger] = getTriggers(canvasElement)

    const ink = getComputedStyle(trigger!).getPropertyValue('--nav-menu-ink').trim()
    if (ink === '') {
      throw new Error('Expected --nav-menu-ink to resolve on the trigger. Is globals.css loaded?')
    }
    const halo = getComputedStyle(trigger!).getPropertyValue('--nav-menu-halo').trim()
    if (halo === '') {
      throw new Error('Expected --nav-menu-halo to mix down from --nav-menu-ink.')
    }

    trigger!.click()
    await waitFor(() => queryPopup() !== null, 'Expected the popup to open.')

    const popupBg = getComputedStyle(queryPopup()!).backgroundColor
    if (popupBg === '' || popupBg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-popover to resolve to a visible colour, got "${popupBg}". Is globals.css loaded?`,
      )
    }

    await closeMenu()
  },
}

export const Playground: Story = {
  render: (args) => <DemoMenu {...args} />,
  parameters: {
    controls: {
      expanded: false,
      sort: 'requiredFirst',
    },
  },
}
