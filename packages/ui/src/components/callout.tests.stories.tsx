/**
 * Callout — Tests
 *
 * Stories that prove something rather than show it: the token CSS check and
 * the Alert alias. They stay out of the sidebar (`!dev`) but run in the
 * Vitest suite.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert, alertVariants, Callout, calloutVariants } from './callout.js'

const meta = {
  title: 'Components/Callout/Tests',
  component: Callout,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
  args: {
    status: 'info',
    title: 'Not seeing it in the font menu?',
    children:
      'Word, PowerPoint and most design tools only read the font list at startup. Quit the application completely and reopen it.',
  },
} satisfies Meta<typeof Callout>

export default meta

type Story = StoryObj<typeof meta>

function getCallout(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="callout"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="callout"].')
  }
  return el
}

export const CssCheck: Story = {
  name: 'CssCheck',
  args: { status: 'danger', title: 'CSS check' },
  play: async ({ canvasElement }) => {
    const callout = getCallout(canvasElement)
    const background = getComputedStyle(callout).backgroundColor

    // Proves globals.css loaded AND that the @nswds/tokens semantic role tokens
    // resolved — an unresolved var() would leave the background transparent.
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(
        `Expected the danger surface token to resolve to a colour, received "${background}".`,
      )
    }
  },
}

/**
 * `Alert` is `Callout` under shadcn's name — the same component, not a copy
 * that could drift. Pins both halves of the alias: the component renders a
 * callout, and the variants function is the same one.
 */
export const AlertAlias: Story = {
  name: 'Alert alias',
  render: () => (
    <Alert status='warning' title='Check before you continue'>
      This service will be unavailable on Sunday between 2am and 4am.
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const callout = getCallout(canvasElement)
    if (callout.getAttribute('data-status') !== 'warning') {
      throw new Error('Expected <Alert status="warning"> to render a warning callout.')
    }
    if (Alert !== Callout || alertVariants !== calloutVariants) {
      throw new Error('Alert and alertVariants must be the Callout exports, not copies.')
    }
  },
}
