/**
 * Accordion — Default, Variants, CssCheck
 *
 * A vertically stacked set of disclosure sections on the Base UI accordion
 * primitive. Base UI owns the open/close state, ARIA (aria-expanded /
 * aria-controls) and keyboard handling; we only style the trigger and panel.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.js'

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A stacked set of expandable sections built on the Base UI Accordion primitive. Each AccordionItem needs a unique `value`; Base UI manages open state, ARIA and keyboard navigation.',
      },
    },
  },
  render: (args) => (
    <Accordion {...args} className='max-w-md'>
      <AccordionItem value='item-1'>
        <AccordionTrigger>What is the NSW Design System?</AccordionTrigger>
        <AccordionContent>
          A reusable set of components and tokens for NSW Government digital products.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='item-2'>
        <AccordionTrigger>Who can use it?</AccordionTrigger>
        <AccordionContent>
          Any team building services under the NSW Government masterbrand.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>(
      '[data-slot="accordion-trigger"]',
    )
    if (!trigger) {
      throw new Error('Could not find [data-slot="accordion-trigger"].')
    }

    // Base UI owns the disclosure ARIA — assert it starts collapsed rather than
    // re-implementing the wiring.
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    // A real click must expand the section. Base UI toggles aria-expanded and
    // mounts the panel content.
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const panel = canvasElement.querySelector('[data-slot="accordion-content"]')
    await expect(panel).toBeInTheDocument()
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <Accordion className='max-w-md' defaultValue={['a']}>
      <AccordionItem value='a'>
        <AccordionTrigger>Open by default</AccordionTrigger>
        <AccordionContent>This item is expanded on first render.</AccordionContent>
      </AccordionItem>
      <AccordionItem value='b'>
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionContent>
          <p>Panels can hold rich content.</p>
          <p>
            Including <a href='#example'>links</a> that inherit accordion styling.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='c'>
        <AccordionTrigger>Third section</AccordionTrigger>
        <AccordionContent>Any number of items can be stacked.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the accordion root's `border` utility resolves
    // to a real --border colour rather than staying unset.
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="accordion"]')
    if (!root) {
      throw new Error('Could not find [data-slot="accordion"].')
    }
    const borderColor = getComputedStyle(root).borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected the --border token to resolve, received "${borderColor}".`)
    }
  },
}
