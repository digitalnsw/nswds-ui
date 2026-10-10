/**
 * DirectionProvider — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/DirectionProvider                → this file: Docs, Default, Playground
 *   Components/DirectionProvider/Features       → direction.features.stories.tsx
 *   Components/DirectionProvider/Accessibility  → direction.accessibility.stories.tsx
 *   Components/DirectionProvider/Tests          → direction.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js'

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

export function ReadingTheDirectionSection() {
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

export function RightToLeftSection() {
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

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          Licence information in Arabic, one of the community languages NSW Government services
          publish in. <code>dir=&quot;rtl&quot;</code> mirrors the bar so the first tab sits on the
          right; the provider tells Tabs to swap its arrow keys to match, so Left moves to the next
          tab.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<div dir="rtl" lang="ar">
  <DirectionProvider direction="rtl">
    <Tabs defaultValue="eligibility">…</Tabs>
  </DirectionProvider>
</div>`}
      >
        <div dir='rtl' lang='ar' className='max-w-xl'>
          <DirectionProvider direction='rtl'>
            <Tabs defaultValue='eligibility'>
              <TabsList variant='line'>
                <TabsTrigger value='eligibility'>الأهلية</TabsTrigger>
                <TabsTrigger value='apply'>كيفية التقديم</TabsTrigger>
                <TabsTrigger value='fees'>الرسوم</TabsTrigger>
              </TabsList>
              <TabsContent value='eligibility' className='pt-2 text-base'>
                يجب أن يكون عمرك 18 عامًا أو أكثر وأن تقيم في نيو ساوث ويلز.
              </TabsContent>
              <TabsContent value='apply' className='pt-2 text-base'>
                قدّم طلبك عبر الإنترنت.
              </TabsContent>
              <TabsContent value='fees' className='pt-2 text-base'>
                تعتمد الرسوم على مدة الترخيص.
              </TabsContent>
            </Tabs>
          </DirectionProvider>
        </div>
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
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/DirectionProvider',
  component: DirectionProvider,
  tags: ['autodocs'],
  excludeStories: /Section$/,
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
