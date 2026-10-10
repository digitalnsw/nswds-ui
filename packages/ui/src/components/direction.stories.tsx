/**
 * DirectionProvider — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/DirectionProvider        → this file: Docs, Default, Playground
 *                                         and one story per docs section
 *   Components/DirectionProvider/Tests  → direction.tests.stories.tsx
 *
 * DirectionProvider supplies the LTR/RTL direction as REACT CONTEXT, read by
 * direction-aware components via useDirection. It renders no DOM element of its
 * own, so it does NOT set `dir` and it does NOT drive CSS: logical properties
 * (`ps-*`, `-ms-*`, `start-*`) and the `rtl:` variant follow the DOM `dir`
 * attribute, which is a separate thing entirely. RTL therefore needs BOTH
 * halves. This is a re-export of the Base UI primitive; we add no styling.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { DirectionProvider, useDirection } from './direction.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

/** Reads the ambient direction and writes it into the DOM so a play() can assert it. */
function DirReadout() {
  const direction = useDirection()
  return <span data-slot='dir-readout'>{direction}</span>
}

/** A box padded on its inline-start side, to show which way the CSS runs. */
function StartPadded() {
  const direction = useDirection()
  return (
    <div className='w-64 rounded-sm bg-foreground/5 py-2 ps-12 ring-1 ring-foreground/10'>
      useDirection() → <code>{direction}</code>
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function ReadingTheDirectionSection() {
  return (
    <ExampleSection
      title='Reading the direction'
      description={
        <>
          Components call <code>useDirection()</code> to read the nearest provider’s value —
          Carousel uses it to swap its arrow keys and scroll engine. With no provider it returns{' '}
          <code>ltr</code>.
        </>
      }
    >
      <Example code={`const direction = useDirection() // 'ltr' | 'rtl'`}>
        <ExampleCell label='direction="ltr"'>
          <DirectionProvider direction='ltr'>
            <code>
              <DirReadout />
            </code>
          </DirectionProvider>
        </ExampleCell>
        <ExampleCell label='direction="rtl"'>
          <DirectionProvider direction='rtl'>
            <code>
              <DirReadout />
            </code>
          </DirectionProvider>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function RightToLeftSection() {
  return (
    <ExampleSection
      title='Right to left'
      description={
        <>
          The provider renders nothing, so it cannot mirror the layout. Set{' '}
          <code>dir=&quot;rtl&quot;</code> on an ancestor — usually <code>&lt;html&gt;</code> — for
          the CSS, and wrap the app in <code>DirectionProvider</code> for the JavaScript. Each box
          below pads its inline-start side.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<html dir="rtl">
  <DirectionProvider direction="rtl">…</DirectionProvider>
</html>`}
      >
        <ExampleCell label='provider only — JS reads rtl, layout stays left to right'>
          <DirectionProvider direction='rtl'>
            <StartPadded />
          </DirectionProvider>
        </ExampleCell>
        <ExampleCell label='dir="rtl" and provider — both halves agree'>
          <div dir='rtl'>
            <DirectionProvider direction='rtl'>
              <StartPadded />
            </DirectionProvider>
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function DirectionDocs() {
  return (
    <DocsPage
      title='DirectionProvider'
      npm={['DirectionProvider', 'useDirection']}
      registry='direction'
      summary={
        <>
          Tells direction-aware components whether the page reads left to right or right to left. It
          is React context only: pair it with a <code>dir</code> attribute, which is what mirrors
          the layout.
        </>
      }
    >
      <DocsUsage
        use={[
          'A service published in a right-to-left language, such as Arabic.',
          'A right-to-left region inside an otherwise left-to-right page.',
          'Building a component whose keyboard behaviour depends on reading direction.',
        ]}
        avoid={[
          'Mirroring the layout alone — set the dir attribute; the provider does not do it.',
          'A single carousel that must run right to left on its own — pass opts.direction to Carousel.',
          'Translating labels — pass translated strings to each component’s label props.',
        ]}
      />
      <ReadingTheDirectionSection />
      <RightToLeftSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/DirectionProvider',
  component: DirectionProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: DirectionDocs },
  },
  args: {
    direction: 'rtl',
    children: <DirReadout />,
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['ltr', 'rtl'],
      description: 'Reading direction supplied to useDirection. Does not set `dir` on the DOM.',
      table: { category: 'Behavior' },
    },
    children: {
      control: false,
      description: 'The subtree that reads the direction.',
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof DirectionProvider>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // useDirection must surface the value set on the surrounding provider.
    const readout = canvasElement.querySelector('[data-slot="dir-readout"]')
    await expect(readout).toBeInTheDocument()
    await expect(readout).toHaveTextContent('rtl')
  },
}

export const Playground: Story = {}

export const ReadingTheDirection: Story = {
  name: 'Reading the direction',
  render: () => <ReadingTheDirectionSection />,
}

export const RightToLeft: Story = { name: 'Right to left', render: () => <RightToLeftSection /> }
