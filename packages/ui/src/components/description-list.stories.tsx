/**
 * DescriptionList — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { DescriptionDetails, DescriptionList, DescriptionTerm } from './description-list.js'

const FACTS = [
  { term: 'Version', detail: '2.001' },
  { term: 'Weights', detail: '100–900' },
  { term: 'Styles', detail: 'Roman & italic' },
  { term: 'Licence', detail: 'SIL Open Font License 1.1' },
]

const meta = {
  title: 'Components/Description List',
  component: DescriptionList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'DescriptionList renders term and detail pairs. In the `columns` and `inline` layouts the list places its own children, so each pair must be wrapped in a single element — otherwise the grid places every dt and dd independently and pairs come apart at the wrap point. Wrapping dt/dd groups in a div is valid inside a dl and preserves the list semantics.',
      },
    },
  },
  args: {
    layout: 'stacked',
  },
  argTypes: {
    layout: {
      control: 'inline-radio',
      options: ['stacked', 'columns', 'inline'],
      description: 'How pairs are placed.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true, category: 'Advanced' } },
  },
  render: (args) => (
    <DescriptionList {...args}>
      {FACTS.map(({ term, detail }) => (
        <div key={term}>
          <DescriptionTerm>{term}</DescriptionTerm>
          <DescriptionDetails>{detail}</DescriptionDetails>
        </div>
      ))}
    </DescriptionList>
  ),
} satisfies Meta<typeof DescriptionList>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getList(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="description-list"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="description-list"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const list = getList(canvasElement)

    if (list.tagName !== 'DL') {
      throw new Error(`Expected a <dl> element, received <${list.tagName.toLowerCase()}>.`)
    }

    const terms = list.querySelectorAll('[data-slot="description-term"]')
    const details = list.querySelectorAll('[data-slot="description-details"]')
    if (terms.length !== FACTS.length || details.length !== FACTS.length) {
      throw new Error(
        `Expected ${FACTS.length} term/detail pairs, received ${terms.length}/${details.length}.`,
      )
    }
    if (terms[0]?.tagName !== 'DT' || details[0]?.tagName !== 'DD') {
      throw new Error('Expected terms to render as <dt> and details as <dd>.')
    }
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-10'>
      {(['stacked', 'columns', 'inline'] as const).map((layout) => (
        <section key={layout}>
          <h3 className='mb-3 font-bold text-foreground'>
            <code>layout=&quot;{layout}&quot;</code>
          </h3>
          <DescriptionList layout={layout}>
            {FACTS.map(({ term, detail }) => (
              <div key={term}>
                <DescriptionTerm>{term}</DescriptionTerm>
                <DescriptionDetails>{detail}</DescriptionDetails>
              </div>
            ))}
          </DescriptionList>
        </section>
      ))}
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  args: { layout: 'inline' },
  play: async ({ canvasElement }) => {
    const list = getList(canvasElement)

    if (getComputedStyle(list).display !== 'grid') {
      throw new Error(
        `Expected the inline layout to be a grid, received "${getComputedStyle(list).display}".`,
      )
    }

    // The <dd> default margin-inline-start is 40px in every browser; the reset
    // is what stops the grid layouts indenting every value.
    const detail = list.querySelector<HTMLElement>('[data-slot="description-details"]')
    if (!detail) {
      throw new Error('Could not find a description detail.')
    }
    const marginStart = getComputedStyle(detail).marginInlineStart
    if (marginStart !== '0px') {
      throw new Error(`Expected the <dd> margin reset to apply, received "${marginStart}".`)
    }
  },
}
