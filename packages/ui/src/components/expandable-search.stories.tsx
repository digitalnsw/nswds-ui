/**
 * ExpandableSearch — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/ExpandableSearch               → this file: Docs, Default, Playground
 *   Components/ExpandableSearch/Features      → expandable-search.features.stories.tsx
 *   Components/ExpandableSearch/Accessibility → expandable-search.accessibility.stories.tsx
 *   Components/ExpandableSearch/Tests         → expandable-search.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 *
 * A 48px search chip that expands into a text field on focus or while it
 * holds a value, and submits the query to `onAction`. Every variant's icon,
 * halos, placeholder and focus outline derive from a single --search-ink
 * token.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ExpandableSearch, ExpandableSearchField } from './expandable-search.js'
import { Header, HeaderActions, HeaderBrand } from './header.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const colourSteps = [
  'primary-800',
  'primary-600',
  'primary-400',
  'primary-200',
  'grey-800',
  'grey-600',
  'grey-400',
  'grey-200',
  'accent-800',
  'accent-600',
  'accent-400',
  'accent-200',
] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

const colourGroups = [
  {
    title: 'For white and light-grey chrome',
    description: (
      <>
        <code>default</code> is the nswds-app grey chip with a primary-blue icon, for a header on
        white. <code>white</code> is a white chip with grey ink, for chrome that is already light
        grey.
      </>
    ),
    variants: ['default', 'white'],
  },
  {
    title: 'Primary',
    description: (
      <>
        The brand blue steps, for a header or footer in the masterbrand colour. The dark steps take
        white ink, the light steps primary-800 ink.
      </>
    ),
    variants: ['primary-800', 'primary-600', 'primary-400', 'primary-200'],
  },
  {
    title: 'Grey',
    description: (
      <>Neutral steps, for grey chrome. Dark steps take white ink, light steps grey-800.</>
    ),
    variants: ['grey-800', 'grey-600', 'grey-400', 'grey-200'],
  },
  {
    title: 'Accent',
    description: (
      <>
        The accent (waratah red) steps, for an accent-coloured band. Dark steps take white ink,
        light steps accent-800.
      </>
    ),
    variants: ['accent-800', 'accent-600', 'accent-400', 'accent-200'],
  },
] as const

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          The footer&rsquo;s thirteen surface names plus <code>default</code> — the nswds-app grey
          chip with a primary-blue icon, for headers on white. Icon, hover halos, placeholder and
          the focus outline all derive from each surface&rsquo;s <code>--search-ink</code>, so a
          variant is one declaration, and every pair meets WCAG 2.2 AA in light mode and AAA in
          dark.
        </>
      }
    >
      <Example
        className='bg-background'
        code={`<ExpandableSearch variant="primary-800">
  <ExpandableSearchField placeholder="Search" />
</ExpandableSearch>`}
      >
        {(['default', 'primary-800', 'grey-800'] as const).map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <ExpandableSearch variant={variant}>
              <ExpandableSearchField placeholder='Search' label={`Search (${variant})`} />
            </ExpandableSearch>
          </ExampleCell>
        ))}
      </Example>
      <div className='space-y-10 pt-4'>
        {colourGroups.map((group) => (
          <div key={group.title} className='space-y-4'>
            <div className='space-y-1'>
              <h3 className='text-lg font-semibold'>{group.title}</h3>
              <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
                {group.description}
              </p>
            </div>
            <Example
              className='bg-background'
              code={`<ExpandableSearch variant="${group.variants[0]}">…</ExpandableSearch>`}
            >
              {group.variants.map((variant) => (
                <ExampleCell key={variant} label={variant}>
                  {/* The white chip is made for light-grey chrome; on the white panel it would vanish. */}
                  <div className={variant === 'white' ? 'rounded-md bg-muted p-3' : undefined}>
                    <ExpandableSearch variant={variant}>
                      <ExpandableSearchField placeholder='Search' label={`Search (${variant})`} />
                    </ExpandableSearch>
                  </div>
                </ExampleCell>
              ))}
            </Example>
          </div>
        ))}
      </div>
    </ExampleSection>
  )
}

