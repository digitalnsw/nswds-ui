/**
 * ToggleGroup — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/ToggleGroup               → this file: Docs, Default, Playground
 *   Components/ToggleGroup/Features      → toggle-group.features.stories.tsx
 *   Components/ToggleGroup/Accessibility → toggle-group.accessibility.stories.tsx
 *   Components/ToggleGroup/Tests         → toggle-group.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 *
 * A set of related toggles built on the Base UI ToggleGroup primitive — roving
 * focus, arrow-key navigation and the group ARIA come from there. `variant`,
 * `size` and `spacing` cascade to the items via context.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { IconFormatAlignCenter } from '../icons/format-align-center.js'
import { IconFormatAlignLeft } from '../icons/format-align-left.js'
import { IconFormatAlignRight } from '../icons/format-align-right.js'
import { IconFormatBold } from '../icons/format-bold.js'
import { IconFormatItalic } from '../icons/format-italic.js'
import { IconFormatUnderlined } from '../icons/format-underlined.js'
import { IconList } from '../icons/list.js'
import { IconMap } from '../icons/map.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'
import { ToggleGroup, ToggleGroupItem } from './toggle-group.js'

/** The three alignment items most examples use. */
function AlignmentItems() {
  return (
    <>
      <ToggleGroupItem value='left' aria-label='Align left'>
        <IconFormatAlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value='center' aria-label='Align centre'>
        <IconFormatAlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value='right' aria-label='Align right'>
        <IconFormatAlignRight />
      </ToggleGroupItem>
    </>
  )
}

