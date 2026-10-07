/**
 * Breadcrumb — docs page, Default, Playground, CssCheck
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Breadcrumb/Looks/Default  → breadcrumb.look-default.stories.tsx
 *   Components/Breadcrumb/Looks/Rail     → breadcrumb.look-rail.stories.tsx
 *   Components/Breadcrumb/Looks/Band     → breadcrumb.look-band.stories.tsx
 *   Components/Breadcrumb/Looks/Soft     → breadcrumb.look-soft.stories.tsx
 *   Components/Breadcrumb/Features       → breadcrumb.features.stories.tsx
 *   Components/Breadcrumb/Accessibility  → breadcrumb.accessibility.stories.tsx
 *   Components/Breadcrumb/Tests          → breadcrumb.tests.stories.tsx (CI only)
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Breadcrumb, BreadcrumbList } from './breadcrumb.js'
import { Link } from './link.js'
import {
  BREADCRUMB_LOOKS,
  BreadcrumbSteps,
  BreadcrumbTrail,
  ExampleCode,
  exampleDocsClassName,
  ExamplePreview,
  ExampleSection,
  PhoneFrame,
  type BreadcrumbLook,
} from './story-helpers.js'

// ─── Docs page ────────────────────────────────────────────────────────────────

const lookCards: ReadonlyArray<{
  look: BreadcrumbLook
  name: string
  useWhen: string
  pairs: string
}> = [
  {
    look: 'default',
    name: 'Default',
    useWhen: 'Most pages. Underlined links above the page heading, with no chrome of its own.',
    pairs: 'Sits in the content column, under any Header.',
  },
  {
    look: 'rail',
    name: 'Rail',
    useWhen: 'A quiet content page that wants the masterbrand line system to frame the trail.',
    pairs: 'Sits in the content column, under any Header.',
  },
  {
    look: 'band',
    name: 'Band',
    useWhen: 'Page chrome: a solid Blue 01 strip that continues the Header above it.',
    pairs: 'Pairs with Header dark, flush in light and dark mode.',
  },
  {
    look: 'soft',
    name: 'Soft',
    useWhen: 'Page chrome that should read as part of the Header but stay quiet.',
    pairs: 'Pairs with Header white or light.',
  },
]

const lookDocsPath = (look: BreadcrumbLook) =>
  `/?path=/docs/components-breadcrumb-looks-${look}--docs`

function BreadcrumbDocs() {
  return (
    <div className={exampleDocsClassName}>
      <section className='space-y-4'>
        <h1 className='text-5xl font-bold tracking-tight'>Breadcrumb</h1>
        <p className='max-w-2xl text-lg leading-relaxed text-muted-foreground'>
          A breadcrumb shows where a page sits in its service and gives a way back up. It is
          secondary to the page heading: a citizen should read the heading first and reach for the
          trail only when they want to go up a level.
        </p>
      </section>

      <ExampleSection
        title='Default'
        description='Underlined links in the ink, separated by chevrons, ending in the current page as plain text.'
      >
        <ExamplePreview>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSteps labels={['Home', 'Services']} current='Apply online' />
            </BreadcrumbList>
          </Breadcrumb>
        </ExamplePreview>
        <ExampleCode>{`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/services">Services</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Apply online</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}</ExampleCode>
      </ExampleSection>

      <ExampleSection
        title='Choose a look'
        description='The look is a placement decision: where the trail sits on the page and what it sits under. Each has its own page with guidance, examples in context and code.'
      >
        <div className='grid gap-6 sm:grid-cols-2'>
          {lookCards.map(({ look, name, useWhen, pairs }) => (
            <article
              key={look}
              className='flex flex-col gap-4 rounded-md border border-border bg-background p-5'
            >
              <h3 className='text-xl font-bold'>{name}</h3>
              <div className='-mx-5'>
                {/* One inset for every look inside the card: band and soft
                    otherwise step on the viewport, as wide as the Header's. */}
                <Breadcrumb
                  variant={look}
                  collapse={false}
                  style={{ '--bc-inset': '1.25rem' } as React.CSSProperties}
                >
                  <BreadcrumbList>
                    <BreadcrumbSteps labels={['Home', 'Fishing']} current='Apply' />
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <p>{useWhen}</p>
              <p className='text-muted-foreground'>{pairs}</p>
              <p className='mt-auto'>
                <Link href={lookDocsPath(look)} target='_top'>
                  The {name.toLowerCase()} look
                </Link>
              </p>
            </article>
          ))}
        </div>
      </ExampleSection>

      <ExampleSection
        title='Anatomy'
        description='Plain semantic elements: a labelled nav landmark around an ordered list.'
      >
        <ul className='max-w-2xl list-disc space-y-2 ps-5'>
          <li>
            <code>Breadcrumb</code>: the <code>nav</code> landmark, labelled
            &ldquo;Breadcrumb&rdquo;. Takes <code>variant</code> and <code>collapse</code>.
          </li>
          <li>
            <code>BreadcrumbList</code> and <code>BreadcrumbItem</code>: the ordered list and its
            steps.
          </li>
          <li>
            <code>BreadcrumbLink</code>: a step you can follow. Use its <code>render</code> prop for
            a framework link (see Framework links).
          </li>
          <li>
            <code>BreadcrumbPage</code>: the current page, plain text with{' '}
            <code>aria-current=&quot;page&quot;</code>. Never a link.
          </li>
          <li>
            <code>BreadcrumbSeparator</code>: marks each boundary. Leave it empty and the step after
            it draws the look&rsquo;s glyph, so a wrapped line starts with its separator.
          </li>
          <li>
            <code>BreadcrumbEllipsis</code>: stands in for steps hidden in a menu.
          </li>
        </ul>
      </ExampleSection>

      <ExampleSection
        title='On narrow screens'
        description='When the full trail would wrap, it shortens to its first step, a “…” menu of the steps it hides, and the current page’s parent: Home › … › Licences and permits. The site root and the way up stay visible and every hidden step is one tap away. A trail that fits stays whole at any width. These are real stories at 375px, each in its own viewport.'
      >
        <div className='flex flex-wrap gap-6'>
          <PhoneFrame
            storyId='components-breadcrumb-looks-default--phone'
            title='Breadcrumb on a phone, long trail'
          />
          <PhoneFrame
            storyId='components-breadcrumb-looks-default--phone-short'
            title='Breadcrumb on a phone, short trail'
          />
        </div>
        <p className='max-w-2xl text-muted-foreground'>
          Collapse is on by default for every look. Turn it off with{' '}
          <code>collapse={'{false}'}</code> to keep the whole trail, which then wraps with each step
          leading with its separator.
        </p>
      </ExampleSection>

      <ExampleSection
        title='Hidden steps'
        description='For a trail that is deep on every screen, put middle steps in a menu yourself. Name the trigger by what it reveals, and open the menu just clear of the trail.'
      >
        <ExamplePreview>
          <BreadcrumbTrail />
        </ExamplePreview>
        <ExampleCode>{`<BreadcrumbItem>
  <DropdownMenu>
    <DropdownMenuTrigger aria-label="Show 2 more pages">
      <BreadcrumbEllipsis />
    </DropdownMenuTrigger>
    <DropdownMenuContent sideOffset={BREADCRUMB_MENU_OFFSET}>
      <DropdownMenuLinkItem href="/services" className="underline underline-offset-4">
        Services
      </DropdownMenuLinkItem>
      <DropdownMenuLinkItem href="/services/licences" className="underline underline-offset-4">
        Licences and permits
      </DropdownMenuLinkItem>
    </DropdownMenuContent>
  </DropdownMenu>
</BreadcrumbItem>`}</ExampleCode>
        <h3 className='text-lg font-semibold'>A menu of your own, or collapse?</h3>
        <ul className='max-w-2xl list-disc space-y-2 ps-5'>
          <li>
            Leave narrow screens to collapse. It measures the trail, and when it would wrap it
            builds the “…” menu from the steps it hides.
          </li>
          <li>
            Add your own menu when the trail is deep at every width — more than about five steps —
            or when its rows must use your framework’s link for client-side routing. Collapse keeps
            your menu in the trail; its own rows are plain links.
          </li>
        </ul>
      </ExampleSection>

      <ExampleSection
        title='Framework links'
        description='Render a step with your framework’s link through the render prop; here NextLink is the default export of next/link. Keep the label as BreadcrumbLink’s child, as below, so the step keeps its 44px tap target on touch screens.'
      >
        <ExampleCode>{`<BreadcrumbItem>
  <BreadcrumbLink render={<NextLink href="/services" />}>Services</BreadcrumbLink>
</BreadcrumbItem>`}</ExampleCode>
        <p className='max-w-2xl text-muted-foreground'>
          Putting the label inside the rendered element instead (
          <code>{'render={<NextLink href="/services">Services</NextLink>}'}</code>) works, but the
          step loses its touch-screen tap target.
        </p>
      </ExampleSection>

      <ExampleSection title='Writing the trail'>
        <ul className='max-w-2xl list-disc space-y-2 ps-5'>
          <li>
            Start with Home and follow the service&rsquo;s structure, not the user&rsquo;s path.
          </li>
          <li>
            Use each page&rsquo;s own title, in sentence case, so the trail matches the headings.
          </li>
          <li>End with the current page as plain text. It is never a link.</li>
          <li>Keep labels short. Long titles wrap; they are never cut off.</li>
        </ul>
      </ExampleSection>

      <ExampleSection title='Accessibility'>
        <ul className='max-w-2xl list-disc space-y-2 ps-5'>
          <li>
            A <code>nav</code> landmark labelled &ldquo;Breadcrumb&rdquo;; give it another label if
            a page has two trails.
          </li>
          <li>
            The current page carries <code>aria-current=&quot;page&quot;</code>. Separators are
            hidden from assistive technology.
          </li>
          <li>
            Links take the system&rsquo;s 2px offset focus ring, and every link and the ellipsis
            take a 44px tap target on touch screens (a link keeps it when its label is its child).
          </li>
          <li>
            A collapsed trail is a shorter list — Home, a button named &ldquo;Show 2 more
            pages&rdquo;, and the parent — in the order it is seen, so tab order and reading order
            match. The current page drops out; the page heading names it.
          </li>
        </ul>
        <p>
          <Link
            href='/?path=/story/components-breadcrumb-accessibility--name-role-value'
            target='_top'
          >
            Accessibility stories
          </Link>
        </p>
      </ExampleSection>
    </div>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      page: BreadcrumbDocs,
      description: { component: 'Shows where a page sits in its service, and the way back up.' },
    },
  },
  args: { variant: 'default', collapse: true },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: BREADCRUMB_LOOKS,
      description: 'The look. Each has its own page under Looks.',
      table: { category: 'Appearance' },
    },
    collapse: {
      control: 'boolean',
      description: 'When the full trail would wrap, shorten it to Home and the parent page.',
      table: { category: 'Behaviour' },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbSteps labels={['Home', 'Services']} current='Apply online' />
      </BreadcrumbList>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The landmark and its accessible name come from the component, not the
    // consumer — assert both are present.
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')
    await expect(nav).toBeInTheDocument()
    await expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
    await expect(nav).toHaveAttribute('data-variant', 'default')

    // The trail must expose real anchors and mark the current page.
    const links = canvasElement.querySelectorAll('[data-slot="breadcrumb"] a[href]')
    await expect(links.length).toBeGreaterThanOrEqual(1)

    const current = canvasElement.querySelector('[data-slot="breadcrumb-page"]')
    await expect(current).toHaveAttribute('aria-current', 'page')
    // The current page is plain text, not a disabled link. axe cannot see the
    // difference, so assert it here — upstream shadcn ships
    // `role='link' aria-disabled='true'` on this span and a re-scaffold would
    // quietly bring it back.
    await expect(current).not.toHaveAttribute('role')
    await expect(current).not.toHaveAttribute('aria-disabled')
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: { controls: { expanded: false, sort: 'requiredFirst' } },
  render: (args) => (
    <div className='w-full max-w-3xl'>
      <BreadcrumbTrail variant={args.variant ?? 'default'} collapse={args.collapse} />
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the list's separator colour resolves through
    // --bc-separator to a real colour rather than staying unset.
    const list = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb-list"]')
    if (!list) {
      throw new Error('Could not find [data-slot="breadcrumb-list"].')
    }
    const color = getComputedStyle(list).color
    if (color === '' || color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
      throw new Error(`Expected the --muted-foreground token to resolve, received "${color}".`)
    }
    // The 16px text floor: the trail used to render at 12px.
    await expect(getComputedStyle(list).fontSize).toBe('16px')
  },
}
