/**
 * Spinner — Tests
 *
 * Stories that prove the naming paths and the two-tone fill rather than show
 * them. They stay out of the sidebar (`!dev`) but run in the Vitest suite.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Spinner } from './spinner.js'

const meta = {
  title: 'Components/Spinner/Tests',
  component: Spinner,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
  args: {
    size: 'md',
    color: 'primary',
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const CustomLabel: Story = {
  name: 'Custom label',
  args: { label: 'Loading results' },
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('[role="status"]')
    if (!status) {
      throw new Error('Could not find element with role="status".')
    }
    if (status.textContent?.trim() !== 'Loading results') {
      throw new Error(
        `Expected the label prop to drive the accessible name, received "${status.textContent?.trim()}".`,
      )
    }
  },
}

export const SuppressedLabel: Story = {
  name: 'Suppressed label',
  // `label=""` is the documented escape hatch for a Spinner whose busy state is
  // already conveyed by its surroundings (a Button's aria-busy, a toast). It
  // must drop role="status" entirely — an empty live region is redundant noise,
  // not a silent one.
  args: { label: '' },
  play: async ({ canvasElement }) => {
    if (canvasElement.querySelector('[role="status"]')) {
      throw new Error(
        'label="" must suppress role="status" rather than leave an empty live region.',
      )
    }
    if (canvasElement.querySelector('.sr-only')) {
      throw new Error('label="" must render no sr-only text.')
    }
  },
}

export const AriaLabelOverride: Story = {
  name: 'aria-label override',
  // Supplying aria-label is still supported — it wins over the contents for the
  // accessible name. Asserted as an OVERRIDE of the default path above, not as
  // the component's naming requirement.
  args: { 'aria-label': 'Loading search results' },
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('[role="status"]')
    if (!status) {
      throw new Error('Could not find element with role="status".')
    }
    if (status.getAttribute('aria-label') !== 'Loading search results') {
      throw new Error(
        `Expected the aria-label override to reach the DOM, received "${status.getAttribute('aria-label')}".`,
      )
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS check — two-tone fill',
  args: { size: 'xl', color: 'primary' },
  /**
   * Pins the two-tone rendering, which nothing previously asserted.
   *
   * The track and the arc take their colour by different routes: the track's
   * `fill="currentColor"` resolves against the `text-*` utility, while the arc
   * carries no `fill` of its own and inherits the `fill-*` utility set on the
   * <svg>. Both are checked against their source property here, so the two
   * tones cannot silently collapse into one.
   */
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    if (!svg) {
      throw new Error('Could not find the spinner svg.')
    }
    const paths = svg.querySelectorAll('path')
    if (paths.length !== 2) {
      throw new Error(`Expected 2 paths (track + arc), found ${paths.length}.`)
    }

    const svgStyles = getComputedStyle(svg)
    const track = getComputedStyle(paths[0]!).fill
    const arc = getComputedStyle(paths[1]!).fill

    for (const [name, value] of [
      ['track', track],
      ['arc', arc],
    ] as const) {
      if (!value || value === 'none' || value === 'rgba(0, 0, 0, 0)') {
        throw new Error(`Expected the ${name} to paint a colour, got "${value}".`)
      }
    }

    if (track === arc) {
      throw new Error(
        `Expected a two-tone spinner, but the track and arc resolved to the same colour ("${track}").`,
      )
    }

    // The track follows `color` (via currentColor)…
    if (track !== svgStyles.color) {
      throw new Error(
        `Expected the track to resolve from the text-* utility (${svgStyles.color}), got "${track}".`,
      )
    }
    // …and the arc follows the fill-* utility set on the svg.
    if (arc !== svgStyles.fill) {
      throw new Error(
        `Expected the arc to inherit the fill-* utility (${svgStyles.fill}), got "${arc}".`,
      )
    }
  },
}
