/**
 * Separator — Features
 *
 * Orientation, composition patterns, and labelled-separator example. Stories
 * exist to verify the divider renders correctly in the real contexts where
 * it appears (menus, toolbars, sectioned cards) so visual QA can catch
 * spacing or stretch regressions during token or layout refactors.
 *
 * The Separator component has no `variant` or `color` axis, so there is no
 * variant/colour matrix here — instead we cover the orientations and a few
 * representative composition patterns that exercise the data-orientation
 * sizing rules.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Separator } from './separator.js'
import { docsTemplate } from './story-helpers.js'

const meta = {
  title: 'Components/Separator/Features',
  component: Separator,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  name: 'Horizontal',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Default horizontal separator rendered inside a vertically-stacked card.',
          why: 'Confirms the `data-orientation="horizontal"` rule applies `h-px w-full` so the divider stretches to the container width with a single-pixel height.',
          how: 'Inspect the rendered DOM and verify the separator is exactly 1 pixel tall and matches the container width. The `bg-border` token should resolve to the active theme border colour.',
          caveat:
            'A horizontal separator only stretches to the *container* width — if the parent is `inline` or has no explicit width it may collapse.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md space-y-3 rounded-sm border border-border bg-background p-4">
      <p className="text-sm text-foreground">Section one</p>
      <Separator />
      <p className="text-sm text-foreground">Section two</p>
    </div>
  ),
}

export const Vertical: Story = {
  name: 'Vertical',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Vertical separator rendered inside a horizontal flex row.',
          why: 'Confirms the `data-orientation="vertical"` rule applies `w-px self-stretch` so the divider is 1 pixel wide and inherits the row height via `align-items: stretch` (the flex default).',
          how: 'Inspect the rendered DOM and verify the separator is exactly 1 pixel wide and stretches to match the height of its sibling content.',
          caveat:
            '`self-stretch` only takes effect inside a flex or grid parent that allows stretching. Inside a `block` container the separator collapses to zero height.',
        }),
      },
    },
  },
  render: () => (
    <div className="flex h-12 items-stretch gap-3 rounded-sm border border-border bg-background px-4">
      <span className="flex items-center text-sm text-foreground">Home</span>
      <Separator orientation="vertical" />
      <span className="flex items-center text-sm text-foreground">About</span>
      <Separator orientation="vertical" />
      <span className="flex items-center text-sm text-foreground">Contact</span>
    </div>
  ),
}

export const InMenu: Story = {
  name: 'In Menu',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Three menu items stacked vertically and split into groups by horizontal separators.',
          why: 'Menus are the most common host for Separator — grouping destructive actions away from primary actions, or splitting account controls from app settings. Verifying it here catches padding/alignment regressions in the menu context.',
          how: 'Scan the menu top-to-bottom and verify each separator stretches the full inner width of the menu (no inset gap to either edge) and that the surrounding items have consistent vertical rhythm.',
          caveat:
            'A real menu would compose `Separator` inside a Base UI `Menu.Popup` — this story uses a plain container to keep the visual focus on the separator itself.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-56 rounded-sm border border-border bg-background py-1 shadow-sm">
      <button
        type="button"
        className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
      >
        Profile
      </button>
      <button
        type="button"
        className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
      >
        Settings
      </button>
      <Separator />
      <button
        type="button"
        className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
      >
        Help
      </button>
      <button
        type="button"
        className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
      >
        Keyboard shortcuts
      </button>
      <Separator />
      <button
        type="button"
        className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
      >
        Sign out
      </button>
    </div>
  ),
}

export const InToolbar: Story = {
  name: 'In Toolbar',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Horizontal row of toolbar buttons grouped by vertical separators.',
          why: 'Toolbars use vertical separators to chunk related actions (edit vs. format vs. view). This exercises the `self-stretch` rule against an `items-center` parent and verifies the separator still stretches to the row height.',
          how: 'Verify each vertical separator spans the full toolbar height (not just the text x-height) and that the spacing on either side of every separator is even.',
          caveat:
            'The toolbar uses `items-stretch`; switching the parent to `items-center` without an explicit height will collapse the separator.',
        }),
      },
    },
  },
  render: () => (
    <div className="flex h-10 items-stretch gap-1 rounded-sm border border-border bg-background px-2">
      <button
        type="button"
        className="px-2 text-sm text-foreground hover:bg-muted"
      >
        Bold
      </button>
      <button
        type="button"
        className="px-2 text-sm text-foreground hover:bg-muted"
      >
        Italic
      </button>
      <Separator orientation="vertical" />
      <button
        type="button"
        className="px-2 text-sm text-foreground hover:bg-muted"
      >
        Left
      </button>
      <button
        type="button"
        className="px-2 text-sm text-foreground hover:bg-muted"
      >
        Center
      </button>
      <button
        type="button"
        className="px-2 text-sm text-foreground hover:bg-muted"
      >
        Right
      </button>
      <Separator orientation="vertical" />
      <button
        type="button"
        className="px-2 text-sm text-foreground hover:bg-muted"
      >
        Link
      </button>
      <button
        type="button"
        className="px-2 text-sm text-foreground hover:bg-muted"
      >
        Image
      </button>
    </div>
  ),
}

export const WithLabel: Story = {
  name: 'With Label',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Composition example: two horizontal separators flank a centred label, mirroring the "or" divider pattern used between auth providers and email sign-in forms.',
          why: 'Demonstrates that `Separator` composes cleanly with surrounding flex layout — the component itself stays presentational (no built-in label slot) and the label is positioned by the consumer.',
          how: 'Verify the label sits centred between two flexible-width separators, that the line aligns visually with the centreline of the label, and that the spacing on either side of the label is symmetric.',
          caveat:
            'This is a composition pattern, not a separator variant. The `Separator` component intentionally does not ship a labelled API — keeping the primitive small means consumers can position the label however they need.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md space-y-4 rounded-sm border border-border bg-background p-4">
      <p className="text-sm text-foreground">Continue with Google</p>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-muted-foreground uppercase">
          or
        </span>
        <Separator className="flex-1" />
      </div>
      <p className="text-sm text-foreground">Sign in with email</p>
    </div>
  ),
}
