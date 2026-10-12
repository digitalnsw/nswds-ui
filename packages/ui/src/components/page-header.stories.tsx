/**
 * PageHeader — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/PageHeader                → this file: Docs, Default, Playground
 *   Components/PageHeader/Features       → page-header.features.stories.tsx
 *   Components/PageHeader/Accessibility  → page-header.accessibility.stories.tsx
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js'
import { Container } from './container.js'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderRule,
  PageHeaderTitle,
  type PageHeaderColor,
} from './page-header.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleSection,
  PhoneFrame,
} from './story-helpers.js'

const title = 'Discovery Pass'
const longTitle = 'Apply for a recreational fishing fee exemption'
const description = 'Get unlimited travel on NSW TrainLink Regional trains and coaches.'
const updated = 'Last updated 3 October 2026'
const site = 'transportnsw.info'

const colors: PageHeaderColor[] = ['blue', 'navy', 'red']

const colorDocs: ReadonlyArray<readonly [PageHeaderColor, string]> = [
  ['blue', 'Blue 02, the brand’s bright blue: the default, and the Transport for NSW reference.'],
  ['navy', 'Blue 01, the brand band, so the box matches a dark header and the ink above it.'],
  [
    'red',
    'Red 02, the waratah: for a campaign or landing page that leads with red. The rule follows.',
  ],
]

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          The header sits under the site’s Breadcrumb, which is its own component, not a slot. The
          default breadcrumb carries no inset of its own, so it sits in the page’s Container, whose
          16 → 24 → 48px inset the header shares. The title box clears the breadcrumb by 24px (16px
          on a phone) and its text lines up with the breadcrumb and the body below; only the box
          hangs into the margin.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Container>
  <Breadcrumb>…</Breadcrumb>
</Container>
<PageHeader labelledBy="page-title">
  <PageHeaderTitle id="page-title">Discovery Pass</PageHeaderTitle>
  <PageHeaderDescription>…</PageHeaderDescription>
  <PageHeaderRule />
</PageHeader>`}
      >
        <Container>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='#home'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='#regional-travel'>Regional travel</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='#regional-offers'>Regional offers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
        <PageHeader labelledBy='in-context-title'>
          <PageHeaderTitle id='in-context-title' headingLevel={2}>
            {title}
          </PageHeaderTitle>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageHeaderRule />
        </PageHeader>
      </Example>
    </ExampleSection>
  )
}

export function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          Three colourways for the title box. <code>blue</code> and <code>red</code> hold their
          colour in both themes, as a brand band does; <code>navy</code> lifts one step in dark mode
          so it stays distinct from a dark header above it. The rule and the meta row’s hairline are
          drawn in the ink, except in <code>red</code>, where the rule takes the box’s red.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<PageHeader color="navy" labelledBy="page-title">…</PageHeader>`}
      >
        <div className='flex flex-col gap-4'>
          {colors.map((color) => (
            <PageHeader key={color} color={color} labelledBy={`colours-${color}-title`}>
              <PageHeaderTitle id={`colours-${color}-title`} headingLevel={2}>
                {title}
              </PageHeaderTitle>
              <PageHeaderDescription>
                {colorDocs.find(([c]) => c === color)?.[1]}
              </PageHeaderDescription>
              <PageHeaderRule />
            </PageHeader>
          ))}
        </div>
      </Example>
    </ExampleSection>
  )
}

export function LongTitleSection() {
  return (
    <ExampleSection
      title='Long titles'
      description={
        <>
          The heading is inline, so the band is drawn per line and each box fits its own words. A
          title that wraps becomes a stack of boxes that touch, at a measure of 40rem; the text
          stays on the column and the boxes hang into the margin.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<PageHeader labelledBy="page-title">
  <PageHeaderTitle id="page-title">Apply for a recreational fishing fee exemption</PageHeaderTitle>
  <PageHeaderDescription>…</PageHeaderDescription>
</PageHeader>`}
      >
        <PageHeader labelledBy='long-title'>
          <PageHeaderTitle id='long-title' headingLevel={2}>
            {longTitle}
          </PageHeaderTitle>
          <PageHeaderDescription>{description}</PageHeaderDescription>
        </PageHeader>
      </Example>
    </ExampleSection>
  )
}

export function RuleSection() {
  return (
    <ExampleSection
      title='With a rule'
      description={
        <>
          <code>PageHeaderRule</code> closes the header with a short 48×4px rule in the ink — the
          brand’s flat mark, square-cornered. It is decorative and hidden from assistive technology.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<PageHeader labelledBy="page-title">
  <PageHeaderTitle id="page-title">Discovery Pass</PageHeaderTitle>
  <PageHeaderDescription>…</PageHeaderDescription>
  <PageHeaderRule />
</PageHeader>`}
      >
        <PageHeader labelledBy='rule-title'>
          <PageHeaderTitle id='rule-title' headingLevel={2}>
            {title}
          </PageHeaderTitle>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageHeaderRule />
        </PageHeader>
      </Example>
    </ExampleSection>
  )
}

export function MetaSection() {
  return (
    <ExampleSection
      title='With a meta row'
      description={
        <>
          <code>PageHeaderMeta</code> is a row of facts about the page under a hairline in the ink:
          when it was last updated, which site it belongs to. Its children are your own{' '}
          <code>span</code>s, spread to the two ends of the row and stacked on a phone. Use it
          instead of the rule, not as well.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<PageHeader labelledBy="page-title">
  <PageHeaderTitle id="page-title">Discovery Pass</PageHeaderTitle>
  <PageHeaderDescription>…</PageHeaderDescription>
  <PageHeaderMeta>
    <span>Last updated 3 October 2026</span>
    <span>transportnsw.info</span>
  </PageHeaderMeta>
</PageHeader>`}
      >
        <PageHeader labelledBy='meta-title'>
          <PageHeaderTitle id='meta-title' headingLevel={2}>
            {title}
          </PageHeaderTitle>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageHeaderMeta>
            <span>{updated}</span>
            <span>{site}</span>
          </PageHeaderMeta>
        </PageHeader>
      </Example>
    </ExampleSection>
  )
}

export function ContainedSection() {
  return (
    <ExampleSection
      title='Contained'
      description={
        <>
          <code>container=&quot;fluid&quot;</code> (the default) runs the full width with the
          chrome’s 16 → 24 → 48px inset, so the title lines up with a fluid Header and Breadcrumb
          above it. <code>contained</code> centres a 1200px column instead, for a site whose header
          and breadcrumb are contained too.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<PageHeader container="contained" labelledBy="page-title">…</PageHeader>`}
      >
        <PageHeader container='contained' labelledBy='contained-title'>
          <PageHeaderTitle id='contained-title' headingLevel={2}>
            {title}
          </PageHeaderTitle>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageHeaderRule />
        </PageHeader>
      </Example>
    </ExampleSection>
  )
}

export function PhoneSection() {
  return (
    <ExampleSection
      title='On a phone'
      description={
        <>
          Below <code>sm</code> the title drops to 32px with a tighter box, the inset becomes 16px
          and the meta row stacks. This is the Default story at 375px, in its own viewport.
        </>
      }
    >
      <div className='flex flex-wrap gap-6'>
        <PhoneFrame
          storyId='components-pageheader--default'
          title='Page header on a phone'
          height={400}
        />
      </div>
    </ExampleSection>
  )
}

export function NamingSection() {
  return (
    <ExampleSection
      title='Naming the header'
      description={
        <>
          Like Section and Hero, a page header only becomes a <code>region</code> landmark once it
          has a name. Point <code>labelledBy</code> at the <code>id</code> of its{' '}
          <code>PageHeaderTitle</code>. The title is an <code>h1</code> by default, because the
          header opens the page; pass <code>headingLevel=&#123;2&#125;</code> for a header that
          opens a section of a page whose <code>h1</code> sits elsewhere.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<PageHeader labelledBy="page-title">
  <PageHeaderTitle id="page-title">Discovery Pass</PageHeaderTitle>
</PageHeader>`}
      >
        <PageHeader labelledBy='naming-title'>
          <PageHeaderTitle id='naming-title' headingLevel={2}>
            {title}
          </PageHeaderTitle>
          <PageHeaderDescription>
            This header is exposed as “Discovery Pass, region” in the landmark list.
          </PageHeaderDescription>
        </PageHeader>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function PageHeaderDocs() {
  return (
    <DocsPage
      title='PageHeader'
      npm={[
        'PageHeader',
        'PageHeaderTitle',
        'PageHeaderDescription',
        'PageHeaderRule',
        'PageHeaderMeta',
      ]}
      registry='page-header'
      summary={
        <>
          The opening of a content page: the <strong>title</strong> on its own flat colour band, one
          box per wrapped line, a standfirst, and optionally a short rule or a meta row. It sits
          under the site’s Header and Breadcrumb; for the opening band of a landing page, with
          actions and an illustration, use Hero.
        </>
      }
    >
      <DocsUsage
        use={[
          'The top of a content, service or information page, under the header and breadcrumb.',
          'A title and one or two sentences saying what the page is.',
          'A page that wants a mark of the brand colour without a band or an illustration.',
        ]}
        avoid={[
          'The opening band of a landing page, with actions or artwork — use Hero.',
          'A heading further down the page — use Section.',
          'The breadcrumb — keep the Breadcrumb component above the header; it is not a slot.',
        ]}
      />
      <InContextSection />
      <ColoursSection />
      <LongTitleSection />
      <RuleSection />
      <MetaSection />
      <ContainedSection />
      <PhoneSection />
      <NamingSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: PageHeaderDocs },
  },
  args: {
    color: 'blue',
    container: 'fluid',
    labelledBy: 'demo-page-header-title',
    children: (
      <>
        <PageHeaderTitle id='demo-page-header-title'>{title}</PageHeaderTitle>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageHeaderRule />
      </>
    ),
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: colors,
      description: 'Colourway of the title box. Sets the box and rule colours the slots read.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description: 'Full-bleed, or a centred 1200px column.',
      table: { category: 'Appearance' },
    },
    children: {
      control: false,
      description:
        'PageHeaderTitle, then PageHeaderDescription, then a PageHeaderRule or PageHeaderMeta.',
      table: { category: 'Content' },
    },
    labelledBy: {
      control: 'text',
      description: '`id` of the PageHeaderTitle. Required for the header to be a landmark.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
    innerClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('[data-slot="page-header"]')
    if (!header) {
      throw new Error('Could not find an element with [data-slot="page-header"].')
    }
    if (header.tagName !== 'SECTION') {
      throw new Error(`Expected a <section> element, received <${header.tagName.toLowerCase()}>.`)
    }
    const labelledBy = header.getAttribute('aria-labelledby')
    if (labelledBy !== 'demo-page-header-title') {
      throw new Error(
        `Expected aria-labelledby="demo-page-header-title", received "${labelledBy}".`,
      )
    }
    const heading = header.ownerDocument.getElementById('demo-page-header-title')
    if (!heading || heading.tagName !== 'H1') {
      throw new Error('aria-labelledby does not point at the h1 PageHeaderTitle.')
    }
  },
}

export const Playground: Story = {}
