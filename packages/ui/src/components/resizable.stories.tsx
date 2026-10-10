/**
 * ResizablePanelGroup — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/ResizablePanelGroup        → this file: Docs, Default,
 *                                           Playground and one story per
 *                                           docs section
 *   Components/ResizablePanelGroup/Tests  → resizable.tests.stories.tsx
 *
 * Panel content is kept short so the panels do not become scrollable regions:
 * react-resizable-panels v4 gives each panel `overflow: auto`, and an
 * overflowing panel would need its own keyboard-focusable scroll container
 * (wrap long content in a ScrollArea).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const frame = 'rounded-md border border-border'
const tintedPanel = 'flex items-center justify-center bg-foreground/5 p-4'
const plainPanel = 'flex items-center justify-center p-4'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function OrientationSection() {
  return (
    <ExampleSection
      title='Orientation'
      description={
        <>
          <code>orientation</code> on the group sets the axis: <code>horizontal</code> panels sit
          side by side and resize across, <code>vertical</code> panels stack and resize up and down.
          Give the group a height either way. Panel sizes written as numbers are pixels; write a
          string such as <code>&quot;50%&quot;</code> for a share of the group.
        </>
      }
    >
      <Example
        layout='grid'
        code={`<ResizablePanelGroup orientation="vertical" className="h-56">
  <ResizablePanel defaultSize='50%'>…</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize='50%'>…</ResizablePanel>
</ResizablePanelGroup>`}
      >
        <ExampleCell label='horizontal'>
          <ResizablePanelGroup orientation='horizontal' className={`h-40 w-72 ${frame}`}>
            <ResizablePanel defaultSize='50%' className={tintedPanel}>
              Map
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize='50%' className={plainPanel}>
              Results
            </ResizablePanel>
          </ResizablePanelGroup>
        </ExampleCell>
        <ExampleCell label='vertical'>
          <ResizablePanelGroup orientation='vertical' className={`h-56 w-72 ${frame}`}>
            <ResizablePanel defaultSize='50%' className={tintedPanel}>
              Map
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize='50%' className={plainPanel}>
              Results
            </ResizablePanel>
          </ResizablePanelGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function HandleSection() {
  return (
    <ExampleSection
      title='Handle'
      description={
        <>
          <code>withHandle</code> adds a grip to the divider so it reads as something to drag.
          Without it the divider is a plain hairline — still draggable, and still reachable with Tab
          and the arrow keys.
        </>
      }
    >
      <Example layout='grid' code={`<ResizableHandle withHandle />`}>
        <ExampleCell label='withHandle'>
          <ResizablePanelGroup orientation='horizontal' className={`h-32 w-72 ${frame}`}>
            <ResizablePanel defaultSize='50%' className={tintedPanel}>
              Map
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize='50%' className={plainPanel}>
              Results
            </ResizablePanel>
          </ResizablePanelGroup>
        </ExampleCell>
        <ExampleCell label='hairline only'>
          <ResizablePanelGroup orientation='horizontal' className={`h-32 w-72 ${frame}`}>
            <ResizablePanel defaultSize='50%' className={tintedPanel}>
              Map
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize='50%' className={plainPanel}>
              Results
            </ResizablePanel>
          </ResizablePanelGroup>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A caseworker’s queue beside the selected case. Dragging the divider trades list width for detail.'
    >
      <Example layout='fill'>
        <ResizablePanelGroup orientation='horizontal' className={`h-56 max-w-2xl ${frame}`}>
          <ResizablePanel defaultSize='40%' minSize='25%' className='space-y-2 p-4'>
            <p className='font-semibold'>Applications</p>
            <p className='text-muted-foreground'>Sam Taylor — new</p>
            <p className='text-muted-foreground'>Priya Shah — in review</p>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize='60%' minSize='30%' className='space-y-2 p-4'>
            <p className='font-semibold'>Priya Shah</p>
            <p className='text-muted-foreground'>Recreational fishing licence, 3 years</p>
            <p className='text-muted-foreground'>Submitted 2 October</p>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ResizableDocs() {
  return (
    <DocsPage
      title='ResizablePanelGroup'
      npm={['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle']}
      registry='resizable'
      summary={
        <>
          Panels separated by a divider people can drag to share the space between them. The divider
          is a focusable separator, so the split can also be changed from the keyboard.
        </>
      }
    >
      <DocsUsage
        use={[
          'A list beside the detail of the selected item, in a staff-facing tool.',
          'A map beside its results, where people want more of one or the other.',
          'An editor beside a live preview.',
        ]}
        avoid={[
          'Public-facing pages — most people never discover a drag handle; lay content out to fit.',
          'Showing or hiding a block of content — use Collapsible or Accordion.',
          'Switching between views of the same content — use Tabs.',
        ]}
      />
      <OrientationSection />
      <HandleSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/ResizablePanelGroup',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ResizableDocs },
  },
  args: {
    orientation: 'horizontal',
    className: `h-48 max-w-md ${frame}`,
    children: [
      <ResizablePanel key='map' defaultSize='50%' className={tintedPanel}>
        Map
      </ResizablePanel>,
      <ResizableHandle key='handle' withHandle />,
      <ResizablePanel key='results' defaultSize='50%' className={plainPanel}>
        Results
      </ResizablePanel>,
    ],
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Axis the panels are laid out and resized along.',
      table: { category: 'Appearance' },
    },
    children: {
      control: false,
      description: 'ResizablePanel elements with a ResizableHandle between each pair.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof ResizablePanelGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="resizable-panel-group"]')
    if (!group) {
      throw new Error('Could not find [data-slot="resizable-panel-group"].')
    }
    const handle = canvasElement.querySelector('[data-slot="resizable-handle"]')
    if (!handle) {
      throw new Error('Could not find [data-slot="resizable-handle"].')
    }
  },
}

export const Playground: Story = {}

export const Orientation: Story = { name: 'Orientation', render: () => <OrientationSection /> }

export const Handle: Story = { name: 'Handle', render: () => <HandleSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
