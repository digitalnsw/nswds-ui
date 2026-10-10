/**
 * Masthead — the "A NSW Government website" strip.
 *
 *   Components/Masthead        → this file: Docs, Default, Playground and one
 *                                story per docs section
 *   Components/Masthead/Tests  → masthead.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'

import { Header, HeaderBrand } from './header.js'
import { Masthead } from './masthead.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

/** The four curated colours, in the order they are declared. */
const MASTHEAD_COLORS = ['dark', 'light', 'white', 'grey'] as const

function getMasthead(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="masthead"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="masthead"].')
  }
  return el
}

/**
 * A labelled full-width specimen. ExampleCell sizes its child to its content,
 * which would shrink a full-bleed strip to the width of its message.
 */
function Strip({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className='space-y-2'>
      <p className='text-base text-muted-foreground'>{label}</p>
      {children}
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Every Masthead on the docs page takes its own id: the component defaults to
// id="nsw-masthead", which is only valid once per page.

function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          Four colours, shared with <code>SkipLinks</code> and <code>Header</code> so one word
          themes the whole top of the page. Every pair is WCAG 2.2 AAA (7:1) in both themes, and
          none is a mid-tone <code>-600</code> step, where the brand mark stops reading. Every
          colour deepens in dark mode, onto the same ramp steps as <code>Header</code>, so the two
          stay flush.
        </>
      }
    >
      <Example layout='fill' code={`<Masthead color="light" />`}>
        <div className='space-y-6'>
          {MASTHEAD_COLORS.map((color) => (
            <Strip key={color} label={color === 'dark' ? 'dark (default)' : color}>
              <Masthead
                id={`masthead-colour-${color}`}
                color={color}
                className='ring-1 ring-foreground/10'
              />
            </Strip>
          ))}
        </div>
      </Example>
      <Example layout='fill' surface='dark'>
        <div className='space-y-6'>
          {MASTHEAD_COLORS.map((color) => (
            <Strip key={color} label={`${color} — dark mode`}>
              <Masthead
                id={`masthead-colour-dark-${color}`}
                color={color}
                className='ring-1 ring-foreground/10'
              />
            </Strip>
          ))}
        </div>
      </Example>
    </ExampleSection>
  )
}

function ContainersSection() {
  return (
    <ExampleSection
      title='Containers'
      description={
        <>
          <code>fluid</code> (the default) runs the message from the page edge;{' '}
          <code>contained</code> centres it in a 1200px column, to line up with a contained{' '}
          <code>Header</code>. Retune either with <code>--masthead-max-width</code> and{' '}
          <code>--masthead-padding-x</code>.
        </>
      }
    >
      <Example layout='fill' code={`<Masthead container="contained" />`}>
        <div className='space-y-6'>
          <Strip label='fluid'>
            <Masthead id='masthead-container-fluid' container='fluid' />
          </Strip>
          <Strip label='contained'>
            <Masthead id='masthead-container-contained' container='contained' />
          </Strip>
          <Strip label='contained, --masthead-max-width: 40rem'>
            <Masthead
              id='masthead-container-custom'
              container='contained'
              style={{ '--masthead-max-width': '40rem' } as React.CSSProperties}
            />
          </Strip>
        </div>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='The masthead sits flush above the Header, themed with the same word. SkipLinks come before both in the DOM.'
    >
      <Example layout='fill'>
        <div className='overflow-hidden ring-1 ring-foreground/10'>
          <Masthead id='masthead-in-context' color='dark' />
          <Header id='masthead-in-context-header' color='dark' sticky={false}>
            <HeaderBrand sitename='Department of Primary Industries' />
          </Header>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function MastheadDocs() {
  return (
    <DocsPage
      title='Masthead'
      npm='Masthead'
      registry='masthead'
      summary={
        <>
          The strip that tells people they are on an official NSW Government website. It sits at the
          very top of every page, directly above the <code>Header</code>, with{' '}
          <code>SkipLinks</code> rendered before it. It carries mandated identification rather than
          content, so it is deliberately quiet.
        </>
      }
    >
      <DocsUsage
        use={[
          'The top of every page on a NSW Government website, rendered once in a shared layout.',
          'Above a Header themed with the same colour word, so the two sit flush.',
          'Leaving the default “A NSW Government website” message as written.',
        ]}
        avoid={[
          'Telling people about a change or an outage — use Callout.',
          'Holding the brand, service name and controls — use Header.',
          'Letting keyboard users jump past repeated blocks — use SkipLinks, rendered before it.',
        ]}
      />
      <ColoursSection />
      <ContainersSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Masthead',
  component: Masthead,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: MastheadDocs },
  },
  args: {
    color: 'dark',
    container: 'fluid',
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: MASTHEAD_COLORS,
      description:
        'WCAG 2.2 AAA text/background pair, shared with SkipLinks and Header. Every colour deepens in dark mode.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description:
        'Inner wrapper layout — fluid is full-bleed, contained centres a 1200px column. Retune with --masthead-max-width and --masthead-padding-x.',
      table: { category: 'Appearance' },
    },
    children: {
      control: 'text',
      description: 'Replaces the default "A NSW Government website" message.',
      table: { category: 'Content' },
    },
    id: {
      control: 'text',
      description: 'Defaults to "nsw-masthead" for shells that target it. Unique per page.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
    containerClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof Masthead>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const masthead = getMasthead(canvasElement)

    if (!masthead.textContent?.includes('A NSW Government website')) {
      throw new Error(
        'Expected the Masthead to render its default "A NSW Government website" message.',
      )
    }

    const container = masthead.querySelector('[data-slot="masthead-container"]')
    if (!container) {
      throw new Error('Expected an inner [data-slot="masthead-container"] wrapper.')
    }
  },
}

export const Playground: Story = {}

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const Containers: Story = { name: 'Containers', render: () => <ContainersSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
