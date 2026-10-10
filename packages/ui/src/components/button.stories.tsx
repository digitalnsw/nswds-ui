/**
 * Button — the reference story set for docs/reference-storybook-standard.md.
 *
 *   Components/Button                → this file: Docs, Default, Playground and
 *                                      one story per docs section
 *   Components/Button/Tests          → button.tests.stories.tsx
 *   Components/Button/Accessibility  → button.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { IconAdd, IconArrowForward, IconExpandMore, IconSearch } from '../icons/index.js'
import { Button, ButtonLink } from './button.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const variants = ['solid', 'soft', 'surface', 'outline', 'ghost', 'link'] as const
const sizes = ['sm', 'default', 'lg', 'icon'] as const
const colors = [
  'white',
  'grey',
  'primary',
  'secondary',
  'tertiary',
  'accent',
  'danger',
  'success',
  'warning',
] as const

// The variant treatments shown in each colour row.
const colourVariants = ['solid', 'soft', 'surface', 'outline'] as const

const variantDocs: ReadonlyArray<readonly [(typeof variants)[number], string]> = [
  ['solid', 'High emphasis — the single primary action on a screen.'],
  ['soft', 'Medium emphasis — a tinted fill with no border.'],
  ['surface', 'Medium emphasis — a subtle fill with a visible border.'],
  ['outline', 'Low emphasis — border only, transparent background.'],
  ['ghost', 'Low emphasis — no border or fill until hovered.'],
  ['link', 'Minimal — renders as inline underlined text.'],
]

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description='The variant sets the visual weight. Step the emphasis down as actions become more secondary, and keep one solid button per view.'
    >
      <Example code={`<Button variant="soft">Soft</Button>`}>
        {variants.map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <Button variant={variant}>{capitalise(variant)}</Button>
          </ExampleCell>
        ))}
      </Example>
      <dl className='grid gap-x-10 gap-y-3 sm:grid-cols-2'>
        {variantDocs.map(([name, description]) => (
          <div key={name} className='flex gap-4'>
            <dt className='w-20 shrink-0 font-semibold'>{name}</dt>
            <dd className='text-muted-foreground'>{description}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          Three steps — <code>sm</code>, <code>default</code>, <code>lg</code> — 52, 60 and 68px
          tall on narrow viewports and 44, 52 and 60px from the <code>sm:</code> breakpoint up. The
          label is 16px bold at every step; only the padding changes.
        </>
      }
    >
      <Example code={`<Button size="lg">Continue</Button>`}>
        {(['sm', 'default', 'lg'] as const).map((size) => (
          <ExampleCell key={size} label={size}>
            <Button size={size}>Continue</Button>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function IconOnlySection() {
  return (
    <ExampleSection
      title='Icon only'
      description={
        <>
          Add <code>iconOnly</code> to square a button at the active <code>size</code>, so it sits
          level with text buttons beside it. <code>size=&quot;icon&quot;</code> is a separate 40×40
          chrome square for header actions and close buttons that align with nothing. Either way,
          give it an <code>aria-label</code>.
        </>
      }
    >
      <Example
        code={`<Button iconOnly variant="outline" aria-label="Search" leadingVisual={IconSearch} />`}
      >
        {(['sm', 'default', 'lg'] as const).map((size) => (
          <ExampleCell key={size} label={`${size} + iconOnly`}>
            <div className='flex items-center gap-2'>
              <Button size={size}>Search</Button>
              <Button
                size={size}
                iconOnly
                variant='outline'
                aria-label={`Search (${size})`}
                leadingVisual={IconSearch}
              />
            </div>
          </ExampleCell>
        ))}
        <ExampleCell label='size="icon"'>
          <Button size='icon' variant='ghost' aria-label='Add' leadingVisual={IconAdd} />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function ColourRow({ color }: { color: (typeof colors)[number] }) {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <span className='w-24 shrink-0 font-semibold'>{color}</span>
      {colourVariants.map((variant) => (
        <Button key={variant} color={color} variant={variant}>
          {capitalise(variant)}
        </Button>
      ))}
    </div>
  )
}

function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          <code>color</code> picks a role, not a hue. Brand colours follow the active theme;{' '}
          <code>white</code> and <code>secondary</code> are for coloured or dark surfaces; status
          colours keep their meaning in every theme — reserve <code>danger</code> for destructive
          actions.
        </>
      }
    >
      <Example layout='stack' code={`<Button color="tertiary" variant="soft">Soft</Button>`}>
        {(['primary', 'tertiary', 'accent', 'grey'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
      <Example layout='stack' surface='brand'>
        {(['white', 'secondary'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
      <Example layout='stack'>
        {(['danger', 'success', 'warning'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
    </ExampleSection>
  )
}

function WithIconsSection() {
  return (
    <ExampleSection
      title='With icons'
      description='A leading or trailing icon reinforces the label; it never replaces it. Icons are 24px beside the label at every size.'
    >
      <Example code={`<Button trailingVisual={IconArrowForward}>Next</Button>`}>
        <ExampleCell label='leadingVisual'>
          <Button leadingVisual={IconAdd}>Add item</Button>
        </ExampleCell>
        <ExampleCell label='trailingVisual'>
          <Button trailingVisual={IconArrowForward}>Next</Button>
        </ExampleCell>
        <ExampleCell label='trailingAction'>
          <Button variant='outline' trailingAction={IconExpandMore}>
            Options
          </Button>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description='Loading shows a spinner and blocks interaction while keeping the label; disabled removes the button from use. Prefer explaining why an action is unavailable over disabling it silently.'
    >
      <Example code={`<Button loading>Save</Button>`}>
        <ExampleCell label='default'>
          <Button>Save</Button>
        </ExampleCell>
        <ExampleCell label='loading'>
          <Button loading>Save</Button>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <Button disabled>Save</Button>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function AsALinkSection() {
  return (
    <ExampleSection
      title='As a link'
      description={
        <>
          <code>ButtonLink</code> renders an anchor with the button&apos;s full treatment, for
          navigation that should look like an action. It routes through <code>Link</code>, so a
          framework link set on <code>LinkProvider</code> applies.
        </>
      }
    >
      <Example
        code={`<ButtonLink href="/apply" trailingVisual={IconArrowForward}>Start now</ButtonLink>`}
      >
        {(['solid', 'outline', 'link'] as const).map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <ButtonLink href='#' variant={variant} trailingVisual={IconArrowForward}>
              Start now
            </ButtonLink>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ButtonDocs() {
  return (
    <DocsPage
      title='Button'
      npm={['Button', 'ButtonLink']}
      registry='button'
      summary={
        <>
          Buttons let people take an action or make a choice. Pair a <strong>variant</strong> (how
          much emphasis it carries) with a <strong>colour</strong> (the role it plays): one
          high-emphasis button for the primary action, quieter treatments for the rest.
        </>
      }
    >
      <DocsUsage
        use={[
          'Submitting a form or starting a task.',
          'Confirming, cancelling or otherwise answering a dialog.',
          'A call to action that starts a journey — as a ButtonLink when it navigates.',
        ]}
        avoid={[
          'Moving to another page as part of running text — use Link.',
          'Switching a setting on or off — use Switch or Toggle.',
          'Choosing between a few related options — use ButtonGroup, ToggleGroup or RadioGroup.',
        ]}
      />
      <VariantsSection />
      <SizesSection />
      <ColoursSection />
      <StatesSection />
      <WithIconsSection />
      <IconOnlySection />
      <AsALinkSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const iconOptions = {
  none: undefined,
  arrow_forward: IconArrowForward,
  add: IconAdd,
  search: IconSearch,
  chevron_down: IconExpandMore,
}

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ButtonDocs },
  },
  args: {
    children: 'Continue',
    variant: 'solid',
    color: 'primary',
    size: 'default',
    disabled: false,
    loading: false,
    block: false,
    alignContent: 'center',
    onClick: fn(),
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button label/content.',
      table: { category: 'Content' },
    },
    leadingVisual: {
      control: 'select',
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      description: 'Icon rendered before the label.',
      table: { category: 'Content' },
    },
    trailingVisual: {
      control: 'select',
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      description: 'Icon rendered after the label.',
      table: { category: 'Content' },
    },
    trailingAction: {
      control: 'select',
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      description: 'Icon rendered as a trailing action at the far end.',
      table: { category: 'Content' },
    },
    labelWrap: {
      control: 'boolean',
      description: 'Allow the label to wrap onto multiple lines.',
      table: { category: 'Content' },
    },
    count: {
      control: 'number',
      description: 'Optional numeric badge rendered after the label.',
      table: { category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables click/tap and applies disabled styles.',
      table: { category: 'Behavior' },
    },
    loading: {
      control: 'boolean',
      description: 'Shows a spinner and disables the button.',
      table: { category: 'Behavior' },
    },
    variant: {
      control: 'inline-radio',
      options: variants,
      description: 'Visual treatment — how much emphasis the button carries.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: colors,
      description: 'Colour role. White and secondary need a coloured or dark surface.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'Scale step; `icon` is the flat 40×40 chrome square.',
      table: { category: 'Appearance' },
    },
    iconOnly: {
      control: 'boolean',
      description: 'Square the button at the active size. Requires an aria-label.',
      table: { category: 'Appearance' },
    },
    block: {
      control: 'boolean',
      description: 'Stretch the button to fill its container.',
      table: { category: 'Appearance' },
    },
    alignContent: {
      control: 'inline-radio',
      options: ['center', 'start'],
      description: 'Horizontal alignment of the content.',
      table: { category: 'Appearance' },
    },
    onClick: {
      description: 'Click handler (logged in the Actions panel).',
      table: { category: 'Events' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for icon-only buttons.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    await expect(button).toHaveTextContent('Continue')
    await expect(button).toHaveAttribute('data-variant', 'solid')
  },
}

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const WithIcons: Story = { name: 'With icons', render: () => <WithIconsSection /> }

export const IconOnly: Story = { name: 'Icon only', render: () => <IconOnlySection /> }

export const AsALink: Story = { name: 'As a link', render: () => <AsALinkSection /> }
