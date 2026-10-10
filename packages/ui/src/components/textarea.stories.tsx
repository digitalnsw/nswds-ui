/**
 * Textarea — the docs page, Default and Playground.
 *
 *   Components/Textarea                → this file
 *   Components/Textarea/Features       → textarea.features.stories.tsx
 *   Components/Textarea/Accessibility  → textarea.accessibility.stories.tsx
 *   Components/Textarea/Tests          → textarea.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 *
 * The multi-line sibling of Input. It renders Base UI's Input primitive
 * (which is `Field.Control`) as a `<textarea>`, so it inherits the same Field
 * wiring — label association, `aria-describedby`, `aria-invalid` — and carries
 * the same `--input-*` token styling. Only the sizing differs: the box grows
 * with its content from a three-line floor instead of Input's fixed height.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { Button } from './button.js'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from './field.js'
import { Input } from './input.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'
import { Textarea } from './textarea.js'

const filled = 'The footpath outside 12 King Street has a large crack that people keep tripping on.'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

// The forced focus ring uses the same token the component paints on
// :focus-visible, so the specimen shows the real ring without stealing focus.
const forcedFocus = 'outline outline-2 outline-offset-2 outline-(--input-ring)'

export function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          Every state is Input&apos;s: the sunken surface on hover, a 2px ring on focus, and a 2px
          danger border when <code>aria-invalid</code> is set — or when <code>Field invalid</code>{' '}
          sets it for you.
        </>
      }
    >
      <Example layout='grid' code={`<Textarea aria-invalid />`}>
        <ExampleCell label='empty'>
          <div className='w-72'>
            <Textarea aria-label='Description, empty' />
          </div>
        </ExampleCell>
        <ExampleCell label='filled'>
          <div className='w-72'>
            <Textarea aria-label='Description, filled' defaultValue={filled} />
          </div>
        </ExampleCell>
        <ExampleCell label='focus'>
          <div className='w-72'>
            <Textarea
              aria-label='Description, focused'
              defaultValue={filled}
              className={forcedFocus}
            />
          </div>
        </ExampleCell>
        <ExampleCell label='invalid'>
          <div className='w-72'>
            <Textarea aria-label='Description, invalid' aria-invalid />
          </div>
        </ExampleCell>
        <ExampleCell label='readOnly'>
          <div className='w-72'>
            <Textarea aria-label='Description, read only' readOnly defaultValue={filled} />
          </div>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <div className='w-72'>
            <Textarea aria-label='Description, disabled' disabled defaultValue={filled} />
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function GrowsWithContentSection() {
  return (
    <ExampleSection
      title='Grows with content'
      description={
        <>
          The box starts at three lines and grows as people type, so the whole answer stays in view
          and there is no resize handle to find. Set a <code>max-h-*</code> class if the layout
          needs a ceiling; it scrolls from there.
        </>
      }
    >
      <Example layout='grid' code={`<Textarea className="max-h-48" />`}>
        <ExampleCell label='three-line floor'>
          <div className='w-72'>
            <Textarea aria-label='Short answer' defaultValue='Pothole on King Street.' />
          </div>
        </ExampleCell>
        <ExampleCell label='grown to fit'>
          <div className='w-72'>
            <Textarea
              aria-label='Longer answer'
              defaultValue={`${filled} It has been there for about three weeks and is worst near the bus stop. Two people fell there last Tuesday morning.`}
            />
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function WithFieldSection() {
  return (
    <ExampleSection
      title='With Field'
      description={
        <>
          Inside a <code>Field</code>, the label, hint and error are associated with the textarea
          and <code>aria-invalid</code> follows <code>Field invalid</code> — the same wiring Input
          gets. Use the hint to say what to leave out as well as what to include.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<Field invalid>
  <FieldLabel>Tell us what happened</FieldLabel>
  <Textarea />
  <FieldDescription>Do not include personal information.</FieldDescription>
  <FieldError>Enter a description of what happened.</FieldError>
</Field>`}
      >
        <div className='w-full max-w-md'>
          <Field invalid>
            <FieldLabel>Tell us what happened</FieldLabel>
            <Textarea />
            <FieldDescription>Do not include personal information.</FieldDescription>
            <FieldError>Enter a description of what happened.</FieldError>
          </Field>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A report-a-problem step: a short Input for the location and a Textarea for the details.'
    >
      <Example
        layout='fill'
        code={`<Field>
  <FieldLabel>Describe the problem</FieldLabel>
  <Textarea />
  <FieldDescription>
    Include how long it has been there and anything that would help us find it.
  </FieldDescription>
</Field>`}
      >
        <form className='max-w-md' onSubmit={(event) => event.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel>Street address of the problem</FieldLabel>
              <Input autoComplete='street-address' />
            </Field>
            <Field>
              <FieldLabel>Describe the problem</FieldLabel>
              <Textarea />
              <FieldDescription>
                Include how long it has been there and anything that would help us find it.
              </FieldDescription>
            </Field>
            <div>
              <Button type='submit'>Send report</Button>
            </div>
          </FieldGroup>
        </form>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function TextareaDocs() {
  return (
    <DocsPage
      title='Textarea'
      npm='Textarea'
      registry='textarea'
      summary={
        <>
          A multi-line text field for answers that run to a sentence or more. It matches Input pixel
          for pixel — padding, radius, type, colours and every state — and gets the same automatic{' '}
          <code>Field</code> wiring. It grows with its content from a three-line floor.
        </>
      }
    >
      <DocsUsage
        use={[
          'Describing a problem, an incident or a change of circumstances.',
          'Feedback, comments or any answer that may run past one line.',
          'Free-text detail that follows a structured question.',
        ]}
        avoid={[
          'The answer fits on one line — use Input.',
          'The answer comes from a known list — use RadioGroup, Select or Combobox.',
          'People need formatting such as bold or links — use a rich-text editor, not a plain field.',
        ]}
      />
      <StatesSection />
      <GrowsWithContentSection />
      <WithFieldSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: TextareaDocs },
  },
  args: {
    'aria-label': 'Message',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Example text shown while the field is empty. Never a substitute for a label.',
      table: { category: 'Content' },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial uncontrolled value.',
      table: { category: 'Content' },
    },
    value: {
      control: 'text',
      description: 'Controlled value. Pair with onChange.',
      table: { category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables typing and applies disabled styles.',
      table: { category: 'Behavior' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents editing while still allowing focus, selection and copy.',
      table: { category: 'Behavior' },
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required for native form submission.',
      table: { category: 'Behavior' },
    },
    maxLength: {
      control: 'number',
      description: 'Maximum number of characters the browser accepts.',
      table: { category: 'Behavior' },
    },
    onChange: {
      description: 'Change handler fired on every keystroke (logged in the Actions panel).',
      table: { category: 'Events' },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Applies the 2px danger border to indicate a validation failure.',
      table: { category: 'Accessibility' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name, when there is no associated visible label.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <div className='max-w-md'>
      <Textarea {...args} />
    </div>
  ),
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector<HTMLTextAreaElement>('[data-slot="textarea"]')
    if (!textarea) throw new Error('Could not find [data-slot="textarea"].')

    // The `render` prop must produce a real <textarea>, not Base UI's default
    // <input> — otherwise Enter would submit instead of inserting a newline.
    await expect(textarea.tagName).toBe('TEXTAREA')
    await expect(textarea).toHaveAccessibleName('Message')

    // Prove it is a real, interactive textarea by typing into it. Multi-line
    // input is the whole point, so type a newline rather than a flat string.
    await userEvent.type(textarea, 'Hello NSW{enter}Second line')
    await expect(textarea).toHaveValue('Hello NSW\nSecond line')
  },
}

export const Playground: Story = {}
