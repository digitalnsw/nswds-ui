/**
 * Toaster — Tests
 *
 * The CSS check, and the contract that every prop Toaster sets a default for
 * (className, style, icons, toastOptions) is merged with a consumer's value
 * rather than replaced — above all the `style` token bridge. Hidden from the
 * sidebar; they run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'

import { Toaster } from './sonner.js'

// A raw trigger painted with the semantic --primary token, which CssCheck reads.
const triggerClasses =
  'rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground'

const meta = {
  title: 'Components/Toaster/Tests',
  component: Toaster,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
  render: (args) => (
    <div>
      <Toaster {...args} />
      <button
        type='button'
        data-slot='sonner-demo-trigger'
        className={triggerClasses}
        onClick={() =>
          toast.success('Appointment booked', {
            description: 'Tuesday 14 October at 10.30am',
          })
        }
      >
        Show toast
      </button>
    </div>
  ),
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the demo trigger resolves the semantic
    // --primary token to a real, non-transparent colour.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="sonner-demo-trigger"]')
    if (!trigger) throw new Error('Sonner demo trigger not found.')
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --primary token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

export const ConsumerPropsMerge: Story = {
  name: 'Consumer props merge',
  /**
   * The Toaster sets defaults for `className`, `style`, `icons` and
   * `toastOptions`. Every one of them is MERGED with a consumer's value, not
   * replaced.
   *
   * This matters most for `style`. The token bridge is four custom properties —
   * three `--normal-*` colour variables plus `--border-radius` — which are
   * sonner's own theming API, are set nowhere else (none of them appears in the
   * compiled stylesheet), and so are the single point at which NSW tokens reach
   * a toast. Under the previous `{...props}`-last spread, a consumer passing
   * `style` for any unrelated reason discarded the whole set and silently
   * dropped every toast back to sonner's built-in palette.
   */
  render: () => (
    <div>
      <Toaster className='consumer-class' style={{ zIndex: 99 }} />
      <button
        data-slot='sonner-demo-trigger'
        className={triggerClasses}
        onClick={() => toast.success('Saved successfully')}
      >
        Show a toast
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // sonner creates the [data-sonner-toaster] list lazily — the mounted
    // Toaster renders only an empty <section> wrapper until the first toast
    // exists, and className/style land on the list, not the wrapper. So fire
    // one and wait for it.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="sonner-demo-trigger"]')
    if (!trigger) {
      throw new Error('Could not find the demo toast trigger.')
    }
    trigger.click()

    const deadline = Date.now() + 2000
    let host = canvasElement.querySelector<HTMLElement>('[data-sonner-toaster]')
    while (!host && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 16))
      host = canvasElement.querySelector<HTMLElement>('[data-sonner-toaster]')
    }
    if (!host) {
      throw new Error('Toast fired but [data-sonner-toaster] never appeared.')
    }

    // The consumer's own value arrives…
    if (host.style.zIndex !== '99') {
      throw new Error(`Expected the consumer's style to apply, got z-index "${host.style.zIndex}".`)
    }
    // …without displacing the token bridge.
    for (const token of ['--normal-bg', '--normal-text', '--normal-border', '--border-radius']) {
      if (!host.style.getPropertyValue(token)) {
        throw new Error(
          `Consumer style displaced ${token} — toasts would fall back to sonner's own palette.`,
        )
      }
    }

    // Same contract for className: ours and theirs, not theirs alone.
    for (const cls of ['toaster', 'consumer-class']) {
      if (!host.classList.contains(cls)) {
        throw new Error(`Expected the host to keep the "${cls}" class, got "${host.className}".`)
      }
    }
  },
}
