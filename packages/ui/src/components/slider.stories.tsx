/**
 * Slider — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/Slider               → this file: Docs, Default, Playground
 *   Components/Slider/Features      → slider.features.stories.tsx
 *   Components/Slider/Accessibility → slider.accessibility.stories.tsx
 *   Components/Slider/Tests         → slider.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import { Field, FieldDescription, FieldLabel } from './field.js'
import { Slider } from './slider.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          <code>disabled</code> removes the slider from use and dims it. As with any disabled
          control, say nearby why it is unavailable.
        </>
      }
    >
      <Example
        layout='grid'
        code={`<Field>
  <FieldLabel>Search radius</FieldLabel>
  <Slider defaultValue={[25]} max={50} disabled />
</Field>`}
      >
        <ExampleCell label='default'>
          <Field className='w-64'>
            <FieldLabel>Search radius</FieldLabel>
            <Slider defaultValue={[25]} max={50} />
          </Field>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <Field className='w-64'>
            <FieldLabel>Search radius</FieldLabel>
            <Slider defaultValue={[25]} max={50} disabled />
          </Field>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function StepsSection() {
  return (
    <ExampleSection
      title='Steps'
      description={
        <>
          <code>min</code>, <code>max</code> and <code>step</code> set the scale. Arrow keys move
          one <code>step</code>; Page Up and Page Down move a <code>largeStep</code> (10 by
          default).
        </>
      }
    >
      <Example
        layout='grid'
        code={`<Slider defaultValue={[3]} min={1} max={6} step={1} />
<Slider defaultValue={[20]} min={5} max={50} step={5} />`}
      >
        <ExampleCell label='step={1}, 1–6'>
          <Field className='w-64'>
            <FieldLabel>Number of bedrooms</FieldLabel>
            <Slider defaultValue={[3]} min={1} max={6} step={1} />
          </Field>
        </ExampleCell>
        <ExampleCell label='step={5}, 5–50'>
          <Field className='w-64'>
            <FieldLabel>Search radius (km)</FieldLabel>
            <Slider defaultValue={[20]} min={5} max={50} step={5} />
          </Field>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function RangeSection() {
  return (
    <ExampleSection
      title='Range'
      description={
        <>
          Pass an array of two values and the slider draws two thumbs, filling between them. Give
          the root a <code>format</code> so each thumb announces its value in the right unit.
        </>
      }
    >
      <Example
        code={`<Slider
  defaultValue={[350, 600]}
  min={100}
  max={1000}
  step={10}
  format={{ style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }}
/>`}
      >
        <Field className='w-full max-w-md'>
          <FieldLabel>Weekly rent</FieldLabel>
          <Slider
            defaultValue={[350, 600]}
            min={100}
            max={1000}
            step={10}
            format={{ style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }}
          />
        </Field>
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
          <code>orientation=&quot;vertical&quot;</code> runs the track up the page, with the lowest
          value at the bottom. Give the slider a height — it fills its container, with a 160px
          minimum. Arrow keys work the same way in both orientations.
        </>
      }
    >
      <Example
        code={`<Field className="h-48">
  <FieldLabel>Volume</FieldLabel>
  <Slider orientation="vertical" defaultValue={[40]} />
</Field>`}
      >
        <ExampleCell label='horizontal (default)'>
          <Field className='w-64'>
            <FieldLabel>Volume</FieldLabel>
            <Slider defaultValue={[40]} />
          </Field>
        </ExampleCell>
        <ExampleCell label='vertical'>
          <Field className='h-48 items-center'>
            <FieldLabel>Volume</FieldLabel>
            <Slider orientation='vertical' defaultValue={[40]} />
          </Field>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

const audFormat = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
})

function RentFilter() {
  const [rent, setRent] = React.useState<number[]>([350, 600])
  return (
    <Field className='w-full max-w-md'>
      <FieldLabel>Weekly rent</FieldLabel>
      <FieldDescription>
        {audFormat.format(rent[0] ?? 0)} to {audFormat.format(rent[1] ?? 0)} per week
      </FieldDescription>
      <Slider
        value={rent}
        onValueChange={(next) => setRent(Array.isArray(next) ? [...next] : [next])}
        min={100}
        max={1000}
        step={10}
        format={{ style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }}
      />
    </Field>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A filter on a rental search. The chosen values are written out beside the label, because the track alone never says exactly what is selected.'
    >
      <Example
        code={`const [rent, setRent] = useState([350, 600])

<Field>
  <FieldLabel>Weekly rent</FieldLabel>
  <FieldDescription>
    {aud.format(rent[0])} to {aud.format(rent[1])} per week
  </FieldDescription>
  <Slider value={rent} onValueChange={setRent} min={100} max={1000} step={10} />
</Field>`}
      >
        <RentFilter />
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SliderDocs() {
  return (
    <DocsPage
      title='Slider'
      npm='Slider'
      registry='slider'
      summary={
        <>
          A slider picks a number, or a range, from a continuous scale by dragging a thumb along a
          track. It takes its name from the surrounding <code>Field</code> — wrap it in one with a{' '}
          <code>FieldLabel</code>, exactly as you would an Input. Pass the value as an array, one
          entry per thumb.
        </>
      }
    >
      <DocsUsage
        use={[
          'Narrowing results by an approximate amount, such as a price range or a distance.',
          'Adjusting a setting where the exact value matters less than its position, like text size.',
          'Choosing a range with two thumbs, such as a minimum and maximum rent.',
        ]}
        avoid={[
          'Entering an exact figure, like an income or an amount owed — use Input.',
          'Choosing from a few named options — use RadioGroup or Select.',
          'Turning a setting on or off — use Switch.',
        ]}
      />
      <StatesSection />
      <StepsSection />
      <RangeSection />
      <OrientationSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: SliderDocs },
  },
  args: {
    defaultValue: [56],
    min: 16,
    max: 140,
    step: 1,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: {
      control: 'object',
      description:
        'The starting value (uncontrolled), as an array with one entry per thumb — [56] for one, [350, 600] for a range.',
      table: { category: 'Behavior' },
    },
    value: {
      control: 'object',
      description: 'The value (controlled), as an array with one entry per thumb.',
      table: { category: 'Behavior' },
    },
    min: {
      control: 'number',
      description: 'The lowest value on the scale.',
      table: { category: 'Behavior' },
    },
    max: {
      control: 'number',
      description: 'The highest value on the scale.',
      table: { category: 'Behavior' },
    },
    step: {
      control: 'number',
      description: 'How far one arrow key press moves the thumb.',
      table: { category: 'Behavior' },
    },
    largeStep: {
      control: 'number',
      description: 'How far Page Up and Page Down move the thumb.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Removes the slider from use.',
      table: { category: 'Behavior' },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Lay the track out across or up the page.',
      table: { category: 'Appearance' },
    },
    format: {
      control: 'object',
      description: 'Intl.NumberFormat options used for the announced value.',
      table: { category: 'Accessibility' },
    },
    onValueChange: {
      description: 'Called with the new value as the thumb moves.',
      table: { category: 'Events' },
    },
    onValueCommitted: {
      description: 'Called with the final value when the pointer is released.',
      table: { category: 'Events' },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Field className='max-w-md'>
      <FieldLabel>Size</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Base UI renders the thumb as a `<div>` wrapping a real
 * `<input type="range">`, and it is the INPUT that carries the value and the
 * (implicit) `slider` role — not the thumb element. Assertions have to target
 * it, or they test the wrapper and pass on a broken control.
 */