export function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          Collapsed, it is a 48px chip — but the chip is the text input itself, so the first tap or
          Tab both opens and focuses the field. It stays open while focused or while it holds a
          query, and closes again once empty and blurred. Seed a query with{' '}
          <code>defaultValue</code> on the root.
        </>
      }
    >
      <Example
        code={`<ExpandableSearch defaultValue="planning permits" onAction={search}>
  <ExpandableSearchField placeholder="Search" />
</ExpandableSearch>`}
      >
        <ExampleCell label='collapsed'>
          <ExpandableSearch>
            <ExpandableSearchField placeholder='Search' label='Search (collapsed)' />
          </ExpandableSearch>
        </ExampleCell>
        <ExampleCell label='holding a query'>
          <ExpandableSearch defaultValue='planning permits'>
            <ExpandableSearchField placeholder='Search' label='Search (holding a query)' />
          </ExpandableSearch>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function LabelsSection() {
  return (
    <ExampleSection
      title='Labels'
      description={
        <>
          The input and its submit button are both named &ldquo;Search&rdquo; unless you say
          otherwise. Name what is being searched with <code>label</code>, and translate the button
          with <code>buttonLabel</code>. The input label is visually hidden, so it is the only name
          a screen reader user hears.
        </>
      }
    >
      <Example
        code={`<ExpandableSearchField label="Search NSW Health" buttonLabel="Submit search" />`}
      >
        <ExampleCell label='label="Search NSW Health"'>
          <ExpandableSearch defaultValue='flu vaccine'>
            <ExpandableSearchField
              label='Search NSW Health'
              buttonLabel='Submit search'
              placeholder='Search NSW Health'
            />
          </ExpandableSearch>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          In the header actions, matching the header&apos;s surface. The root does not claim{' '}
          <code>role=&quot;search&quot;</code>, because a page should have one search landmark — add
          it yourself where this is the site search.
        </>
      }
    >
      <Example layout='fill' className='max-sm:p-0 sm:p-0'>
        <Header sticky={false} shadow={false}>
          <HeaderBrand sitename='Transport for NSW' />
          <HeaderActions>
            <ExpandableSearch role='search'>
              <ExpandableSearchField placeholder='Search Transport for NSW' />
            </ExpandableSearch>
          </HeaderActions>
        </Header>
      </Example>
    </ExampleSection>
  )
}

