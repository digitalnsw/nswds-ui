/**
 * ButtonGroup — Default, Variants, CssCheck
 *
 * A layout wrapper that visually joins a row (or column) of Buttons, collapsing
 * the shared borders and radii between them. It composes the real Button
 * component and the Separator primitive; the accessibility of each control is
 * inherited from Button.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './button-group.js'
import { Button } from './button.js'

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Groups related Buttons into a single joined control, horizontally or vertically. Mix in ButtonGroupText for inline labels and ButtonGroupSeparator to divide segments.',
      },
    },
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant='outline'>Copy</Button>
      <Button variant='outline'>Paste</Button>
      <Button variant='outline'>Cut</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The three Buttons render as real buttons…
    const buttons = canvas.getAllByRole('button')
    await expect(buttons).toHaveLength(3)

    // …and they live inside the grouping wrapper.
    const group = canvasElement.querySelector('[data-slot="button-group"]')
    if (!group) {
      throw new Error('Could not find [data-slot="button-group"].')
    }
    await expect(group).toContainElement(buttons[0] ?? null)
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col items-start gap-8'>
      {/* Horizontal (default) */}
      <ButtonGroup>
        <Button variant='outline'>Left</Button>
        <Button variant='outline'>Middle</Button>
        <Button variant='outline'>Right</Button>
      </ButtonGroup>

      {/* Vertical */}
      <ButtonGroup orientation='vertical'>
        <Button variant='outline'>Top</Button>
        <Button variant='outline'>Middle</Button>
        <Button variant='outline'>Bottom</Button>
      </ButtonGroup>

      {/* With inline text and a separator */}
      <ButtonGroup>
        <Button variant='outline'>Bold</Button>
        <ButtonGroupSeparator />
        <ButtonGroupText>Aa</ButtonGroupText>
        <ButtonGroupSeparator />
        <Button variant='outline'>Italic</Button>
      </ButtonGroup>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  render: () => (
    <ButtonGroup>
      <Button variant='outline'>One</Button>
      <ButtonGroupSeparator />
      <Button variant='outline'>Two</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const separator = canvasElement.querySelector<HTMLElement>(
      '[data-slot="button-group-separator"]',
    )
    if (!separator) {
      throw new Error('Could not find [data-slot="button-group-separator"].')
    }

    // Proves globals.css loaded: bg-input resolves to a real colour rather
    // than staying transparent.
    const background = getComputedStyle(separator).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-input to resolve, received "${background}".`)
    }
  },
}
