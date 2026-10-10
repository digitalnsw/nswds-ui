/**
 * Breadcrumb — the docs page, Default, Playground and one story per docs
 * section (docs/reference-storybook-standard.md).
 *
 *   Components/Breadcrumb                → this file
 *   Components/Breadcrumb/Looks/<Look>   → breadcrumb.look-<look>.stories.tsx, one
 *                                          guide page per look (a recorded
 *                                          exception in check-stories.mjs)
 *   Components/Breadcrumb/Tests          → breadcrumb.tests.stories.tsx
 *   Components/Breadcrumb/Accessibility  → breadcrumb.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'
import { expect } from 'storybook/test'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js'
import { Link } from './link.js'
import {
  BREADCRUMB_LOOKS,
  BreadcrumbScene,
  BreadcrumbSteps,
  BreadcrumbTrail,
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
  PhoneFrame,
  type BreadcrumbLook,
} from './story-helpers.js'

const LONG = ['Home', 'Services', 'Licences and permits']
const LONG_CURRENT = 'Apply for a recreational fishing licence'

const lookDocs: ReadonlyArray<{ look: BreadcrumbLook; name: string; useWhen: string }> = [
  {
    look: 'default',
    name: 'Default',
    useWhen: 'Most pages. No chrome of its own; sits in the content column under any Header.',
  },
  {
    look: 'rail',
    name: 'Rail',
    useWhen: 'A quiet content page that wants the masterbrand line system to frame the trail.',
  },
  {
    look: 'band',
    name: 'Band',
    useWhen: 'Page chrome: a solid Blue 01 strip that continues Header dark, flush in both modes.',
  },
  {
    look: 'soft',
    name: 'Soft',
    useWhen: 'Page chrome that reads as part of a white or light Header but stays quiet.',
  },
]

/** The Storybook path of a look's own guide page. */
const lookDocsPath = (look: BreadcrumbLook) =>
  `/?path=/docs/components-breadcrumb-looks-${look}--docs`

/**
 * One look, full width, with its prop value underneath. ExampleCell shrinks to
 * its content, and band and soft are full-bleed strips, so these specimens
 * set their own width. `--bc-inset` gives every look the same inset, so the
 * four trails start level inside the frame rather than at Header's
 * viewport-stepped inset.
 */
