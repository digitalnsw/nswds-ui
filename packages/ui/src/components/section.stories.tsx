/**
 * Section — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from './container.js'
import { Section } from './section.js'

const meta = {
  title: 'Components/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'Section is a top-level page section with the house vertical rhythm. Passing `labelledBy` (pointing at its own heading) is what exposes it as a named `region` landmark — a section with no accessible name is a generic container in the accessibility tree, so no fallback name is invented for you.',
      },
    },
  },
  args: {
    spacing: 'default',
    divider: false,
  },
  argTypes: {
    spacing: {
      control: 'inline-radio',
      options: ['default', 'tight', 'loose', 'none'],
      description: 'Vertical rhythm step.',
      table: { category: 'Appearance' },
    },
    divider: {
      control: 'boolean',
      description: 'Hairline rule along the bottom edge.',
      table: { category: 'Appearance' },
    },
    labelledBy: {
      control: 'text',
      description: 'id of the heading naming this section. Required for it to be a landmark.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true, category: 'Advanced' } },
  },
  render: (args) => (
    <Section {...args} labelledBy='demo-heading'>
      <Container>
        <h2 id='demo-heading' className='text-2xl font-bold text-foreground'>
          Nine weights, one file
        </h2>
        <p className='mt-3 text-muted-foreground'>
          The space above and below this block is the section’s rhythm.
        </p>
      </Container>
    </Section>
  ),
} satisfies Meta<typeof Section>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSection(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="section"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="section"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const section = getSection(canvasElement)

    if (section.tagName !== 'SECTION') {
      throw new Error(`Expected a <section> element, received <${section.tagName.toLowerCase()}>.`)
    }

    // The naming contract: aria-labelledby must resolve to a real element, or
    // the section is not a landmark at all.
    const labelledBy = section.getAttribute('aria-labelledby')
    if (labelledBy !== 'demo-heading') {
      throw new Error(`Expected aria-labelledby="demo-heading", received "${labelledBy}".`)
    }
    if (!section.ownerDocument.getElementById('demo-heading')) {
      throw new Error('aria-labelledby points at an element that does not exist.')
    }
  },
}

export const Variants: Story = {
  render: () => (
    <>
      {(['tight', 'default', 'loose'] as const).map((spacing) => (
        <Section key={spacing} spacing={spacing} divider aria-label={`${spacing} spacing`}>
          <Container>
            <div className='bg-muted p-4 text-foreground'>
              <code>spacing=&quot;{spacing}&quot;</code>
            </div>
          </Container>
        </Section>
      ))}
    </>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  render: () => (
    <Section spacing='none' divider aria-label='CSS check'>
      <Container>
        <div className='bg-muted p-4 text-foreground'>No padding, one rule below.</div>
      </Container>
    </Section>
  ),
  play: async ({ canvasElement }) => {
    const section = getSection(canvasElement)
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
