/**
 * Input — Features
 *
 * Visual matrices for design QA: every supported HTML input type rendered side
 * by side, and the full interaction-state ladder (default, hover, focused,
 * disabled, read-only, invalid, with value). These stories exist for internal
 * regression review during token or CSS refactors — they intentionally include
 * every variant in a single view rather than serving as usage examples.
 *
 * Hover and focus states are forced via utility classes rather than live
 * pointer interaction so the matrix renders deterministically in visual
 * diffs. Touch-target geometry lives in input.accessibility.stories.tsx.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from './input.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const types = [
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
  'date',
  'file',
] as const

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Input/Features',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  args: {
    type: 'text',
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const docsTemplate = ({
  what,
  why,
  how,
  caveat,
}: {
  what: string
  why: string
  how: string
  caveat: string
}) => `${what}\n\nWhy it matters: ${why}\n\nHow to test: ${how}\n\nCaveats: ${caveat}`

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Types: Story = {
  name: 'Types',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Every supported native HTML input type rendered with a representative placeholder.',
          why: 'Confirms that mobile keyboards, validation, and native pickers (date, file) all render with consistent NSW token-driven styling.',
          how: 'Scan each row for matching height, border colour, and radius; compare against the Figma Inputs/Field spec node 21298-45491.',
          caveat:
            'Native pickers (date, file) defer chrome to the browser, so the inner control appearance varies between Chrome, Safari, and Firefox.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-full max-w-md gap-3'>
      {types.map((type) => (
        <Input key={type} type={type} placeholder={type} aria-label={type} />
      ))}
    </div>
  ),
}

export const States: Story = {
  name: 'States',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The full interaction-state ladder: default, focused (forced via outline classes), disabled, read-only, invalid, and populated.',
          why: 'States are the most common source of token-regression bugs — the focus outline, disabled opacity, and aria-invalid border must all stay in lock-step with the design tokens.',
          how: 'Visually compare against the Figma Inputs/Field variants. The Focused row should match the NSW-blue 2px outline with 2px offset; Invalid should show the 2px danger-600 border.',
          caveat:
            'Hover background is not represented as a forced row because it relies on the live :hover pseudo-class; hover the Default row manually to verify.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-full max-w-md gap-3'>
      <Input placeholder='Default' />
      <Input
        placeholder='Focused'
        className='outline outline-2 outline-offset-2 outline-primary-800'
      />
      <Input placeholder='Disabled' disabled />
      <Input placeholder='Read-only' readOnly defaultValue='Read-only value' />
      <Input placeholder='Invalid' aria-invalid='true' />
      <Input placeholder='With value' defaultValue='With a value' />
    </div>
  ),
}
