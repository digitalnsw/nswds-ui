/**
 * DescriptionList — Tests
 *
 * Stories that prove something rather than show it. They stay out of the
 * sidebar (`!dev`) but run in the Vitest suite.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { DescriptionDetails, DescriptionList, DescriptionTerm } from './description-list.js'
import { expectNullVariantsMatchDefault, queryVariantPair } from './story-helpers.js'

const FACTS = [
  { term: 'Version', detail: '2.001' },
  { term: 'Weights', detail: '100–900' },
  { term: 'Styles', detail: 'Roman & italic' },
  { term: 'Licence', detail: 'SIL Open Font License 1.1' },
]

const meta = {
  title: 'Components/DescriptionList/Tests',
  component: DescriptionList,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
  args: {
    layout: 'stacked',
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

function getList(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="description-list"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="description-list"].')
  }
  return el
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

/**
 * The null spelling must render as the default (see `expectNullVariantsMatchDefault`).
 * `layout` has no native attribute to collide with.
 */
export const NullVariantsAreTheDefaults: Story = {
  name: 'Null variants are the defaults',
  render: (args) => (
    <div className='space-y-4'>
      <DescriptionList {...args} layout={undefined}>
        {FACTS.map(({ term, detail }) => (
          <div key={term}>
            <DescriptionTerm>{term}</DescriptionTerm>
            <DescriptionDetails>{detail}</DescriptionDetails>
          </div>
        ))}
      </DescriptionList>
      <DescriptionList {...args} layout={null}>
        {FACTS.map(({ term, detail }) => (
          <div key={term}>
            <DescriptionTerm>{term}</DescriptionTerm>
            <DescriptionDetails>{detail}</DescriptionDetails>
          </div>
        ))}
      </DescriptionList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [byDefault, byNull] = queryVariantPair(canvasElement, 'description-list')
    expectNullVariantsMatchDefault(byDefault, byNull, {
      attrs: { layout: 'stacked' },
      sentinelClass: 'flex',
      style: ['display'],
    })
  },
}

/**
 * The resolved `data-layout` is written after the props spread, so a
 * consumer's own `data-layout` cannot advertise a layout the classes do not
 * paint.
 */
export const ConsumerDataAttributeCannotDesync: Story = {
  name: 'Consumer data attribute cannot desync',
  render: (args) => <DescriptionList {...args} data-layout='inline' />,
  play: async ({ canvasElement }) => {
    const list = getList(canvasElement)
    if (list.dataset.layout !== 'stacked' || !list.classList.contains('flex')) {
      throw new Error(
        `Expected the resolved layout to win over a consumer data-layout, got data-layout="${list.dataset.layout}" with "${list.className}".`,
      )
    }
  },
}
