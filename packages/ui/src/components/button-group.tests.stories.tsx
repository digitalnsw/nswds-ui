/**
 * ButtonGroup — Tests
 *
 * The CSS check and the variant/emphasis regression that used to sit in the
 * main file. Hidden from the sidebar (`!dev`) and the docs page
 * (`!autodocs`); they run in the Vitest suite and in Chromatic.
 *
 * Usage examples live on the docs page (button-group.stories.tsx); the
 * matrices and rule-pinning stories in button-group.features.stories.tsx;
 * keyboard, focus and target-size checks in button-group.accessibility.stories.tsx.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { IconExpandMore } from '../icons/index.js'
import { ButtonGroup, ButtonGroupText, type ButtonGroupVariant } from './button-group.js'
import { Button } from './button.js'

const variants = [
  'outline',
  'solid',
  'soft',
  'surface',
  'ghost',
] as const satisfies readonly ButtonGroupVariant[]

const meta = {
  title: 'Components/ButtonGroup/Tests',
  component: ButtonGroup,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Moved from the main file ─────────────────────────────────────────────────

// Proves globals.css loaded and the text cell / frame geometry holds.
export const CssCheck: Story = {
  name: 'CSS check',
  render: () => (
    <ButtonGroup aria-label='Clipboard'>
      <Button>One</Button>
      <ButtonGroupText>Aa</ButtonGroupText>
      <Button>Two</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Clipboard' })

    // Proves globals.css loaded: the outline frame is an inset ring in the
    // ink, which only resolves when the token layers are present.
    const shadow = getComputedStyle(group).boxShadow
    if (shadow === '' || shadow === 'none') {
      throw new Error(`Expected the outline frame ring to paint, received "${shadow}".`)
    }

    // The text cell sits at the body size, never fine print, and its
    // background stops at the padding box so the frame shows through.
    const cell = canvasElement.querySelector<HTMLElement>('[data-slot="button-group-text"]')
    if (!cell) {
      throw new Error('Could not find [data-slot="button-group-text"].')
    }
    await expect(parseFloat(getComputedStyle(cell).fontSize)).toBeGreaterThanOrEqual(16)
    await expect(getComputedStyle(cell).backgroundClip).toBe('padding-box')

    // The group is exactly one button tall: the frame adds no height.
    const button = canvas.getByRole('button', { name: 'One' })
    await expect(group.getBoundingClientRect().height).toBe(button.getBoundingClientRect().height)
  },
}

// Every variant with the common compositions: emphasis is kept whatever the
// group variant, and a solid band re-inks its non-solid segments.
export const Variants: Story = {
  name: 'Variants — emphasis and band ink',
  render: () => (
    <div className='flex flex-col gap-6'>
      {variants.map((variant) => (
        <div key={variant} className='flex flex-wrap items-start gap-4'>
          <ButtonGroup variant={variant} aria-label={`${variant} clipboard`}>
            <Button>Copy</Button>
            <Button>Paste</Button>
            <Button>Cut</Button>
          </ButtonGroup>
          <ButtonGroup variant={variant}>
            <Button variant='solid'>Save</Button>
            <Button
              variant='solid'
              iconOnly
              aria-label='More save options'
              leadingVisual={IconExpandMore}
            />
          </ButtonGroup>
          <ButtonGroup variant={variant}>
            <Button>Cancel</Button>
            <Button variant='solid'>Save and continue</Button>
          </ButtonGroup>
          <ButtonGroup variant={variant} aria-label={`${variant} formatting`}>
            <Button>Bold</Button>
            <ButtonGroupText>Aa</ButtonGroupText>
            <Button>Italic</Button>
          </ButtonGroup>
          <ButtonGroup variant={variant}>
            <Button>Rest</Button>
            <Button variant='soft'>Soft</Button>
            <Button disabled>Off</Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A child that asks for emphasis keeps it, whatever the group variant.
    for (const save of canvas.getAllByRole('button', { name: 'Save' })) {
      await expect(save).toHaveAttribute('data-variant', 'solid')
      await expect(save).toHaveAttribute('data-segment', 'override')
    }
    for (const soft of canvas.getAllByRole('button', { name: 'Soft' })) {
      await expect(soft).toHaveAttribute('data-variant', 'soft')
      await expect(soft).toHaveAttribute('data-segment', 'override')
    }

    // In a solid band every segment that is not itself solid takes the band's
    // label colour as its ink, so nothing is blue on blue.
    const band = canvas.getByRole('group', { name: 'solid clipboard' })
    const solidLabel = getComputedStyle(canvas.getAllByRole('button', { name: 'Save' })[0]!).color
    for (const segment of within(band).getAllByRole('button')) {
      await expect(getComputedStyle(segment).color).toBe(solidLabel)
    }
  },
}
