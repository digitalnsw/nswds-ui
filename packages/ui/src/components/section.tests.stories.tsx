/**
 * Section — Tests
 *
 * CSS check: proves globals.css loaded, `spacing="none"` drops the padding and
 * `divider` draws a 1px rule.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from './container.js'
import { Section } from './section.js'

const meta = {
  title: 'Components/Section/Tests',
  component: Section,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Section>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CSS check',
  render: () => (
    <Section spacing='none' divider aria-label='CSS check'>
      <Container>
        <div className='bg-muted p-4 text-foreground'>No padding, one rule below.</div>
      </Container>
    </Section>
  ),
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector<HTMLElement>('[data-slot="section"]')
    if (!section) {
      throw new Error('Could not find an element with [data-slot="section"].')
    }
    const styles = getComputedStyle(section)

    if (styles.paddingTop !== '0px') {
      throw new Error(`Expected no padding for spacing="none", received "${styles.paddingTop}".`)
    }
    // Proves globals.css loaded: `border-b` resolves to a real border width.
    if (styles.borderBottomWidth !== '1px') {
      throw new Error(
        `Expected a 1px bottom border for divider, received "${styles.borderBottomWidth}".`,
      )
    }
  },
}
