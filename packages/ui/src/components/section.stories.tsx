/**
 * Section — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Section                → this file: Docs, Default, Playground
 *   Components/Section/Features       → section.features.stories.tsx
 *   Components/Section/Accessibility  → section.accessibility.stories.tsx
 *   Components/Section/Tests          → section.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from './container.js'
import { Section } from './section.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

const spacingDocs = [
  ['tight', '40 → 48 → 64px'],
  ['default', '64 → 80 → 112px'],
  ['loose', '80 → 112 → 144px'],
  ['none', 'No padding — the section supplies its own.'],
] as const

/** A labelled band: the space around the bar is the section's padding. */
function Band({ label }: { label: string }) {
  return (
    <Container>
      <div className='bg-background p-3 ring-1 ring-foreground/10'>
        <code>{label}</code>
      </div>
    </Container>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

export function SpacingSection() {
  return (
    <ExampleSection
      title='Spacing'
      description={
        <>
          <code>spacing</code> sets the padding above and below, growing at the <code>sm</code> and{' '}
          <code>lg</code> breakpoints. Use <code>default</code> for most bands, <code>tight</code>{' '}
          for a band that follows closely on the one before, and <code>loose</code> to give a hero
          or a closing call to action room.
        </>
      }
    >
      <Example layout='fill' code={`<Section spacing="tight" aria-label="…">…</Section>`}>
        {(['tight', 'default', 'loose'] as const).map((spacing) => (
          <Section
            key={spacing}
            spacing={spacing}
            divider
            aria-label={`${spacing} spacing`}
            className='bg-foreground/5'
          >
            <Band label={`spacing="${spacing}"`} />
          </Section>
        ))}
      </Example>
      <dl className='grid gap-x-10 gap-y-3 sm:grid-cols-2'>
        {spacingDocs.map(([spacing, description]) => (
          <div key={spacing} className='flex gap-4'>
            <dt className='w-20 shrink-0 font-semibold'>{spacing}</dt>
            <dd className='text-muted-foreground'>{description}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

export function DividerSection() {
  return (
    <ExampleSection
      title='Divider'
      description={
        <>
          <code>divider</code> draws a hairline along the bottom edge, for stacking sections on one
          surface without alternating background colours.
        </>
      }
    >
      <Example layout='fill' code={`<Section divider aria-label="…">…</Section>`}>
        <Section spacing='tight' divider aria-label='Divider example, first'>
          <Band label='divider' />
        </Section>
        <Section spacing='tight' aria-label='Divider example, second'>
          <Band label='next section' />
        </Section>
      </Example>
    </ExampleSection>
  )
}

export function NamingSection() {
  return (
    <ExampleSection
      title='Naming the section'
      description={
        <>
          A section only becomes a <code>region</code> landmark — one people can jump to — once it
          has a name. Point <code>labelledBy</code> at the <code>id</code> of its heading, or pass{' '}
          <code>aria-label</code> when there is no visible heading. Section never invents a name for
          you.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Section labelledBy="eligibility-heading">
  <Container>
    <h2 id="eligibility-heading">Who can apply</h2>
  </Container>
</Section>`}
      >
        <Section spacing='tight' labelledBy='naming-example-heading'>
          <Container>
            <p id='naming-example-heading' className='text-xl font-bold'>
              Who can apply
            </p>
            <p className='mt-2 text-muted-foreground'>You must be 18 or older and live in NSW.</p>
          </Container>
        </Section>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Stacked sections make the vertical rhythm of a service page. Each one is named by its own heading.'
    >
      <Example
        layout='fill'
        code={`<Section spacing="tight" divider labelledBy="overview-heading">
  <Container size="narrow">
    <h2 id="overview-heading">Apply for a Working with Children Check</h2>
  </Container>
</Section>
<Section spacing="tight" labelledBy="cost-heading">…</Section>`}
      >
        <Section spacing='tight' divider labelledBy='context-overview-heading'>
          <Container size='narrow'>
            <p id='context-overview-heading' className='text-2xl font-bold'>
              Apply for a Working with Children Check
            </p>
            <p className='mt-3 text-muted-foreground'>
              You need a check if you work or volunteer with children in NSW.
            </p>
          </Container>
        </Section>
        <Section spacing='tight' labelledBy='context-cost-heading'>
          <Container size='narrow'>
            <p id='context-cost-heading' className='text-xl font-bold'>
              What it costs
            </p>
            <p className='mt-3 text-muted-foreground'>
              The check is free for volunteers. Paid workers pay a fee when they apply.
            </p>
          </Container>
        </Section>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SectionDocs() {
  return (
    <DocsPage
      title='Section'
      npm='Section'
      registry='section'
      summary={
        <>
          A top-level band of a page, with the house vertical <strong>spacing</strong>. Give it a
          name and it becomes a landmark people can navigate to. Pair it with Container for the
          width and side padding.
        </>
      }
    >
      <DocsUsage
        use={[
          'Each top-level band of a landing or service page.',
          'Spacing a page’s content consistently with the rest of the site.',
          'A band that should appear in the landmark list, named by its heading.',
        ]}
        avoid={[
          'Setting the width and side padding — use Container inside it.',
          'A divider inside a card or list — use Separator.',
          'Grouping related content in a bordered box — use Card.',
        ]}
      />
      <SpacingSection />
      <DividerSection />
      <NamingSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Section',
  component: Section,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: SectionDocs },
  },
  args: {
    spacing: 'default',
    divider: false,
    labelledBy: 'demo-heading',
    children: (
      <Container>
        <h2 id='demo-heading' className='text-2xl font-bold text-foreground'>
          Apply for a Working with Children Check
        </h2>
        <p className='mt-3 text-muted-foreground'>
          The space above and below this block is the section’s spacing.
        </p>
      </Container>
    ),
  },
  argTypes: {
    spacing: {
      control: 'inline-radio',
      options: ['default', 'tight', 'loose', 'none'],
      description: 'Vertical padding step.',
      table: { category: 'Appearance' },
    },
    divider: {
      control: 'boolean',
      description: 'Hairline rule along the bottom edge.',
      table: { category: 'Appearance' },
    },
    children: {
      control: false,
      description: 'The section content — usually a Container.',
      table: { category: 'Content' },
    },
    labelledBy: {
      control: 'text',
      description: '`id` of the heading that names the section. Required for it to be a landmark.',
      table: { category: 'Accessibility' },
    },
    'aria-label': {
      control: 'text',
      description: 'Name for a section with no visible heading to point at.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Section>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector<HTMLElement>('[data-slot="section"]')
    if (!section) {
      throw new Error('Could not find an element with [data-slot="section"].')
    }

    if (section.tagName !== 'SECTION') {
      throw new Error(`Expected a <section> element, received <${section.tagName.toLowerCase()}>.`)
    }

    // The naming contract: aria-labelledby must resolve to a real element, or
    // the section is not a landmark at all.
    const labelledBy = section.getAttribute('aria-labelledby')
    if (labelledBy !== 'demo-heading') {
      throw new Error(`Expected aria-labelledby="demo-heading", received "${labelledBy}".`)
    }
    if (!section.ownerDocument.getElementById('demo-heading')) {
      throw new Error('aria-labelledby points at an element that does not exist.')
    }
  },
}

export const Playground: Story = {}
