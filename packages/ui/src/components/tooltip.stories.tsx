/**
 * Tooltip — a small label shown on hover or focus, on the Base UI tooltip
 * primitive. Wrap one or more tooltips in a single TooltipProvider to share
 * the open delay.
 *
 *   Components/Tooltip        → this file: Docs, Default, Playground and one
 *                               story per docs section
 *   Components/Tooltip/Tests  → tooltip.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { expect, fn, within } from 'storybook/test'

import {
  IconDownload,
  IconFormatBold,
  IconFormatItalic,
  IconFormatUnderlined,
  IconPrint,
} from '../icons/index.js'
import { Button } from './button.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js'

type Side = NonNullable<ComponentProps<typeof TooltipContent>['side']>

const sides: Side[] = ['top', 'bottom', 'left', 'right']

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function PlacementSection() {
  return (
    <ExampleSection
      title='Placement'
      description={
        <>
          <code>side</code> on <code>TooltipContent</code> picks the edge of the trigger the label
          appears on — <code>top</code> by default. It is a preference: Base UI flips it to keep it
          on screen. Hover or focus a button to show its tooltip.
        </>
      }
    >
      <Example code={`<TooltipContent side="right">Download PDF</TooltipContent>`}>
        <TooltipProvider>
          {sides.map((side) => (
            <ExampleCell key={side} label={`side="${side}"`}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant='outline'
                      iconOnly
                      aria-label={`Download PDF (${side})`}
                      leadingVisual={IconDownload}
                    />
                  }
                />
                <TooltipContent side={side}>Download PDF</TooltipContent>
              </Tooltip>
            </ExampleCell>
          ))}
        </TooltipProvider>
      </Example>
    </ExampleSection>
  )
}

const formatting = [
  ['Bold', IconFormatBold],
  ['Italic', IconFormatItalic],
  ['Underline', IconFormatUnderlined],
] as const

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          A toolbar of icon-only buttons, each named with <code>aria-label</code> and shown with a
          tooltip carrying the same words. One <code>TooltipProvider</code> around the toolbar
          shares the delay, so once one tooltip is open the next opens straight away.
        </>
      }
    >
      <Example
        code={`<TooltipProvider>
  <Tooltip>
    <TooltipTrigger render={<Button iconOnly aria-label="Bold" leadingVisual={IconFormatBold} />} />
    <TooltipContent>Bold</TooltipContent>
  </Tooltip>
  …
</TooltipProvider>`}
      >
        <TooltipProvider>
          <div className='flex gap-1 rounded-md p-1 ring-1 ring-foreground/10'>
            {formatting.map(([label, icon]) => (
              <Tooltip key={label}>
                <TooltipTrigger
                  render={
                    <Button variant='ghost' iconOnly aria-label={label} leadingVisual={icon} />
                  }
                />
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function TooltipDocs() {
  return (
    <DocsPage
      title='Tooltip'
      npm={['Tooltip', 'TooltipTrigger', 'TooltipContent', 'TooltipProvider']}
      registry='tooltip'
      summary={
        <>
          A short text label that appears when a reader hovers over or focuses a control — most
          often to name an icon-only button. It never holds anything interactive and never takes
          focus. Base UI owns the timing, positioning and ARIA wiring.
        </>
      }
    >
      <DocsUsage
        use={[
          'Naming an icon-only button for sighted mouse and keyboard readers.',
          'A keyboard shortcut or one-line hint for a control.',
          'Repeating, visually, an aria-label the control already has.',
        ]}
        avoid={[
          'The content has links, buttons or more than a line — use Popover.',
          'A preview of where a link goes — use HoverCard.',
          'Information the reader needs to complete a task — show it on the page.',
        ]}
      />
      <PlacementSection />
      <InContextSection />
      <DocsApi description='Props of the Tooltip root, plus the side set on TooltipContent. Try them live in the Playground story.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * The side is a prop of `TooltipContent`, not of the root the meta documents,
 * so the args type is widened to let the Playground switch it.
 */
type StoryArgs = ComponentProps<typeof Tooltip> & { side?: Side }

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: TooltipDocs },
  },
  args: {
    side: 'top',
    disabled: false,
    onOpenChange: fn(),
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: sides,
      description: 'Set on TooltipContent: the edge of the trigger the label appears on.',
      table: { category: 'Appearance' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the tooltip is open on first render (uncontrolled).',
      table: { category: 'Behavior' },
    },
    open: {
      control: false,
      description: 'Whether the tooltip is open. Pair with onOpenChange to control it.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Stops the tooltip from opening. The trigger itself stays usable.',
      table: { category: 'Behavior' },
    },
    disableHoverablePopup: {
      control: 'boolean',
      description: 'Close the tooltip when the pointer moves from the trigger onto the label.',
      table: { category: 'Behavior' },
    },
    trackCursorAxis: {
      control: 'inline-radio',
      options: ['none', 'x', 'y', 'both'],
      description: 'Make the label follow the cursor along an axis.',
      table: { category: 'Behavior' },
    },
    onOpenChange: {
      description: 'Called when the tooltip opens or closes (logged in the Actions panel).',
      table: { category: 'Events' },
    },
    onOpenChangeComplete: {
      description: 'Called once the open or close transition has finished.',
      table: { category: 'Events' },
    },
    actionsRef: { table: { disable: true } },
    handle: { table: { disable: true } },
    triggerId: { table: { disable: true } },
    defaultTriggerId: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: ({ side, ...args }) => (
    <TooltipProvider>
      <Tooltip {...args}>
        <TooltipTrigger
          render={
            <Button
              variant='outline'
              iconOnly
              aria-label='Print this page'
              leadingVisual={IconPrint}
            />
          }
        />
        <TooltipContent side={side}>Print this page</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The trigger is named on its own; the tooltip only repeats it visually.
    const trigger = within(canvasElement).getByRole('button', { name: 'Print this page' })
    await expect(trigger).toHaveAttribute('data-slot', 'tooltip-trigger')
  },
}

export const Playground: Story = {}

export const Placement: Story = { name: 'Placement', render: () => <PlacementSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
