/**
 * Spinner — Tests
 *
 * The two-tone fill check. It stays out of the sidebar (`!dev`) but runs in
 * the Vitest suite. The naming-path stories (custom, suppressed and
 * aria-label override) live in the main file, where they were on main.
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
