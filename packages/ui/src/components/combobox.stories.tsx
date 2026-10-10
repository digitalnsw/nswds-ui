/**
 * Combobox — the docs page, Default, Playground and one story per docs section.
 *
 *   Components/Combobox        → this file
 *   Components/Combobox/Tests  → combobox.tests.stories.tsx
 *
 * Built on the Base UI Combobox primitive: the input renders in the canvas, but
 * the filtered list is PORTALED to document.body, so it must be queried there.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from './combobox.js'
import { Field, FieldDescription, FieldLabel } from './field.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

const towns = [
  'Albury',
  'Armidale',
  'Bathurst',
  'Broken Hill',
  'Dubbo',
  'Goulburn',
  'Lismore',
  'Newcastle',
  'Orange',
  'Tamworth',
  'Wagga Wagga',
  'Wollongong',
]

const languages = [
  'Arabic',
  'Cantonese',
  'English',
  'Greek',
  'Hindi',
  'Italian',
  'Korean',
  'Mandarin',
  'Nepali',
  'Punjabi',
  'Spanish',
  'Vietnamese',
]

const regions = [
  { value: 'Greater Sydney', items: ['Blacktown', 'Liverpool', 'Parramatta', 'Penrith'] },
  { value: 'Hunter', items: ['Cessnock', 'Maitland', 'Newcastle'] },
  { value: 'Riverina', items: ['Griffith', 'Leeton', 'Wagga Wagga'] },
]

/** The list every single-select example shares: an empty message, then one item per string. */
function StringList({ empty }: { empty: string }) {
  return (
    <ComboboxContent>
      <ComboboxEmpty>{empty}</ComboboxEmpty>
      <ComboboxList>
        {(item: string) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function WithFieldSection() {
  return (
    <ExampleSection
      title='With Field'
      description={
        <>
          Inside a <code>Field</code>, the <code>FieldLabel</code> names the input and the hint is
          announced with it — no <code>aria-label</code> needed. Say in the hint what people can
          type.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<Field>
  <FieldLabel>Nearest town or city</FieldLabel>
  <Combobox items={towns}>
    <ComboboxInput />
    <ComboboxContent>
      <ComboboxEmpty>No towns found.</ComboboxEmpty>
      <ComboboxList>
        {(town) => <ComboboxItem key={town} value={town}>{town}</ComboboxItem>}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <FieldDescription>Start typing to filter the list.</FieldDescription>
</Field>`}
      >
        <Field className='w-72'>
          <FieldLabel>Nearest town or city</FieldLabel>
          <Combobox items={towns}>
            <ComboboxInput />
            <StringList empty='No towns found.' />
          </Combobox>
          <FieldDescription>Start typing to filter the list.</FieldDescription>
        </Field>
      </Example>
    </ExampleSection>
  )
}

function GroupedOptionsSection() {
  return (
    <ExampleSection
      title='Grouped options'
      description={
        <>
          Pass groups as <code>items</code>, then render each as a <code>ComboboxGroup</code> with a{' '}
          <code>ComboboxLabel</code> and a <code>ComboboxCollection</code> of its items. Empty
          groups drop out as the list filters.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<ComboboxList>
  {(group) => (
    <ComboboxGroup key={group.value} items={group.items}>
      <ComboboxLabel>{group.value}</ComboboxLabel>
      <ComboboxCollection>
        {(suburb) => <ComboboxItem key={suburb} value={suburb}>{suburb}</ComboboxItem>}
      </ComboboxCollection>
    </ComboboxGroup>
  )}
</ComboboxList>`}
      >
        <div className='w-72'>
          <Combobox items={regions}>
            <ComboboxInput aria-label='Local council area' />
            <ComboboxContent>
              <ComboboxEmpty>No council areas found.</ComboboxEmpty>
              <ComboboxList>
                {(group: (typeof regions)[number]) => (
                  <ComboboxGroup key={group.value} items={group.items}>
                    <ComboboxLabel>{group.value}</ComboboxLabel>
                    <ComboboxCollection>
                      {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </Example>
    </ExampleSection>
  )
}

function MultipleSelectionExample() {
  const anchor = useComboboxAnchor()
  return (
    <div className='w-72'>
      <Combobox multiple items={languages} defaultValue={['English', 'Vietnamese']}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(value: string[]) =>
              value.map((item) => (
                <ComboboxChip key={item} removeLabel={`Remove ${item}`}>
                  {item}
                </ComboboxChip>
              ))
            }
          </ComboboxValue>
          <ComboboxChipsInput aria-label='Languages spoken at home' />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No languages found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

function MultipleSelectionSection() {
  return (
    <ExampleSection
      title='Multiple selection'
      description={
        <>
          Add <code>multiple</code> and swap the input for <code>ComboboxChips</code>: each choice
          becomes a chip with its own remove button, and the list anchors to the whole chip row.
          Name each remove button after its chip with <code>removeLabel</code> — a list of buttons
          all called &ldquo;Remove&rdquo; is no use to a screen reader.
        </>
      }
    >
      <Example
        layout='stack'
        code={`const anchor = useComboboxAnchor()

<Combobox multiple items={languages}>
  <ComboboxChips ref={anchor}>
    <ComboboxValue>
      {(values) => values.map((language) => (
        <ComboboxChip key={language} removeLabel={\`Remove \${language}\`}>{language}</ComboboxChip>
      ))}
    </ComboboxValue>
    <ComboboxChipsInput aria-label="Languages spoken at home" />
  </ComboboxChips>
  <ComboboxContent anchor={anchor}>…</ComboboxContent>
</Combobox>`}
      >
        <MultipleSelectionExample />
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ComboboxDocs() {
  return (
    <DocsPage
      title='Combobox'
      npm={[
        'Combobox',
        'ComboboxInput',
        'ComboboxContent',
        'ComboboxList',
        'ComboboxItem',
        'ComboboxEmpty',
        'ComboboxGroup',
        'ComboboxLabel',
        'ComboboxCollection',
        'ComboboxChips',
        'ComboboxChip',
        'ComboboxChipsInput',
        'ComboboxValue',
        'useComboboxAnchor',
      ]}
      registry='combobox'
      summary={
        <>
          An input that filters a list as people type, for choosing from more options than they
          could comfortably scroll. The list opens in a popup portalled to the end of the page. Base
          UI owns the filtering, keyboard movement, ARIA and positioning; add <code>multiple</code>{' '}
          to collect several answers as chips.
        </>
      }
    >
      <DocsUsage
        use={[
          'Choosing from a long list people can name, such as a town, a school or a language.',
          'Several answers from a long list — with multiple and chips.',
          'A list long enough that scrolling a Select would be slow.',
        ]}
        avoid={[
          'The list is short enough to scan — use Select or RadioGroup.',
          'Any text is a valid answer, not just items in a list — use Input.',
          'Searching a whole site or service — use a search field, not a picker.',
        ]}
      />
      <WithFieldSection />
      <GroupedOptionsSection />
      <MultipleSelectionSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

// Annotated rather than `satisfies`: with `items` in args the inferred type
// reaches into Base UI internals TypeScript cannot name (TS2742).
const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ComboboxDocs },
    a11y: {
      // Base UI's Combobox renders an intentionally hidden form-value <input>
      // (id="…-hidden-input", tabindex="-1", aria-hidden, visually clipped) to
      // carry the value for native form submission. axe's `aria-hidden-focus`
      // flags it because a tabindex="-1" input is still programmatically
      // focusable — but it is not a real barrier: the element is hidden from
      // assistive tech by design and the visible combobox input carries all the
      // accessible semantics. Scope off only this rule; every other WCAG AA
      // rule (and the global tag pinning) stays enforced.
      options: {
        rules: { 'aria-hidden-focus': { enabled: false } },
      },
    },
  },
  args: {
    items: towns,
    disabled: false,
  },
  argTypes: {
    items: {
      control: false,
      description: 'The options to filter. Strings, objects or groups.',
      table: { category: 'Content' },
    },
    multiple: {
      control: false,
      description: 'Allow several values; pair with ComboboxChips.',
      table: { category: 'Behavior' },
    },
    defaultValue: {
      control: false,
      description: 'Initially selected value (or values, with multiple) when uncontrolled.',
      table: { category: 'Behavior' },
    },
    value: {
      control: false,
      description: 'Controlled value. Pair with onValueChange.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction.',
      table: { category: 'Behavior' },
    },
    name: {
      control: 'text',
      description: 'Name submitted with the form.',
      table: { category: 'Behavior' },
    },
    onValueChange: {
      description: 'Called with the newly selected value.',
      table: { category: 'Events' },
    },
  },
  render: (args) => (
    <div className='w-72'>
      <Combobox {...args}>
        <ComboboxInput aria-label='Town or city' />
        <StringList empty='No towns found.' />
      </Combobox>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The input renders in the canvas (role combobox); assert it first — this is
    // the robust half of the check.
    const input = canvas.getByRole('combobox', { name: 'Town or city' })
    await expect(input).toBeEnabled()

    // Opening reveals the PORTALED list on document.body, not in canvasElement.
    await userEvent.click(input)
    const body = within(document.body)
    const option = await body.findByRole('option', { name: 'Dubbo' })
    await expect(option).toBeInTheDocument()
  },
}

export const Playground: Story = {}

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

export const GroupedOptions: Story = {
  name: 'Grouped options',
  render: () => <GroupedOptionsSection />,
}

export const MultipleSelection: Story = {
  name: 'Multiple selection',
  render: () => <MultipleSelectionSection />,
}