const alignmentCode = `<ToggleGroup defaultValue={['left']}>
  <ToggleGroupItem value="left" aria-label="Align left"><IconFormatAlignLeft /></ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Align centre"><IconFormatAlignCenter /></ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Align right"><IconFormatAlignRight /></ToggleGroupItem>
</ToggleGroup>`

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          Set <code>variant</code> on the group and every item takes it. <code>default</code> is
          borderless; <code>outline</code> gives each item a hairline.
        </>
      }
    >
      <Example code={alignmentCode.replace('<ToggleGroup ', '<ToggleGroup variant="outline" ')}>
        {(['default', 'outline'] as const).map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <ToggleGroup variant={variant} defaultValue={['left']}>
              <AlignmentItems />
            </ToggleGroup>
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
          <code>size</code> on the group sizes every item — <code>sm</code>, <code>default</code> or{' '}
          <code>lg</code>.
        </>
      }
    >
      <Example
        code={`<ToggleGroup size="lg" variant="outline" defaultValue={['left']}>…</ToggleGroup>`}
      >
        {(['sm', 'default', 'lg'] as const).map((size) => (
          <ExampleCell key={size} label={size}>
            <ToggleGroup size={size} variant='outline' defaultValue={['left']}>
              <AlignmentItems />
            </ToggleGroup>
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
          A pressed item is announced with <code>aria-pressed</code>. <code>disabled</code> on the
          group removes every item from use; on one item, just that item.
        </>
      }
    >
      <Example code={`<ToggleGroup disabled defaultValue={['left']}>…</ToggleGroup>`}>
        <ExampleCell label='left pressed'>
          <ToggleGroup variant='outline' defaultValue={['left']}>
            <AlignmentItems />
          </ToggleGroup>
        </ExampleCell>
        <ExampleCell label='one item disabled'>
          <ToggleGroup variant='outline' defaultValue={['left']}>
            <ToggleGroupItem value='left' aria-label='Align left'>
              <IconFormatAlignLeft />
            </ToggleGroupItem>
            <ToggleGroupItem value='center' aria-label='Align centre' disabled>
              <IconFormatAlignCenter />
            </ToggleGroupItem>
            <ToggleGroupItem value='right' aria-label='Align right'>
              <IconFormatAlignRight />
            </ToggleGroupItem>
          </ToggleGroup>
        </ExampleCell>
        <ExampleCell label='group disabled'>
          <ToggleGroup variant='outline' disabled defaultValue={['left']}>
            <AlignmentItems />
          </ToggleGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function SingleOrMultipleSection() {
  return (
    <ExampleSection
      title='Single or multiple'
      description={
        <>
          By default one item can be pressed at a time, like alignment. Add <code>multiple</code>{' '}
          when the items are independent, like text styles. Either way the value is an array.
        </>
      }
    >
      <Example code={`<ToggleGroup multiple defaultValue={['bold', 'italic']}>…</ToggleGroup>`}>
        <ExampleCell label='single (default)'>
          <ToggleGroup variant='outline' defaultValue={['left']}>
            <AlignmentItems />
          </ToggleGroup>
        </ExampleCell>
        <ExampleCell label='multiple'>
          <ToggleGroup variant='outline' multiple defaultValue={['bold', 'italic']}>
            <ToggleGroupItem value='bold' aria-label='Bold'>
              <IconFormatBold />
            </ToggleGroupItem>
            <ToggleGroupItem value='italic' aria-label='Italic'>
              <IconFormatItalic />
            </ToggleGroupItem>
            <ToggleGroupItem value='underline' aria-label='Underline'>
              <IconFormatUnderlined />
            </ToggleGroupItem>
          </ToggleGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function SpacingSection() {
  return (
    <ExampleSection
      title='Spacing'
      description={
        <>
          <code>spacing</code> is the gap between items in spacing steps (default <code>2</code>).
          At <code>0</code> the items join into one segmented control with shared borders.
        </>
      }
    >
      <Example
        code={`<ToggleGroup spacing={0} variant="outline" defaultValue={['left']}>…</ToggleGroup>`}
      >
        {([2, 1, 0] as const).map((spacing) => (
          <ExampleCell key={spacing} label={`spacing={${spacing}}`}>
            <ToggleGroup spacing={spacing} variant='outline' defaultValue={['left']}>
              <AlignmentItems />
            </ToggleGroup>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function OrientationSection() {
  return (
    <ExampleSection
      title='Orientation'
      description={
        <>
          <code>orientation=&quot;vertical&quot;</code> stacks the items and stretches them to the
          widest, for a set in a narrow side panel.
        </>
      }
    >
      <Example code={`<ToggleGroup orientation="vertical" defaultValue={['left']}>…</ToggleGroup>`}>
        <ExampleCell label='vertical'>
          <ToggleGroup orientation='vertical' variant='outline' defaultValue={['left']}>
            <AlignmentItems />
          </ToggleGroup>
        </ExampleCell>
        <ExampleCell label='vertical, spacing={0}'>
          <ToggleGroup orientation='vertical' variant='outline' spacing={0} defaultValue={['left']}>
            <AlignmentItems />
          </ToggleGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A view switch above search results: one of two views is always showing, and the labels say which. The group is named with aria-label, so a screen reader announces what the set of buttons is for.'
    >
      <Example
        code={`<ToggleGroup
  aria-label="Results view"
  variant="outline"
  spacing={0}
  value={view}
  onValueChange={setView}
>
  <ToggleGroupItem value="list"><IconList data-icon="inline-start" />List</ToggleGroupItem>
  <ToggleGroupItem value="map"><IconMap data-icon="inline-start" />Map</ToggleGroupItem>
</ToggleGroup>`}
      >
        <div className='flex w-full max-w-md flex-wrap items-center justify-between gap-4'>
          <p>12 public schools near Wagga Wagga</p>
          <ToggleGroup
            aria-label='Results view'
            variant='outline'
            spacing={0}
            defaultValue={['list']}
          >
            <ToggleGroupItem value='list'>
              <IconList data-icon='inline-start' />
              List
            </ToggleGroupItem>
            <ToggleGroupItem value='map'>
              <IconMap data-icon='inline-start' />
              Map
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ToggleGroupDocs() {
  return (
    <DocsPage
      title='ToggleGroup'
      npm={['ToggleGroup', 'ToggleGroupItem']}
      registry='toggle-group'
      summary={
        <>
          A toggle group is a set of related toggles that share one value. Use it to switch a view
          or a setting in place, with one item pressed at a time or several.
        </>
      }
    >
      <DocsUsage
        use={[
          'Switching between views of the same content, such as a list or a map.',
          'Choosing one formatting option from a set, such as text alignment.',
          'A compact row of independent options with multiple, such as bold, italic and underline.',
        ]}
        avoid={[
          'A single on/off setting — use Toggle or Switch.',
          'Choosing an answer in a form that is submitted later — use RadioGroup or Checkbox.',
          'Moving between sections of content — use Tabs.',
        ]}
      />
      <VariantsSection />
      <SizesSection />
      <StatesSection />
      <SingleOrMultipleSection />
      <SpacingSection />
      <OrientationSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    docs: { page: ToggleGroupDocs },
  },
  args: {
    children: <AlignmentItems />,
    defaultValue: ['left'],
    variant: 'default',
    size: 'default',
    spacing: 2,
    orientation: 'horizontal',
    multiple: false,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    children: {
      control: false,
      description: 'The ToggleGroupItem elements.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline'],
      description: 'Item treatment, applied to every item.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      description: 'Item size, applied to every item.',
      table: { category: 'Appearance' },
    },
    spacing: {
      control: { type: 'number', min: 0, max: 4 },
      description: 'Gap between items in spacing steps; 0 joins them.',
      table: { category: 'Appearance' },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Lay the items out in a row or a column.',
      table: { category: 'Appearance' },
    },
    multiple: {
      control: 'boolean',
      description: 'Allow more than one item to be pressed at once.',
      table: { category: 'Behavior' },
    },
    defaultValue: {
      control: 'object',
      description: 'The values pressed at first (uncontrolled).',
      table: { category: 'Behavior' },
    },
    value: {
      control: 'object',
      description: 'The values pressed (controlled).',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Removes every item from use.',
      table: { category: 'Behavior' },
    },
    onValueChange: {
      description: 'Called with the new array of pressed values.',
      table: { category: 'Events' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof ToggleGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector<HTMLElement>('[data-slot="toggle-group"]')
    if (!group) {
      throw new Error('Could not find [data-slot="toggle-group"].')
    }

    const items = canvasElement.querySelectorAll<HTMLElement>('[data-slot="toggle-group-item"]')
    await expect(items).toHaveLength(3)

    // The item matching the group's defaultValue starts pressed; Base UI owns
    // the pressed state, so assert it arrived rather than re-implementing it.
    const leftItem = canvasElement.querySelector<HTMLElement>(
      '[data-slot="toggle-group-item"][aria-label="Align left"]',
    )
    if (!leftItem) {
      throw new Error('Could not find the "Align left" item.')
    }
    await expect(leftItem).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Playground: Story = {}
