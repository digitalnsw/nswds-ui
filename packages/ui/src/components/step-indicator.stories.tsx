/**
 * StepIndicator — Docs, Default, Playground and one story per docs section.
 *
 *   Components/StepIndicator        → this file
 *   Components/StepIndicator/Tests  → step-indicator.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { StepIndicator, StepNav, type Step, type StepStatus } from './step-indicator.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const journeySteps: Step[] = [
  {
    title: 'Your details',
    description: 'Name and contact information',
    href: '#your-details',
    status: 'completed',
  },
  { title: 'Eligibility', href: '#eligibility', status: 'saved' },
  {
    title: 'Documents',
    description: 'Upload supporting evidence',
    href: '#documents',
    status: 'in-progress',
  },
  { title: 'Review', href: '#review', status: 'not-started' },
  { title: 'Payment', href: '#payment', status: 'cannot-start' },
]

function getIndicator(canvasElement: HTMLElement): HTMLElement {
  const list = canvasElement.querySelector<HTMLElement>('[data-slot="step-indicator"]')
  if (!list) {
    throw new Error('Expected an <ol data-slot="step-indicator"> to have rendered.')
  }
  return list
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

const statuses: ReadonlyArray<readonly [StepStatus, string]> = [
  ['completed', 'completed'],
  ['saved', 'saved'],
  ['in-progress', 'in-progress'],
  ['error', 'error'],
  ['not-started', 'not-started'],
  ['default', 'status omitted'],
  ['cannot-start', 'cannot-start'],
]

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          Each step carries its own <code>status</code>. Completed, error and cannot-start are solid
          discs; saved and in-progress are outlined and fill on hover; a step not yet begun is an
          empty ring. A step with no status renders as not started. A cannot-start step is disabled
          — out of the tab order and click-inert. Each status is also announced after the title, in
          words: localise or suppress them with <code>statusLabels</code>.
        </>
      }
    >
      <Example
        code={`<StepIndicator steps={[{ title: 'Your details', href: '/apply/details', status: 'completed' }]} />`}
      >
        {statuses.map(([status, label]) => (
          <ExampleCell key={status} label={label}>
            <StepIndicator
              steps={[
                status === 'default'
                  ? { title: 'Your details', href: `#state-${status}` }
                  : { title: 'Your details', href: `#state-${status}`, status },
              ]}
            />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function CurrentStepSection() {
  return (
    <ExampleSection
      title='Current step'
      description={
        <>
          The step whose <code>href</code> equals <code>currentHref</code> is announced with{' '}
          <code>aria-current=&quot;step&quot;</code> whatever its status. An in-progress current
          step is emphasised with a double ring; a not-started one gets a filled dot in the primary
          ink. Completed, saved, error and cannot-start steps keep their own treatment.
        </>
      }
    >
      <Example code={`<StepIndicator steps={steps} currentHref={pathname} />`}>
        <ExampleCell label='current step in progress'>
          <div className='w-64'>
            <StepIndicator steps={journeySteps} currentHref='#documents' />
          </div>
        </ExampleCell>
        <ExampleCell label='current step not started'>
          <div className='w-64'>
            <StepIndicator steps={journeySteps} currentHref='#review' />
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

const navSections = [
  {
    title: 'Before you start',
    steps: [
      { title: 'Your details', href: '#nav-your-details', status: 'completed' as const },
      { title: 'Eligibility', href: '#nav-eligibility', status: 'in-progress' as const },
    ],
  },
  {
    title: 'Your application',
    steps: [
      { title: 'Documents', href: '#nav-documents', status: 'not-started' as const },
      { title: 'Payment', href: '#nav-payment', status: 'cannot-start' as const },
    ],
  },
]

function GroupedWithStepNavSection() {
  return (
    <ExampleSection
      title='Grouped with StepNav'
      description={
        <>
          <code>StepNav</code> splits a long journey into titled phases: one heading and one
          indicator per section, inside a navigation landmark named &quot;Progress&quot;. Set{' '}
          <code>headingLevel</code> so the section headings slot into the page outline.
        </>
      }
    >
      <Example
        code={`<StepNav
  headingLevel={3}
  currentHref={pathname}
  sections={[
    { title: 'Before you start', steps: [...] },
    { title: 'Your application', steps: [...] },
  ]}
/>`}
      >
        <div className='w-64'>
          <StepNav sections={navSections} headingLevel={3} currentHref='#nav-eligibility' />
        </div>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Beside a long application form, so a reader can see how far they have come and return to a finished step.'
    >
      <Example layout='fill'>
        <div className='grid gap-10 sm:grid-cols-[14rem_1fr]'>
          <StepIndicator steps={journeySteps} currentHref='#documents' />
          <div className='max-w-prose space-y-4'>
            <p className='text-base font-semibold text-muted-foreground'>
              Apply for a Working with Children Check
            </p>
            <p className='text-3xl/tight font-bold'>Documents</p>
            <p>
              Upload a copy of your proof of identity. You can save your application and come back
              to it later.
            </p>
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function StepIndicatorDocs() {
  return (
    <DocsPage
      title='StepIndicator'
      npm={['StepIndicator', 'StepNav']}
      registry='step-indicator'
      summary={
        <>
          A vertical list of the steps in a multi-page journey, such as an application form: one
          link per step, with a status marker, a connector line and an emphasised treatment for the
          step being viewed. Status is data on each step, so any state source can drive it.
        </>
      }
    >
      <DocsUsage
        use={[
          'Showing progress through a multi-page application or form.',
          'Letting a reader return to a step they have finished.',
          'Making clear which steps cannot be started yet, and why.',
        ]}
        avoid={[
          'Moving between the peer pages of a section — use TabNav.',
          'Navigating a section’s pages as a tree — use SideNav.',
          'Paging through a long list of results — use Pagination.',
        ]}
      />
      <StatesSection />
      <CurrentStepSection />
      <GroupedWithStepNavSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: StepIndicatorDocs },
  },
  args: {
    steps: journeySteps,
    currentHref: '#documents',
  },
  argTypes: {
    steps: {
      control: 'object',
      description:
        'Steps in journey order. Each step: title, optional description, unique href, optional status (default | not-started | in-progress | completed | saved | error | cannot-start).',
      table: { category: 'Content' },
    },
    currentHref: {
      control: 'text',
      description:
        'href of the page being viewed. The matching step gets aria-current="step" and, for default / not-started / in-progress statuses, the emphasised current treatment.',
      table: { category: 'Behavior' },
    },
    onNavigate: {
      control: false,
      description:
        'Click handler applied to every enabled step link (cannot-start steps are click-inert).',
      table: { category: 'Events' },
    },
    statusLabels: {
      control: 'object',
      description:
        'Visually-hidden status announcements merged over the English defaults — supply strings to localise, or undefined to suppress a status.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof StepIndicator>

export default meta
type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    currentHref: '#documents',
    onNavigate: (event) => {
      // Storybook-only: prove the handler fired without navigating the
      // test iframe. Real apps receive the untouched click event.
      event.preventDefault()
      event.currentTarget.setAttribute('data-story-clicked', 'true')
    },
  },
  play: async ({ canvasElement }) => {
    const list = getIndicator(canvasElement)
    if (list.tagName !== 'OL') {
      throw new Error(
        `Expected the step list to be an <ol> (steps are a sequence), got <${list.tagName.toLowerCase()}>.`,
      )
    }

    const links = list.querySelectorAll<HTMLAnchorElement>('[data-slot="step-link"]')
    if (links.length !== journeySteps.length) {
      throw new Error(`Expected ${journeySteps.length} step links, found ${links.length}.`)
    }

    const first = links[0]!
    first.click()
    if (first.getAttribute('data-story-clicked') !== 'true') {
      throw new Error('Expected clicking an enabled step link to fire onNavigate.')
    }

    first.focus()
    if (document.activeElement !== first) {
      throw new Error('Expected an enabled step link to be keyboard-focusable.')
    }
  },
}

export const Playground: Story = {}

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const CurrentStep: Story = {
  name: 'Current step',
  render: () => <CurrentStepSection />,
}

export const GroupedWithStepNav: Story = {
  name: 'Grouped with StepNav',
  render: () => <GroupedWithStepNavSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
