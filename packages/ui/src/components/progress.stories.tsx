/**
 * Progress — follows docs/reference-storybook-standard.md.
 *
 *   Components/Progress        → this file: Docs, Default, Playground and one
 *                                story per docs section
 *   Components/Progress/Tests  → progress.tests.stories.tsx
 *
 * A determinate progress bar on the Base UI progress primitive. The Root
 * (`data-slot="progress"`) carries `role="progressbar"` and the ARIA value
 * attributes; pass a numeric `value` (0–100). Progress renders its own Track
 * and Indicator, and optionally a ProgressLabel / ProgressValue passed as
 * children.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Progress, ProgressLabel, ProgressValue } from './progress.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          <code>value</code> runs from 0 to 100 and the indicator fills to match. Update it as the
          work advances.
        </>
      }
    >
      <Example layout='stack' code={`<Progress value={40} aria-label="Upload progress" />`}>
        {[0, 40, 100].map((value) => (
          <ExampleCell key={value} label={`value={${value}}`}>
            <Progress value={value} aria-label='Upload progress' className='w-80 max-w-full' />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function WithALabelSection() {
  return (
    <ExampleSection
      title='With a label'
      description={
        <>
          A progress bar needs an accessible name. Pass <code>ProgressLabel</code> as a child to
          name it with visible text, and <code>ProgressValue</code> to show the percentage beside
          it. Without a visible label, give it an <code>aria-label</code>.
        </>
      }
    >
      <Example
        code={`<Progress value={72}>
  <ProgressLabel>Uploading your documents</ProgressLabel>
  <ProgressValue />
</Progress>`}
      >
        <div className='w-full max-w-md'>
          <Progress value={72}>
            <ProgressLabel>Uploading your documents</ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='An upload in a form, with the file name in the label so the reader knows what is moving.'
    >
      <Example layout='fill'>
        <div className='max-w-md space-y-4'>
          <p className='text-xl font-semibold'>Upload proof of identity</p>
          <p className='text-muted-foreground'>PDF, JPG or PNG, up to 10MB.</p>
          <Progress value={35}>
            <ProgressLabel>Uploading passport.pdf</ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ProgressDocs() {
  return (
    <DocsPage
      title='Progress'
      npm={['Progress', 'ProgressLabel', 'ProgressValue', 'ProgressTrack', 'ProgressIndicator']}
      registry='progress'
      summary={
        <>
          A determinate progress bar for work whose size is known — an upload, a download, a batch.
          Built on the Base UI progress primitive, which supplies the role and the ARIA values.
        </>
      }
    >
      <DocsUsage
        use={[
          'An upload or download where you know how much is done.',
          'A long task the system can measure, such as processing a batch.',
          'Anything that takes more than a few seconds and can report a percentage.',
        ]}
        avoid={[
          'The wait has no measurable length — use Spinner.',
          'Showing which step of a form the person is on — use StepIndicator.',
          'Showing a static quantity, like a budget used — use a Badge or plain text.',
        ]}
      />
      <StatesSection />
      <WithALabelSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ProgressDocs },
  },
  args: {
    value: 60,
    // A progressbar needs an accessible name; a consumer supplies it via
    // aria-label (or a ProgressLabel, as the With a label story shows).
    'aria-label': 'Upload progress',
    className: 'max-w-md',
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'How much is done, from 0 to 100.',
      table: { category: 'Content' },
    },
    children: {
      control: false,
      description: 'An optional ProgressLabel and ProgressValue, shown above the track.',
      table: { category: 'Content' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name, when there is no ProgressLabel.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="progress"]')
    if (!root) {
      throw new Error('Could not find [data-slot="progress"].')
    }

    // Base UI owns the ARIA — assert it arrived rather than re-implementing it.
    await expect(root).toHaveAttribute('role', 'progressbar')
    await expect(root).toHaveAttribute('aria-valuenow', String(args.value))
  },
}

export const Playground: Story = {}

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const WithALabel: Story = { name: 'With a label', render: () => <WithALabelSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
