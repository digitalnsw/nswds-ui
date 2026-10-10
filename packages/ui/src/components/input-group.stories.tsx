/**
 * InputGroup — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/InputGroup        → this file: Docs, Default, Playground and
 *                                  one story per docs section
 *   Components/InputGroup/Tests  → input-group.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { IconClose } from '../icons/close.js'
import { IconContentCopy } from '../icons/content-copy.js'
import { IconMail } from '../icons/mail.js'
import { IconSearch } from '../icons/search.js'
import { Field, FieldDescription, FieldLabel } from './field.js'
import {
  InputGroup,
  InputGroupAction,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './input-group.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

/** Form controls read at a realistic width, not stretched across the frame. */
function Width({ children }: { children: React.ReactNode }) {
  return <div className='w-full max-w-md'>{children}</div>
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          The group takes its state from the control inside it. <code>aria-invalid</code> on the
          input draws the danger border round the whole group; <code>disabled</code> fades the
          group&apos;s border and the input, while affixes stay readable because they still carry
          information.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<InputGroup>
  <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
  <InputGroupInput aria-label="Annual income" aria-invalid />
</InputGroup>`}
      >
        {(
          [
            ['default', {}],
            ['invalid', { 'aria-invalid': true }],
            ['disabled', { disabled: true }],
          ] as const
        ).map(([label, props]) => (
          <ExampleCell key={label} label={label}>
            <div className='w-80'>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  aria-label={`Annual income (${label})`}
                  inputMode='decimal'
                  defaultValue='52,000'
                  {...props}
                />
              </InputGroup>
            </div>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function WithIconsSection() {
  return (
    <ExampleSection
      title='With icons'
      description='An icon in a leading addon says what the field is for at a glance. It is decorative: the label still names the field.'
    >
      <Example
        layout='stack'
        code={`<InputGroup>
  <InputGroupAddon><IconSearch /></InputGroupAddon>
  <InputGroupInput aria-label="Search NSW Government" placeholder="Search NSW Government" />
</InputGroup>`}
      >
        <Width>
          <InputGroup>
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            <InputGroupInput
              aria-label='Search NSW Government'
              placeholder='Search NSW Government'
            />
          </InputGroup>
        </Width>
        <Width>
          <InputGroup>
            <InputGroupAddon>
              <IconMail />
            </InputGroupAddon>
            <InputGroupInput type='email' aria-label='Email address' autoComplete='email' />
          </InputGroup>
        </Width>
      </Example>
    </ExampleSection>
  )
}

function AddonsSection() {
  return (
    <ExampleSection
      title='Addons'
      description={
        <>
          <code>InputGroupAddon</code> places its content with <code>align</code>:{' '}
          <code>inline-start</code> (the default) and <code>inline-end</code> sit beside the input;{' '}
          <code>block-start</code> and <code>block-end</code> add a row above or below it, usually
          with a textarea. Wrap words in <code>InputGroupText</code>.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<InputGroupAddon align="inline-end">
  <InputGroupText>km</InputGroupText>
</InputGroupAddon>`}
      >
        <ExampleCell label='inline-start'>
          <div className='w-80'>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>AUD</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput aria-label='Rebate amount' inputMode='decimal' />
            </InputGroup>
          </div>
        </ExampleCell>
        <ExampleCell label='inline-end'>
          <div className='w-80'>
            <InputGroup>
              <InputGroupInput aria-label='Distance travelled' inputMode='numeric' />
              <InputGroupAddon align='inline-end'>
                <InputGroupText>km</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </ExampleCell>
        <ExampleCell label='both'>
          <div className='w-80'>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput aria-label='Website address' />
              <InputGroupAddon align='inline-end'>
                <InputGroupText>.nsw.gov.au</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </ExampleCell>
      </Example>
      <Example
        code={`<InputGroup>
  <InputGroupTextarea aria-label="Your feedback" rows={3} />
  <InputGroupAddon align="block-end">
    <InputGroupText>Up to 500 characters</InputGroupText>
  </InputGroupAddon>
</InputGroup>`}
      >
        <ExampleCell label='block-end'>
          <div className='w-80'>
            <InputGroup>
              <InputGroupTextarea aria-label='Your feedback' rows={3} />
              <InputGroupAddon align='block-end'>
                <InputGroupText>Up to 500 characters</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function InlineButtonsSection() {
  return (
    <ExampleSection
      title='Inline buttons'
      description={
        <>
          <code>InputGroupButton</code> is a small secondary action inside an addon — copy, clear,
          show. It defaults to a <code>soft</code> chip so it reads as pressable without hovering.
          Sizes are <code>xs</code> (default) and <code>sm</code> for a label, <code>icon-xs</code>{' '}
          and <code>icon-sm</code> for an icon with an <code>aria-label</code>.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<InputGroupAddon align="inline-end">
  <InputGroupButton size="icon-xs" aria-label="Clear search"><IconClose /></InputGroupButton>
</InputGroupAddon>`}
      >
        <ExampleCell label='xs with a label'>
          <div className='w-80'>
            <InputGroup>
              <InputGroupInput
                aria-label='Your reference number'
                defaultValue='WWC1234567E'
                readOnly
              />
              <InputGroupAddon align='inline-end'>
                <InputGroupButton>
                  <IconContentCopy />
                  Copy
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </ExampleCell>
        <ExampleCell label='icon-xs'>
          <div className='w-80'>
            <InputGroup>
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
              <InputGroupInput aria-label='Search services' defaultValue='Birth certificate' />
              <InputGroupAddon align='inline-end'>
                <InputGroupButton size='icon-xs' variant='ghost' aria-label='Clear search'>
                  <IconClose />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function AttachedActionSection() {
  return (
    <ExampleSection
      title='Attached action'
      description={
        <>
          <code>InputGroupAction</code> is the action the field exists for — Search, Apply, Send. It
          fills the group&apos;s height flush against its trailing edge. <code>solid</code> is the
          default; <code>subtle</code> and <code>open</code> step the emphasis down.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<InputGroup>
  <InputGroupInput aria-label="Postcode" inputMode="numeric" />
  <InputGroupAction>Search</InputGroupAction>
</InputGroup>`}
      >
        {(['solid', 'subtle', 'open'] as const).map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <div className='w-80'>
              <InputGroup>
                <InputGroupInput
                  aria-label={`Postcode (${variant})`}
                  inputMode='numeric'
                  defaultValue='2150'
                />
                <InputGroupAction variant={variant}>Search</InputGroupAction>
              </InputGroup>
            </div>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Finding a local council by postcode. The label and hint come from Field, exactly as for a bare Input, and the attached action submits the search.'
    >
      <Example>
        <Width>
          <Field>
            <FieldLabel>Find your local council</FieldLabel>
            <FieldDescription>Enter a NSW postcode or suburb.</FieldDescription>
            <InputGroup>
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
              <InputGroupInput autoComplete='postal-code' placeholder='For example, 2150' />
              <InputGroupAction>Search</InputGroupAction>
            </InputGroup>
          </Field>
        </Width>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function InputGroupDocs() {
  return (
    <DocsPage
      title='InputGroup'
      npm={[
        'InputGroup',
        'InputGroupAddon',
        'InputGroupText',
        'InputGroupInput',
        'InputGroupTextarea',
        'InputGroupButton',
        'InputGroupAction',
      ]}
      registry='input-group'
      summary={
        <>
          InputGroup joins an input to the things that belong with it — an icon, a unit, a small
          button or the action it submits — inside one bordered control, so the field and its
          adornments read and behave as one.
        </>
      }
    >
      <DocsUsage
        use={[
          'A value with a unit or prefix, such as $, AUD or km.',
          'A field with an action that only makes sense beside it, such as Search or Copy.',
          'A textarea with a footer row, such as a character limit and a Send button.',
        ]}
        avoid={[
          'A plain text field with nothing attached — use Input.',
          'A row of buttons with no field — use ButtonGroup.',
          'Site-wide search in the header — use SiteSearch or ExpandableSearch.',
        ]}
      />
      <StatesSection />
      <WithIconsSection />
      <AddonsSection />
      <InlineButtonsSection />
      <AttachedActionSection />
      <InContextSection />
      <DocsApi
        description={
          <>
            InputGroup is a container and takes a div&apos;s props. Set{' '}
            <code>data-disabled=&quot;true&quot;</code> on it to style the chrome as disabled — it
            does not disable the controls inside, so set <code>disabled</code> on each. The parts
            are covered in the sections above.
          </>
        }
      />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    docs: { page: InputGroupDocs },
  },
  args: {
    children: (
      <>
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupInput placeholder='Search' aria-label='Search' />
      </>
    ),
  },
  argTypes: {
    children: {
      control: false,
      description:
        'InputGroupAddon, InputGroupInput or InputGroupTextarea, and optionally InputGroupAction.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <div className='max-w-md'>
      <InputGroup {...args} />
    </div>
  ),
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The group is a labelled control container; the addon-wrapped input is the
    // interactive part.
    const group = canvasElement.querySelector('[data-slot="input-group"]')
    if (!group) {
      throw new Error('Could not find [data-slot="input-group"].')
    }

    const input = canvas.getByRole('textbox', { name: 'Search' })
    await expect(input).toBeEnabled()

    // Typing must reach the borderless inner control.
    await userEvent.type(input, 'roads')
    await expect(input).toHaveValue('roads')
  },
}

export const Playground: Story = {}

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const WithIcons: Story = { name: 'With icons', render: () => <WithIconsSection /> }

export const Addons: Story = { name: 'Addons', render: () => <AddonsSection /> }

export const InlineButtons: Story = {
  name: 'Inline buttons',
  render: () => <InlineButtonsSection />,
}

export const AttachedAction: Story = {
  name: 'Attached action',
  render: () => <AttachedActionSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
