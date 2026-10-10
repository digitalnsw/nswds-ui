/**
 * Toggle — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/Toggle               → this file: Docs, Default, Playground
 *   Components/Toggle/Features      → toggle.features.stories.tsx
 *   Components/Toggle/Accessibility → toggle.accessibility.stories.tsx
 *   Components/Toggle/Tests         → toggle.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 *
 * A two-state pressable button built on the Base UI Toggle primitive — the
 * pressed state (`aria-pressed` / `data-state`), keyboard handling and focus
 * come from there. `variant` and `size` are driven by `toggleVariants` (cva).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { IconFormatBold } from '../icons/format-bold.js'
import { IconFormatItalic } from '../icons/format-italic.js'
import { IconFormatUnderlined } from '../icons/format-underlined.js'
import { IconSchedule } from '../icons/schedule.js'
import { IconStar } from '../icons/star.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'
import { Toggle } from './toggle.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          <code>default</code> has no border until it is hovered or pressed, for toolbars where the
          row itself is the boundary. <code>outline</code> draws a hairline, for a toggle that
          stands on its own.
        </>
      }
    >
      <Example code={`<Toggle variant="outline" aria-label="Bold"><IconFormatBold /></Toggle>`}>
        {(['default', 'outline'] as const).map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <Toggle variant={variant} aria-label={`Bold (${variant})`}>
              <IconFormatBold />
            </Toggle>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          Three steps — <code>sm</code>, <code>default</code> and <code>lg</code>, 24, 28 and 32px
          tall. Match the size of the controls the toggle sits beside; every step clears the 24px
          minimum target size.
        </>
      }
    >
      <Example code={`<Toggle size="lg" aria-label="Italic"><IconFormatItalic /></Toggle>`}>
        {(['sm', 'default', 'lg'] as const).map((size) => (
          <ExampleCell key={size} label={size}>
            <Toggle size={size} variant='outline' aria-label={`Italic (${size})`}>
              <IconFormatItalic />
            </Toggle>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          Pressed is the on state, announced as <code>aria-pressed</code>. Start a toggle on with{' '}
          <code>defaultPressed</code>, or own the state with <code>pressed</code> and{' '}
          <code>onPressedChange</code>.
        </>
      }
    >
      <Example code={`<Toggle defaultPressed aria-label="Bold"><IconFormatBold /></Toggle>`}>
        <ExampleCell label='off'>
          <Toggle variant='outline' aria-label='Bold (off)'>
            <IconFormatBold />
          </Toggle>
        </ExampleCell>
        <ExampleCell label='pressed'>
          <Toggle variant='outline' defaultPressed aria-label='Bold (pressed)'>
            <IconFormatBold />
          </Toggle>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <Toggle variant='outline' disabled aria-label='Bold (disabled)'>
            <IconFormatBold />
          </Toggle>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function WithIconsSection() {
  return (
    <ExampleSection
      title='With icons'
      description={
        <>
          An icon-only toggle needs an <code>aria-label</code>. Beside a text label, mark the icon{' '}
          <code>data-icon=&quot;inline-start&quot;</code> so the padding balances.
        </>
      }
    >
      <Example
        code={`<Toggle variant="outline">
  <IconStar data-icon="inline-start" />
  Saved services
</Toggle>`}
      >
        <ExampleCell label='icon only'>
          <Toggle variant='outline' aria-label='Saved services'>
            <IconStar />
          </Toggle>
        </ExampleCell>
        <ExampleCell label='icon and label'>
          <Toggle variant='outline'>
            <IconStar data-icon='inline-start' />
            Saved services
          </Toggle>
        </ExampleCell>
        <ExampleCell label='label only'>
          <Toggle variant='outline'>Saved services</Toggle>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Independent toggles in a formatting toolbar, each turning its own setting on or off, and a single filter beside the results it narrows. When only one of a set can be on, use ToggleGroup instead.'
    >
      <Example
        code={`<div className="flex gap-1 rounded-sm border border-border p-1">
  <Toggle aria-label="Bold"><IconFormatBold /></Toggle>
  <Toggle aria-label="Italic"><IconFormatItalic /></Toggle>
  <Toggle aria-label="Underline"><IconFormatUnderlined /></Toggle>
</div>`}
      >
        <div className='w-full max-w-md space-y-2'>
          <p className='font-semibold'>Describe the issue</p>
          <div className='flex gap-1 rounded-sm border border-border p-1'>
            <Toggle aria-label='Bold'>
              <IconFormatBold />
            </Toggle>
            <Toggle aria-label='Italic'>
              <IconFormatItalic />
            </Toggle>
            <Toggle aria-label='Underline'>
              <IconFormatUnderlined />
            </Toggle>
          </div>
        </div>
      </Example>
      <Example
        code={`<Toggle variant="outline" onPressedChange={setOpenNow}>
  <IconSchedule data-icon="inline-start" />
  Open now
</Toggle>`}
      >
        <div className='flex w-full max-w-md flex-wrap items-center justify-between gap-4'>
          <p>24 Service NSW centres near Parramatta</p>
          <Toggle variant='outline'>
            <IconSchedule data-icon='inline-start' />
            Open now
          </Toggle>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ToggleDocs() {
  return (
    <DocsPage
      title='Toggle'
      npm='Toggle'
      registry='toggle'
      summary={
        <>
          A toggle is a button that stays pressed. It switches one setting on or off in place — bold
          text, a filter, a view — and shows which state it is in.
        </>
      }
    >
      <DocsUsage
        use={[
          'Turning a formatting option or view setting on and off, like Bold in a toolbar.',
          'Applying a single filter to the content beside it, like “Open now”.',
          'An icon button that needs to show it is active.',
        ]}
        avoid={[
          'Choosing one option from a set — use ToggleGroup or RadioGroup.',
          'A setting that takes effect when a form is submitted — use Checkbox or Switch.',
          'Triggering an action that does not stay on — use Button.',
        ]}
      />
      <VariantsSection />
      <SizesSection />
      <StatesSection />
      <WithIconsSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    docs: { page: ToggleDocs },
  },
  args: {
    'aria-label': 'Bold',
    children: <IconFormatBold />,
    variant: 'default',
    size: 'default',
    disabled: false,
    onPressedChange: fn(),
  },
  argTypes: {
    children: {
      control: false,
      description: 'The icon and/or label.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline'],
      description: 'Borderless, or a hairline outline.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      description: 'Scale step.',
      table: { category: 'Appearance' },
    },
    defaultPressed: {
      control: 'boolean',
      description: 'Whether the toggle starts pressed (uncontrolled).',
      table: { category: 'Behavior' },
    },
    pressed: {
      control: 'boolean',
      description: 'Whether the toggle is pressed (controlled).',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Removes the toggle from use.',
      table: { category: 'Behavior' },
    },
    onPressedChange: {
      description: 'Called with the new pressed state.',
      table: { category: 'Events' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name — required when the toggle shows only an icon.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector<HTMLElement>('[data-slot="toggle"]')
    if (!toggle) {
      throw new Error('Could not find [data-slot="toggle"].')
    }

    // Base UI owns the ARIA — assert it arrived rather than re-implementing it.
    await expect(toggle).toHaveAccessibleName('Bold')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    // Pressing is inherited, not hand-rolled — prove it with a real click.
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Playground: Story = {}
