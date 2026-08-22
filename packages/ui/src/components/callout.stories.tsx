/**
 * Callout — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Callout } from './callout.js'

const meta = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'Callout marks a passage of page content as informational, confirming, cautionary or dangerous. It is for STATIC content and carries no live-region semantics — `role="alert"` announces on mount, which would interrupt a screen-reader user every time they reached the page. Use Toaster for a message triggered by a user action, or FieldError for inline validation.',
      },
    },
  },
  args: {
    status: 'info',
    title: 'Not seeing it in the font menu?',
    children:
      'Word, PowerPoint and most design tools only read the font list at startup. Quit the application completely and reopen it.',
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'danger'],
      description: 'Message status. Drives the surface, border and glyph.',
      table: { category: 'Appearance' },
    },
    title: {
      control: 'text',
      description: 'Optional bold lead line above the body copy.',
      table: { category: 'Content' },
    },
    icon: {
      control: false,
      description: 'Replaces the status glyph. Pass null to drop it.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true, category: 'Advanced' } },
  },
} satisfies Meta<typeof Callout>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCallout(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="callout"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="callout"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const callout = getCallout(canvasElement)

    const status = callout.getAttribute('data-status')
    if (status !== args.status) {
      throw new Error(`Expected data-status="${args.status}", received "${status}".`)
    }

    // The status glyph must be decorative — status is conveyed by the copy, not
    // by an icon a screen reader would read out as a bare word.
    const icon = callout.querySelector('[data-slot="callout-icon"]')
    if (!icon) {
      throw new Error('Expected a status icon.')
    }
    if (icon.getAttribute('aria-hidden') !== 'true') {
      throw new Error('Expected the status icon to be aria-hidden.')
    }

    // Static content: it must NOT announce itself.
    if (callout.getAttribute('role') === 'alert' || callout.hasAttribute('aria-live')) {
      throw new Error('Callout must not carry live-region semantics.')
    }
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Callout status='info' title='Information'>
        The archive is served from the official upstream release.
      </Callout>
      <Callout status='success' title='Saved'>
        Your changes have been published.
      </Callout>
      <Callout status='warning' title='Check before you continue'>
        This service will be unavailable on Sunday between 2am and 4am.
      </Callout>
      <Callout status='danger' title='We could not process your application'>
        Two required fields are missing. Review them and submit again.
      </Callout>
      <Callout status='info' icon={null}>
        Without a glyph — the surface and border still carry the status.
      </Callout>
    </div>
  ),
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
