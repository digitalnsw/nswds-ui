/**
 * Accordion — Tests
 *
 * Token wiring for the `accent` and `band` variants, and a CSS check proving
 * globals.css loaded.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.js'

const meta = {
  title: 'Components/Accordion/Tests',
  component: Accordion,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
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

export const Accent: Story = {
  name: 'Accent variant',
  render: () => (
    <Accordion className='max-w-md' variant='accent' defaultValue={['a']}>
      <AccordionItem value='a'>
        <AccordionTrigger>Open by default</AccordionTrigger>
        <AccordionContent>
          When an item opens, a Red 02 (waratah) rule slides in on the leading edge.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='b'>
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionContent>
          <p>The accent reinforces which section is expanded.</p>
          <p>
            Panels still hold rich content and <a href='#example'>links</a>.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='c'>
        <AccordionTrigger>Third section</AccordionTrigger>
        <AccordionContent>The expand icon turns red while the section is open.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    // The open item carries the accent rule; the leading border must resolve to a
    // real (non-transparent) colour — proving accent-600 (--nsw-red-*) is wired.
    const openItem = canvasElement.querySelector<HTMLElement>(
      '[data-slot="accordion-item"][data-open]',
    )
    if (!openItem) {
      throw new Error('Could not find an open [data-slot="accordion-item"].')
    }
    const leadingBorder = getComputedStyle(openItem).borderInlineStartColor
    if (
      leadingBorder === '' ||
      leadingBorder === 'rgba(0, 0, 0, 0)' ||
      leadingBorder === 'transparent'
    ) {
      throw new Error(`Expected the accent rule to resolve, received "${leadingBorder}".`)
    }

    // The visible expand icon on the open item must share the accent colour — both
    // resolve to accent-600. Guards against the icon silently staying blue.
    const icons = openItem.querySelectorAll<HTMLElement>('[data-slot="accordion-trigger-icon"]')
    const visibleIcon = Array.from(icons).find((el) => getComputedStyle(el).display !== 'none')
    if (!visibleIcon) {
      throw new Error('Could not find a visible expand icon on the open item.')
    }
    await expect(getComputedStyle(visibleIcon).color).toBe(leadingBorder)
  },
}

export const Band: Story = {
  name: 'Band variant',
  render: () => (
    <Accordion className='max-w-md' variant='band' defaultValue={['a']}>
      <AccordionItem value='a'>
        <AccordionTrigger>Open by default</AccordionTrigger>
        <AccordionContent>
          Every header sits on a grey band that deepens when hovered, focused or open.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='b'>
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionContent>
          <p>The grey band suits FAQ and support pages that need strong grouping.</p>
          <p>
            Panels hold rich content and <a href='#example'>links</a>.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='c'>
        <AccordionTrigger>Third section</AccordionTrigger>
        <AccordionContent>The heading stays NSW blue for contrast on the grey.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    // The band fill must resolve to a real (non-transparent) colour — proving the
    // grey-tint band wired up rather than leaving the header on the page background.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="accordion-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="accordion-trigger"].')
    }
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
      throw new Error(`Expected the band fill to resolve, received "${bg}".`)
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the item's hairline `border-t` utility resolves
    // to a real --border colour, and the trigger heading resolves to --primary
    // (NSW brand blue) rather than an unset/transparent value.
    const item = canvasElement.querySelector<HTMLElement>('[data-slot="accordion-item"]')
    if (!item) {
      throw new Error('Could not find [data-slot="accordion-item"].')
    }
    const borderColor = getComputedStyle(item).borderTopColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected the --border token to resolve, received "${borderColor}".`)
    }

    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="accordion-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="accordion-trigger"].')
    }
    const color = getComputedStyle(trigger).color
    if (color === '' || color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
      throw new Error(`Expected the --primary token to resolve, received "${color}".`)
    }
  },
}
