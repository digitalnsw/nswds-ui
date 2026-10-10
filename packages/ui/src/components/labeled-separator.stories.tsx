/**
 * LabeledSeparator — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/LabeledSeparator                → this file: Docs, Default, Playground
 *   Components/LabeledSeparator/Features       → labeled-separator.features.stories.tsx
 *   Components/LabeledSeparator/Accessibility  → labeled-separator.accessibility.stories.tsx
 *   Components/LabeledSeparator/Tests          → labeled-separator.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button.js'
import { Input } from './input.js'
import { Label } from './label.js'
import { LabeledSeparator } from './labeled-separator.js'
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

export function LabelsSection() {
  return (
    <ExampleSection
      title='Labels'
      description={
        <>
          The label defaults to “or”. Pass <code>children</code> for anything else — keep it to a
          word or two, in lower case, so it reads as part of the sentence either side.
        </>
      }
    >
      <Example layout='stack' code={`<LabeledSeparator>or continue with</LabeledSeparator>`}>
        <ExampleCell label='default'>
          <LabeledSeparator className='w-80' />
        </ExampleCell>
        <ExampleCell label='children="or continue with"'>
          <LabeledSeparator className='w-80'>or continue with</LabeledSeparator>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

const widths = [
  ['w-48', '192px'],
  ['w-80', '320px'],
  ['w-[28rem]', '448px'],
] as const

export function WidthSection() {
  return (
    <ExampleSection
      title='Width'
      description={
        <>
          The label keeps its natural width and the two rules share whatever is left, so the
          separator fills its container. Size it with the container — usually the column of a form —
          rather than on the separator itself.
        </>
      }
    >
      <Example layout='stack' code={`<div className="max-w-sm">\n  <LabeledSeparator />\n</div>`}>
        {widths.map(([className, pixels]) => (
          <ExampleCell key={className} label={pixels}>
            <LabeledSeparator className={className} />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='The “or” rule between two ways to sign in. The label carries the meaning; the two rules either side are decorative.'
    >
      <Example
        layout='fill'
        code={`<Button block>Continue with MyServiceNSW Account</Button>
<LabeledSeparator />
<Field>…email address…</Field>`}
      >
        <div className='max-w-sm space-y-6'>
          <Button block>Continue with MyServiceNSW Account</Button>
          <LabeledSeparator />
          <div className='space-y-2'>
            <Label htmlFor='labeled-separator-email'>Email address</Label>
            <Input id='labeled-separator-email' type='email' autoComplete='email' />
          </div>
          <Button block variant='outline'>
            Sign in with email
          </Button>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function LabeledSeparatorDocs() {
  return (
    <DocsPage
      title='LabeledSeparator'
      npm='LabeledSeparator'
      registry='labeled-separator'
      summary={
        <>
          A horizontal rule broken by a short centred label — the “or” between two ways of doing the
          same thing. The flanking rules are decorative; the label is what assistive technology
          reads.
        </>
      }
    >
      <DocsUsage
        use={[
          'Offering two alternative routes through a form, such as two ways to sign in.',
          'Splitting a choice into “recommended” and “other” options under one heading.',
          'Any divider that needs a word to say what the split means.',
        ]}
        avoid={[
          'A plain divider with no label — use Separator.',
          'Introducing a section of content — use a heading.',
          'Grouping form fields under a caption — use FieldSet with FieldLegend.',
        ]}
      />
      <LabelsSection />
      <WidthSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/LabeledSeparator',
  component: LabeledSeparator,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: LabeledSeparatorDocs },
  },
  args: {
    children: 'or',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The label between the two rules. Defaults to “or”.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof LabeledSeparator>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The wrapper mounts and the default "or" label renders.
    const root = canvasElement.querySelector('[data-slot="labeled-separator"]')
    if (!root) {
      throw new Error('Could not find [data-slot="labeled-separator"].')
    }
    const label = canvasElement.querySelector('[data-slot="labeled-separator-content"]')
    if (label?.textContent?.trim() !== 'or') {
      throw new Error(`Expected default label "or", received "${label?.textContent?.trim()}".`)
    }

    // Two flanking rules, both decorative (hidden from assistive tech).
    const rules = canvasElement.querySelectorAll('[data-slot="separator"]')
    if (rules.length !== 2) {
      throw new Error(`Expected 2 decorative rules, found ${rules.length}.`)
    }
    rules.forEach((rule) => {
      if (rule.getAttribute('role') !== 'none') {
        throw new Error(
          `Expected flanking rule to be decorative (role="none"), got role="${rule.getAttribute('role')}".`,
        )
      }
    })
  },
}

export const Playground: Story = {}