function LookSpecimen({ look }: { look: BreadcrumbLook }) {
  return (
    <div className='space-y-3'>
      <Breadcrumb variant={look} style={{ '--bc-inset': '1rem' } as React.CSSProperties}>
        <BreadcrumbList>
          <BreadcrumbSteps labels={['Home', 'Fishing']} current='Apply for a licence' />
        </BreadcrumbList>
      </Breadcrumb>
      <p className='text-base text-muted-foreground'>{look}</p>
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          The <code>variant</code> is a placement decision: where the trail sits on the page and
          what it sits under. Links keep the same signature on every look — medium weight and
          underlined — and the current page is regular weight. Each look has its own guide page with
          pairing, phone and do-and-don&rsquo;t guidance.
        </>
      }
    >
      <Example layout='fill' code={`<Breadcrumb variant="band">…</Breadcrumb>`}>
        <div className='grid gap-8'>
          {BREADCRUMB_LOOKS.map((look) => (
            <LookSpecimen key={look} look={look} />
          ))}
        </div>
      </Example>
      <dl className='grid gap-x-10 gap-y-4 sm:grid-cols-2'>
        {lookDocs.map(({ look, name, useWhen }) => (
          <div key={look} className='flex gap-4'>
            <dt className='w-20 shrink-0 font-semibold'>{look}</dt>
            <dd className='space-y-1'>
              <p className='text-muted-foreground'>{useWhen}</p>
              <p>
                <Link href={lookDocsPath(look)} target='_top'>
                  The {name.toLowerCase()} look
                </Link>
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

function CompositionSection() {
  return (
    <ExampleSection
      title='Composition'
      description='Plain semantic parts: a labelled nav landmark around an ordered list of steps, ending in the current page as plain text.'
    >
      <Example
        code={`<Breadcrumb>
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
</Breadcrumb>`}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='#home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='#services'>Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Apply online</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Example>
      <ul className='max-w-[65ch] list-disc space-y-2 ps-5'>
        <li>
          <code>Breadcrumb</code>: the <code>nav</code> landmark, labelled &ldquo;Breadcrumb&rdquo;
          — give it another <code>aria-label</code> if a page has two trails. Takes{' '}
          <code>variant</code> and <code>collapse</code>.
        </li>
        <li>
          <code>BreadcrumbList</code> and <code>BreadcrumbItem</code>: the ordered list and its
          steps.
        </li>
        <li>
          <code>BreadcrumbLink</code>: a step you can follow, with the link signature and the
          system&rsquo;s 2px offset focus ring.
        </li>
        <li>
          <code>BreadcrumbPage</code>: the current page, plain text with{' '}
          <code>aria-current=&quot;page&quot;</code>. Never a link.
        </li>
        <li>
          <code>BreadcrumbSeparator</code>: marks each boundary and is hidden from assistive
          technology. Leave it empty and the step after it draws the look&rsquo;s glyph, so a
          wrapped line starts with its separator.
        </li>
        <li>
          <code>BreadcrumbEllipsis</code>: stands in for steps hidden in a menu (see Hidden steps).
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
  )
}

function CollapseSection() {
  return (
    <ExampleSection
      title='Collapse'
      description={
        <>
          On by default for every look. When the full trail would wrap, it shortens to its first
          step, a &ldquo;…&rdquo; menu of the steps it hides, and the current page&rsquo;s parent:
          Home › … › Licences and permits. The site root and the way up stay visible, every hidden
          step is one tap away, and the reading and tab order match what is seen. A trail that fits
          stays whole at any width. Turn it off with <code>collapse={'{false}'}</code> to keep the
          whole trail, which then wraps with each step leading with its separator.
        </>
      }
    >
      <Example layout='grid' code={`<Breadcrumb collapse={false}>…</Breadcrumb>`}>
        <ExampleCell label='collapse (default), 375px'>
          <div style={{ width: 375 }}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </ExampleCell>
        <ExampleCell label='collapse={false}, 375px'>
          <div style={{ width: 375 }}>
            <Breadcrumb collapse={false}>
              <BreadcrumbList>
                <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </ExampleCell>
      </Example>
      <p className='max-w-[65ch] text-muted-foreground'>
        On a real phone, each in its own 375px viewport: a long trail that collapses, and a short
        one that fits and stays whole.
      </p>
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
    </ExampleSection>
  )
}

function HiddenStepsSection() {
  return (
    <ExampleSection
      title='Hidden steps'
      description={
        <>
          For a trail that is deep on every screen — more than about five steps — put the middle
          steps in a menu yourself. Name the trigger by what it reveals, open the menu at{' '}
          <code>BREADCRUMB_MENU_OFFSET</code> so it clears the trail, and underline its rows like
          the trail&rsquo;s links. Collapse keeps your menu in the trail. Add your own, too, when
          the rows must use your framework&rsquo;s link: the menu collapse builds holds plain links.
        </>
      }
    >
      <Example
        code={`<BreadcrumbItem>
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
</BreadcrumbItem>`}
      >
        <BreadcrumbTrail />
      </Example>
    </ExampleSection>
  )
}

function FrameworkLinksSection() {
  return (
    <ExampleSection
      title='Framework links'
      description={
        <>
          Render a step with your framework&rsquo;s link through the <code>render</code> prop; here{' '}
          <code>NextLink</code> is the default export of <code>next/link</code>. Keep the label as{' '}
          <code>BreadcrumbLink</code>&rsquo;s child so the step keeps its 44px tap target on touch
          screens — put the label inside the rendered element instead and it loses it.
        </>
      }
    >
      <Example
        code={`<BreadcrumbItem>
  <BreadcrumbLink render={<NextLink href="/services" />}>Services</BreadcrumbLink>
</BreadcrumbItem>`}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href='#home' />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href='#services' />}>Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Apply online</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='The trail sits directly above the page heading and stays secondary to it: a citizen reads the heading first and reaches for the trail only to go up a level.'
    >
      <Example layout='fill'>
        <BreadcrumbScene look='default' header='white' />
      </Example>
      <ul className='max-w-[65ch] list-disc space-y-2 ps-5'>
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
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function BreadcrumbDocs() {
  return (
    <DocsPage
      title='Breadcrumb'
      npm={[
        'Breadcrumb',
        'BreadcrumbList',
        'BreadcrumbItem',
        'BreadcrumbLink',
        'BreadcrumbPage',
        'BreadcrumbSeparator',
        'BreadcrumbEllipsis',
        'BREADCRUMB_MENU_OFFSET',
      ]}
      registry='breadcrumb'
      summary={
        <>
          A breadcrumb shows where a page sits in its service and gives a way back up. It is
          secondary to the page heading on every <strong>look</strong>, and on narrow screens it{' '}
          <strong>collapses</strong> rather than wrapping, keeping Home and the way up in view.
        </>
      }
    >
      <DocsUsage
        use={[
          'A page two or more levels deep in a service, so people can see where they are and go up.',
          'Content sections with a clear hierarchy, such as a topic, its subtopics and their pages.',
          'Above the page heading, as the first thing in the content column or under the Header.',
        ]}
        avoid={[
          'Moving through the steps of a form or transaction — use StepIndicator.',
          'Navigating between the pages of a section — use SideNav; within one page, OnThisPage.',
          'Going back one step in a task — use a Link such as “Back”.',
        ]}
      />
      <VariantsSection />
      <CompositionSection />
      <CollapseSection />
      <HiddenStepsSection />
      <FrameworkLinksSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
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
    docs: { page: BreadcrumbDocs },
  },
  args: { variant: 'default', collapse: true },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: BREADCRUMB_LOOKS,
      description: 'The look. Each has its own guide page under Looks.',
      table: { category: 'Appearance' },
    },
    collapse: {
      control: 'boolean',
      description:
        'When the full trail would wrap, shorten it to Home, a menu of the hidden steps and the parent page.',
      table: { category: 'Behavior' },
    },
    'aria-label': {
      control: 'text',
      description: 'Names the landmark. Defaults to "Breadcrumb"; change it if a page has two.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
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

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const Composition: Story = { name: 'Composition', render: () => <CompositionSection /> }

export const Collapse: Story = { name: 'Collapse', render: () => <CollapseSection /> }

export const HiddenSteps: Story = { name: 'Hidden steps', render: () => <HiddenStepsSection /> }

export const FrameworkLinks: Story = {
  name: 'Framework links',
  render: () => <FrameworkLinksSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
