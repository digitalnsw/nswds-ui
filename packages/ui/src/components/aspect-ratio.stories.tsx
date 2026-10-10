/**
 * AspectRatio — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/AspectRatio        → this file: Docs, Default, Playground and
 *                                   one story per docs section
 *   Components/AspectRatio/Tests  → aspect-ratio.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

import { AspectRatio } from './aspect-ratio.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const ratios = [
  ['16 / 9', 16 / 9],
  ['4 / 3', 4 / 3],
  ['1 / 1', 1],
] as const

/** Stands in for an image or video: fills the box the ratio draws. */
function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className='flex size-full items-center justify-center rounded-md bg-foreground/10 text-base text-muted-foreground'>
      {children}
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function RatiosSection() {
  return (
    <ExampleSection
      title='Ratios'
      description={
        <>
          <code>ratio</code> is width divided by height — write it as a fraction, such as{' '}
          <code>16 / 9</code>. The box takes the width of its container and the height follows, so
          the child fills a frame that never changes shape.
        </>
      }
    >
      <Example code={`<AspectRatio ratio={4 / 3}>…</AspectRatio>`}>
        {ratios.map(([label, ratio]) => (
          <ExampleCell key={label} label={label}>
            <AspectRatio ratio={ratio} className='w-48'>
              <Placeholder>{label}</Placeholder>
            </AspectRatio>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A 16:9 frame holds a video’s place before it loads, so the text below it does not jump when it arrives.'
    >
      <Example layout='fill'>
        <div className='max-w-md space-y-3'>
          <AspectRatio ratio={16 / 9}>
            <Placeholder>Video</Placeholder>
          </AspectRatio>
          <p className='font-semibold'>How to apply for a Working with Children Check</p>
          <p className='text-muted-foreground'>3 minutes · Office of the Children’s Guardian</p>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function AspectRatioDocs() {
  return (
    <DocsPage
      title='AspectRatio'
      npm='AspectRatio'
      registry='aspect-ratio'
      summary={
        <>
          A box that keeps a fixed width-to-height <strong>ratio</strong> as its width changes. Put
          an image, video or map inside and it fills the frame.
        </>
      }
    >
      <DocsUsage
        use={[
          'Reserving space for an image or video so the page does not shift as it loads.',
          'Embedding a map or video player that must keep its shape across screen sizes.',
          'A row of thumbnails that should all be the same shape.',
        ]}
        avoid={[
          'A card that promotes a page with an image — use LinkCard.',
          'A placeholder while content loads — use Skeleton.',
          'Fixed-size media that never resizes — set the width and height directly.',
        ]}
      />
      <RatiosSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: AspectRatioDocs },
  },
  args: {
    ratio: 16 / 9,
    className: 'max-w-sm',
    children: <Placeholder>16 / 9</Placeholder>,
  },
  argTypes: {
    ratio: {
      control: { type: 'number', step: 0.1 },
      description: 'Width divided by height, e.g. `16 / 9` ≈ 1.78.',
      table: { category: 'Appearance' },
    },
    children: {
      control: false,
      description: 'The content that fills the box — usually an image or video.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="aspect-ratio"]')
    if (!root) throw new Error('Could not find [data-slot="aspect-ratio"].')
    const ratio = getComputedStyle(root).aspectRatio
    if (!ratio || ratio === 'auto') {
      throw new Error(`Expected an aspect-ratio to be set, got "${ratio}".`)
    }
  },
}

export const Playground: Story = {}

export const Ratios: Story = { name: 'Ratios', render: () => <RatiosSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