function getThumbInput(canvasElement: HTMLElement) {
  const thumb = canvasElement.querySelector<HTMLElement>('[data-slot="slider-thumb"]')
  if (!thumb) {
    throw new Error('Could not find an element with [data-slot="slider-thumb"].')
  }
  const input = thumb.querySelector<HTMLInputElement>('input[type="range"]')
  if (!input) {
    throw new Error('Expected the thumb to contain an <input type="range">.')
  }
  return input
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const input = getThumbInput(canvasElement)

    // Base UI owns the ARIA — assert it arrived rather than re-implementing it.
    // A range input's `slider` role is implicit, so check the value contract.
    await expect(input).toHaveValue(String(args.defaultValue))
    await expect(input).toHaveAttribute('aria-valuenow', String(args.defaultValue))
    await expect(input).toHaveAttribute('min', String(args.min))
    await expect(input).toHaveAttribute('max', String(args.max))

    // The FieldLabel must actually name the control, or the slider is
    // unnamed to a screen reader (WCAG 2.1 AA, 4.1.2). Base UI wires the
    // label→control association from the Field context AFTER mount — one render
    // later than the value attributes above — so poll for it rather than reading
    // once: a single read races that association on a cold production load
    // (Chromatic), where the input is queryable a frame before it is labelled.
    await waitFor(() => expect(input).toHaveAccessibleName('Size'))

    // Keyboard stepping is inherited, not hand-rolled — prove it works with a
    // real key press. A synthetic KeyboardEvent would not move a native range
    // input, so it would pass whether the behaviour existed or not.
    input.focus()
    await userEvent.keyboard('{ArrowRight}')

    await expect(input).toHaveValue(String(Number(args.defaultValue) + Number(args.step ?? 1)))
  },
}

export const Playground: Story = {}
