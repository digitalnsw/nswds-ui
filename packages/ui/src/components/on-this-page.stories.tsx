/**
 * OnThisPage — Docs, Default, Playground and one story per docs section.
 *
 *   Components/OnThisPage        → this file
 *   Components/OnThisPage/Tests  → on-this-page.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { OnThisPage } from './on-this-page.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const ITEMS = [
  { id: 'who-can-apply', title: 'Who can apply' },
  { id: 'what-you-need', title: 'What you need' },
  { id: 'how-to-apply', title: 'How to apply' },
  { id: 'after-you-apply', title: 'After you apply' },
]

/** Real sections for the tracker to follow — it resolves ids from the document. */
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

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page. Their items
// point at ids that are not on the page, so `activeId` sets the marker.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          <code>orientation</code> sets the shape. <code>horizontal</code> is a bar that docks under
          the site chrome and scrolls sideways within itself when the entries outgrow it;{' '}
          <code>vertical</code> is a rail beside long-form content, its marker a segment of the
          rail&apos;s own hairline.
        </>
      }
    >
      <Example layout='stack' code={`<OnThisPage items={sections} orientation="vertical" />`}>
        <ExampleCell label='horizontal (default)'>
          <OnThisPage items={ITEMS} activeId='what-you-need' aria-label='On this page, bar' />
        </ExampleCell>
        <ExampleCell label='vertical'>
          <OnThisPage
            items={ITEMS}
            orientation='vertical'
            activeId='what-you-need'
            aria-label='On this page, rail'
          />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          The entry for the section being read takes the primary ink and the marker rule, and is
          announced with <code>aria-current=&quot;location&quot;</code> — not{' '}
          <code>&quot;page&quot;</code>, because every entry points at the page the reader is
          already on. Above the first section nothing is marked. With no sections at all it shows{' '}
          <code>emptyMessage</code>, or nothing if you pass <code>null</code>.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<OnThisPage items={[]} emptyMessage="This page has no sections." />`}
      >
        <ExampleCell label='a section reached'>
          <OnThisPage items={ITEMS} activeId='how-to-apply' aria-label='On this page, reached' />
        </ExampleCell>
        <ExampleCell label='above the first section'>
          <OnThisPage items={ITEMS} activeId={null} aria-label='On this page, not reached' />
        </ExampleCell>
        <ExampleCell label='no sections'>
          <OnThisPage
            items={[]}
            emptyMessage='This page has no sections.'
            aria-label='On this page, empty'
          />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function ControlledSection() {
  return (
    <ExampleSection
      title='Controlled'
      description={
        <>
          Left alone, the component tracks the reader itself. Pass <code>activeId</code> to own the
          state — to sync it with the URL hash or a second rail — and it reports what it observes
          through <code>onActiveChange</code> without ever setting its own. Pick one mode per
          instance and stay in it.
        </>
      }
    >
      <Example
        code={`const [activeId, setActiveId] = useState<string | null>(null)

<OnThisPage items={sections} activeId={activeId} onActiveChange={setActiveId} />`}
      >
        <OnThisPage
          items={ITEMS}
          activeId='after-you-apply'
          aria-label='On this page, controlled'
        />
      </Example>
    </ExampleSection>
  )
}

const SCENE = [
  {
    id: 'scene-eligibility',
    title: 'Who can apply',
    body: 'Check you meet the eligibility criteria before you start your application.',
  },
  {
    id: 'scene-documents',
    title: 'What you need',
    body: 'Have your proof of identity and proof of address ready.',
  },
  {
    id: 'scene-apply',
    title: 'How to apply',
    body: 'Apply online. You can save your progress and come back to it later.',
  },
]

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          A rail beside a long guide. Each entry&apos;s <code>id</code> matches a section on the
          page, and the rail follows the reader as they scroll. If chrome overlays the top of the
          page, pass its height as <code>offset</code> — <code>useChromeHeight</code> measures it —
          or sections reached through their anchor register a moment late.
        </>
      }
    >
      <Example
        layout='fill'
        code={`const { ref, height } = useChromeHeight()

<Header ref={ref} />
<OnThisPage items={sections} orientation="vertical" offset={height} />`}
      >
        <div className='grid gap-10 sm:grid-cols-[1fr_14rem]'>
          <div className='max-w-prose space-y-8'>
            <p className='text-3xl/tight font-bold'>Apply for a NSW Seniors Card</p>
            {SCENE.map((section) => (
              <section key={section.id} id={section.id} aria-label={section.title}>
                <p className='text-2xl font-semibold'>{section.title}</p>
                <p className='mt-2'>{section.body}</p>
              </section>
            ))}
          </div>
          <OnThisPage
            items={SCENE.map(({ id, title }) => ({ id, title }))}
            orientation='vertical'
            className='max-sm:row-start-1'
          />
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function OnThisPageDocs() {
  return (
    <DocsPage
      title='OnThisPage'
      npm='OnThisPage'
      registry='on-this-page'
      summary={
        <>
          Links to the sections of the page being read, marking the one the reader has reached as
          they scroll. It moves a reader within one page; every entry is an anchor to a section
          here, never a link to somewhere else.
        </>
      }
    >
      <DocsUsage
        use={[
          'A long guide or policy page with four or more headed sections.',
          'Letting a reader see where they are on a page and jump ahead.',
          'A rail beside long-form content, or a bar under the site header.',
        ]}
        avoid={[
          'Moving between the peer pages of a section — use TabNav.',
          'Navigating a section’s pages as a tree — use SideNav.',
          'Switching panels in place without scrolling — use Tabs.',
        ]}
      />
      <VariantsSection />
      <StatesSection />
      <ControlledSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/OnThisPage',
  component: OnThisPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: OnThisPageDocs },
  },
  args: {
    items: ITEMS,
    orientation: 'horizontal',
    offset: 0,
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'In-page destinations, in document order. Each `id` must match an element on the page.',
      table: { category: 'Content' },
    },
    emptyMessage: {
      control: 'text',
      description: 'Shown instead of the list when `items` is empty. `null` renders nothing.',
      table: { category: 'Content' },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'A bar under the site chrome, or a rail beside long-form content.',
      table: { category: 'Appearance' },
    },
    offset: {
      control: 'number',
      description:
        'Y-coordinate of the line a section must cross to count as current. Set it to the height of any chrome overlaying the top of the page — useChromeHeight measures it.',
      table: { category: 'Behavior' },
    },
    activeId: {
      control: 'text',
      description:
        'The active section, controlled. When set, the component reports what it observes but never sets its own state.',
      table: { category: 'Behavior' },
    },
    onActiveChange: {
      control: false,
      description: 'Fired whenever the observed section changes, in both modes.',
      table: { category: 'Events' },
    },
    'aria-label': {
      control: 'text',
      description: 'Names the navigation landmark. Defaults to "On this page".',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
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

export const Playground: Story = {}

export const Variants: Story = {
  name: 'Variants',
  parameters: { layout: 'padded' },
  render: () => <VariantsSection />,
}

export const States: Story = {
  name: 'States',
  parameters: { layout: 'padded' },
  render: () => <StatesSection />,
}

export const Controlled: Story = {
  name: 'Controlled',
  parameters: { layout: 'padded' },
  render: () => <ControlledSection />,
}

export const InContext: Story = {
  name: 'In context',
  parameters: { layout: 'padded' },
  render: () => <InContextSection />,
}