export function AccessibilitySection() {
  return (
    <ExampleSection
      title='Accessibility'
      description={
        <>
          The collapsed control is the text input itself, styled as a chip — so the first focus or
          tap both reveals and focuses the field. It carries a visually-hidden label and{' '}
          <code>aria-label</code> (&ldquo;Search&rdquo;, overridable), is{' '}
          <code>type=&quot;search&quot;</code> with <code>enterKeyHint=&quot;search&quot;</code>,
          and keyboard focus draws a 2px ink outline inside the chip, where contrast with the
          surface is guaranteed on every variant. Transitions honour{' '}
          <code>prefers-reduced-motion</code>.
        </>
      }
    >
      <Example
        code={`<ExpandableSearch onAction={search}>
  <ExpandableSearchField label="Search Transport for NSW" />
</ExpandableSearch>`}
      >
        <ExampleCell label='Tab here — focus opens the field and draws the ink outline'>
          <ExpandableSearch>
            <ExpandableSearchField
              label='Search Transport for NSW'
              placeholder='Search Transport for NSW'
            />
          </ExpandableSearch>
        </ExampleCell>
      </Example>
      <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
        Name, Role, Value (4.1.2), Keyboard (2.1.1), Focus Visible (2.4.7), Contrast (1.4.3 and
        1.4.11, light and dark) and Target Size (2.5.8) are each asserted in the{' '}
        <strong className='font-semibold text-foreground'>Accessibility</strong> stories under this
        component.
      </p>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ExpandableSearchDocs() {
  return (
    <DocsPage
      title='ExpandableSearch'
      npm={['ExpandableSearch', 'ExpandableSearchField']}
      registry='expandable-search'
      summary={
        <>
          A site-search disclosure for page chrome: a 48px chip that expands into a text field the
          moment it takes focus, and stays open while it holds a value. Enter (or the search button)
          submits the query to <code>onAction</code>; Escape clears; an empty, blurred field
          collapses back to the chip. Compose <code>ExpandableSearchField</code> inside{' '}
          <code>ExpandableSearch</code>, typically within <code>HeaderActions</code>.
        </>
      }
    >
      <DocsUsage
        use={[
          'Site search in a Header where space is tight, such as beside sign-in and menu buttons.',
          'A search that should stay out of the way until someone wants it.',
          'Search on a coloured header or footer surface that the chip should match.',
        ]}
        avoid={[
          'Search is the main task on the page — use an always-open field, such as InputGroup with a Search action.',
          'You want suggestions or a keyboard shortcut — use SiteSearch.',
          'Filtering a list already on the page — use Input.',
        ]}
      />
      <VariantsSection />
      <StatesSection />
      <LabelsSection />
      <InContextSection />
      <AccessibilitySection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/ExpandableSearch',
  component: ExpandableSearch,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ExpandableSearchDocs },
  },
  args: {
    variant: 'default',
    onAction: fn(),
    children: <ExpandableSearchField placeholder='Search this site' />,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'white', ...colourSteps],
      description:
        'Surface colour — the footer vocabulary plus default (grey chip, primary icon). Icon, halos, placeholder and focus outline derive from the surface ink.',
      table: { category: 'Appearance' },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial query. A non-empty value renders the field expanded.',
      table: { category: 'Behavior' },
    },
    onAction: {
      description:
        'Called with the current query when the form submits (Enter or the search button).',
      table: { category: 'Events' },
    },
    onSubmit: {
      description:
        'The native form submit handler. Prevent its default to stop onAction being called.',
      table: { category: 'Events' },
    },
    children: {
      control: false,
      description: 'One ExpandableSearchField.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof ExpandableSearch>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRoot(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLFormElement>('form[data-slot="expandable-search"]')
  if (!el) {
    throw new Error('Could not find a <form> with [data-slot="expandable-search"].')
  }
  return el
}

function getInput(root: HTMLElement) {
  const el = root.querySelector<HTMLInputElement>('[data-slot="expandable-search-input"]')
  if (!el) {
    throw new Error('Could not find the [data-slot="expandable-search-input"] input.')
  }
  return el
}

/** Poll until `predicate` holds, so the 300ms expansion has time to settle. */
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

/**
 * Set a React-controlled input's value the way a user would: through the
 * native setter (so React's value tracking notices the change) followed by a
 * bubbling input event.
 */
function typeIntoInput(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
  if (!setter) {
    throw new Error('Could not access the native HTMLInputElement value setter.')
  }
  setter.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    // The meta's onAction is a spy, reset by Storybook before each run.
    const onAction = args.onAction as ReturnType<typeof fn>
    const root = getRoot(canvasElement)
    const input = getInput(root)

    // Collapsed: a 48px chip whose purpose is still machine-readable.
    if (root.hasAttribute('data-expanded')) {
      throw new Error('Expected the field to render collapsed before any interaction.')
    }
    if (input.type !== 'search') {
      throw new Error(`Expected the input to be type="search", got type="${input.type}".`)
    }
    if (input.getAttribute('aria-label') !== 'Search') {
      throw new Error(
        `Expected the collapsed input to carry aria-label "Search", got "${input.getAttribute('aria-label')}".`,
      )
    }
    const collapsedWidth = input.getBoundingClientRect().width
    if (Math.round(collapsedWidth) !== 48) {
      throw new Error(`Expected the collapsed input to be 48px wide, got ${collapsedWidth}px.`)
    }

    // Focus expands: data-expanded appears and the width transition runs.
    input.focus()
    await waitFor(
      () => root.hasAttribute('data-expanded'),
      'Expected data-expanded on the root once the input took focus.',
    )
    await waitFor(
      () => input.getBoundingClientRect().width > collapsedWidth * 3,
      'Expected the input to expand well beyond its 48px chip once focused.',
    )

    // Type a query and submit the form; onAction receives the value.
    typeIntoInput(input, 'planning permits')
    await waitFor(
      () => input.value === 'planning permits',
      'Expected typing to update the controlled value.',
    )
    root.requestSubmit()
    await waitFor(
      () => onAction.mock.calls.some(([value]) => value === 'planning permits'),
      'Expected onAction to receive the submitted query "planning permits".',
    )

    // Cleared and blurred, the field collapses back to the chip.
    typeIntoInput(input, '')
    input.blur()
    await waitFor(
      () => !root.hasAttribute('data-expanded'),
      'Expected the field to collapse once empty and blurred.',
    )
  },
}

export const Playground: Story = {}
