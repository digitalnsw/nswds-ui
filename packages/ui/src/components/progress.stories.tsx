/**
 * Progress — a determinate progress bar.
 *
 *   Components/Progress                → this file: Docs, Default, Playground
 *   Components/Progress/Features       → progress.features.stories.tsx
 *   Components/Progress/Accessibility  → progress.accessibility.stories.tsx
 *   Components/Progress/Tests          → progress.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 *
 * A determinate progress bar on the Base UI progress primitive. The Root
 * (`data-slot="progress"`) carries `role="progressbar"` and the ARIA value
 * attributes; pass a numeric `value` (0–100). Progress renders its own Track
 * and Indicator, and optionally a ProgressLabel / ProgressValue passed as
 * children.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { expect } from 'storybook/test'

import { Progress, ProgressLabel, ProgressValue } from './progress.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

/**
 * A full-width specimen with its label above it. A bar fills its column, so
 * Button's centred cell would collapse it.
 */
function Specimen({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className='w-full max-w-xl space-y-2'>
      <p className='text-base font-medium tracking-wide text-muted-foreground'>{label}</p>
      {children}
    </div>
  )
}

const stateDocs = [
  [0, 'Not started — the empty track shows there is work to come.'],
  [40, 'Under way — the indicator fills to the share that is done.'],
  [100, 'Complete — replace the bar with a confirmation once the reader has seen it fill.'],
] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function StatesSection() {
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
      <Example
        layout='stack'
        className='gap-8'
        code={`<Progress value={40} aria-label="Upload progress" />`}
      >
        {stateDocs.map(([value, description]) => (
          <Specimen key={value} label={`value={${value}} — ${description}`}>
            <Progress value={value} aria-label='Upload progress' />
          </Specimen>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function WithALabelSection() {
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

export function RangeAndFormatSection() {
  return (
    <ExampleSection
      title='Range and format'
      description={
        <>
          When the work is counted in things rather than percent, set <code>max</code> and show the
          count: <code>ProgressValue</code> takes a function of the formatted and raw value. Pass{' '}
          <code>getAriaValueText</code> with the same words so a screen reader hears “3 of 5 files”,
          not “60%”.
        </>
      }
    >
      <Example
        code={`<Progress value={3} max={5} getAriaValueText={(_, value) => \`\${value} of 5 files\`}>
  <ProgressLabel>Uploading supporting documents</ProgressLabel>
  <ProgressValue>{(_, value) => \`\${value} of 5 files\`}</ProgressValue>
</Progress>`}
      >
        <div className='w-full max-w-md'>
          <Progress value={3} max={5} getAriaValueText={(_, value) => `${value} of 5 files`}>
            <ProgressLabel>Uploading supporting documents</ProgressLabel>
            <ProgressValue>{(_, value) => `${value} of 5 files`}</ProgressValue>
          </Progress>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='An upload in a form, with the file name in the label so the reader knows what is moving.'
    >
      <Example
        layout='fill'
        code={`<Progress value={35}>
  <ProgressLabel>Uploading passport.pdf</ProgressLabel>
  <ProgressValue />
</Progress>`}
      >
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
      <RangeAndFormatSection />
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
  excludeStories: /Section$/,
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
