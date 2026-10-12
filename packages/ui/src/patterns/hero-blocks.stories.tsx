/**
 * HeroBlocks — the story set, per docs/reference-storybook-standard.md.
 *
 *   Patterns/HeroBlocks                → this file: Docs, Default, Playground
 *   Patterns/HeroBlocks/Features       → hero-blocks.features.stories.tsx
 *   Patterns/HeroBlocks/Accessibility  → hero-blocks.accessibility.stories.tsx
 *
 * A recorded GROUP (see scripts/check-stories.mjs): the five hero-*.tsx
 * blocks are one family chosen between side by side, so they share one page
 * with a chooser rather than five near-identical pages. Each block is a
 * registry item of its own, built on the published `Hero`, so all five
 * inherit its four surface colours, dark-mode mapping and landmark naming.
 * They are worked examples: copy the source and adapt it.
 *
 * Default and Playground render HeroSplit, the brand band that
 * email.digital.nsw.gov.au opens with; every block takes the same Hero props,
 * and each block is also its own story beside them.
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import type { HeroColor } from '../components/hero.js'

import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleSection,
} from '../components/story-helpers.js'
import { HeroCentred } from './hero-centred.js'
import { HeroFramed } from './hero-framed.js'
import { HeroPanel } from './hero-panel.js'
import { HeroSplit } from './hero-split.js'
import { HeroStatement } from './hero-statement.js'

// Served by Storybook from apps/storybook/public; replace with your own artwork.
const illustration = { src: 'images/hero-illustration.png', alt: '' }
const canvas = { src: 'images/hero-illustration-canvas.png', alt: '' }
const stack = { src: 'images/hero-illustration-stack.png', alt: '' }

const heroColors: HeroColor[] = ['white', 'light', 'tint', 'dark']

/** The chooser's rows: what each block is, and how to install it. */
const blocks = [
  {
    name: 'Split',
    component: 'HeroSplit',
    item: 'hero-split',
    adds: 'The brand band: white on navy, illustration flush to the right edge and full height.',
  },
  {
    name: 'Framed',
    component: 'HeroFramed',
    item: 'hero-framed',
    adds: 'Navy title on white, illustration framed as a rounded picture beside it.',
  },
  {
    name: 'Panel',
    component: 'HeroPanel',
    item: 'hero-panel',
    adds: 'A pale blue panel with the illustration rising from its bottom edge.',
  },
  {
    name: 'Centred',
    component: 'HeroCentred',
    item: 'hero-centred',
    adds: 'Centred text over a shallow full-width strip of the illustration.',
  },
  {
    name: 'Statement',
    component: 'HeroStatement',
    item: 'hero-statement',
    adds: 'Type only: an accent rule, title, description and actions. No illustration.',
  },
] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

export function ChooserSection() {
  return (
    <ExampleSection
      title='Chooser'
      description={
        <>
          The blocks differ in where the illustration sits and which surface they take. Pick by the
          artwork you have and the surface the header above uses. Each block is a registry item of
          its own — install it with <code>npx shadcn@latest add</code> and the item name — and each
          is shown below.
        </>
      }
    >
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-base'>
          <thead>
            <tr className='border-b border-foreground/10'>
              <th scope='col' className='py-3 pe-6 font-semibold'>
                Block
              </th>
              <th scope='col' className='py-3 pe-6 font-semibold'>
                What it is
              </th>
              <th scope='col' className='py-3 font-semibold'>
                Registry item
              </th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.item} className='border-b border-foreground/10 align-top'>
                <th scope='row' className='py-3 pe-6 font-semibold'>
                  {block.name}
                  <code className='block font-normal text-muted-foreground'>{block.component}</code>
                </th>
                <td className='py-3 pe-6 text-muted-foreground'>{block.adds}</td>
                <td className='py-3'>
                  <code className='whitespace-nowrap'>@nswds/{block.item}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ExampleSection>
  )
}

export function SplitSection() {
  return (
    <ExampleSection
      title='Split'
      description={
        <>
          The brand band, as email.digital.nsw.gov.au opens: white text on <code>primary-800</code>{' '}
          with the illustration flush to the right edge, filling the band&apos;s full height. The
          actions take <code>color=&quot;white&quot;</code>, the one Button colour made for this
          surface. On a phone the picture drops under the text, edge to edge.
        </>
      }
    >
      <Example code={`<HeroSplit media={{ src: '/hero.png', alt: '' }} />`} layout='fill'>
        <HeroSplit media={illustration} />
      </Example>
    </ExampleSection>
  )
}

export function FramedSection() {
  return (
    <ExampleSection
      title='Framed'
      description={
        <>
          The quiet opener: navy title on the page&apos;s own white surface, the illustration framed
          as a rounded picture beside it. The default under a white header when the page below is
          white too.
        </>
      }
    >
      <Example code={`<HeroFramed media={{ src: '/hero.png', alt: '' }} />`} layout='fill'>
        <HeroFramed media={canvas} />
      </Example>
    </ExampleSection>
  )
}

export function PanelSection() {
  return (
    <ExampleSection
      title='Panel'
      description={
        <>
          The pale brand panel: <code>primary-200</code> with the illustration rising from the
          bottom edge, top corners rounded, as though the page&apos;s first card had been pulled up
          into the hero. One panel of colour without going to the full brand band.
        </>
      }
    >
      <Example code={`<HeroPanel media={{ src: '/hero.png', alt: '' }} />`} layout='fill'>
        <HeroPanel media={stack} />
      </Example>
    </ExampleSection>
  )
}

export function CentredSection() {
  return (
    <ExampleSection
      title='Centred'
      description={
        <>
          Centred text over a shallow strip of the illustration. The most symmetrical of the five,
          and the one that gives a longer title the most room.
        </>
      }
    >
      <Example code={`<HeroCentred media={{ src: '/hero.png', alt: '' }} />`} layout='fill'>
        <HeroCentred media={illustration} />
      </Example>
    </ExampleSection>
  )
}

export function StatementSection() {
  return (
    <ExampleSection
      title='Statement'
      description={
        <>
          Type only: a short accent rule, the title, the description and the actions. For a service
          with no artwork, or a page where the text is the point.
        </>
      }
    >
      <Example code={`<HeroStatement />`} layout='fill'>
        <HeroStatement />
      </Example>
    </ExampleSection>
  )
}

export function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          Every block takes Hero&apos;s <code>color</code>. Each block ships with the surface it was
          designed for, but any of the four works: the title, description and action colours follow
          the surface. Shown on the statement block, the shortest.
        </>
      }
    >
      <Example code={`<HeroStatement color="tint" />`} layout='fill'>
        <div className='grid gap-6 md:grid-cols-2'>
          {heroColors.map((color) => (
            <div key={color} className='space-y-2'>
              <p className='text-base font-medium text-muted-foreground'>{color}</p>
              <HeroStatement color={color} labelledBy={`colours-${color}-title`} />
            </div>
          ))}
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function HeroBlocksDocs() {
  return (
    <DocsPage
      eyebrow='Pattern'
      title='HeroBlocks'
      summary={
        <>
          Five ready-made openers built on the published Hero, differing in where the illustration
          sits and which surface they take. They ship with sample copy so they render complete on
          arrival: install the one you need from the chooser below, pass your own artwork, then
          replace the samples with your own words.
        </>
      }
    >
      <DocsUsage
        use={[
          'Opening a landing or product page with a complete, accessible band.',
          'One illustration placed the way the NSW Design System recommends.',
          'Seeing which opener fits the header above before committing to one.',
        ]}
        avoid={[
          'A composition the five do not cover — compose Hero from its slots.',
          'A band further down the page — use Section with Container.',
          'A notice at the top of a page — use Callout.',
        ]}
      />
      <ChooserSection />
      <SplitSection />
      <FramedSection />
      <PanelSection />
      <CentredSection />
      <StatementSection />
      <ColoursSection />
      <DocsApi description='Props of HeroSplit. Every block takes the same Hero props — color, container, labelledBy — plus its own content (title, description, actions) and, for the four with artwork, media (src and alt).' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Patterns/HeroBlocks',
  component: HeroSplit,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: HeroBlocksDocs },
  },
  args: {
    media: illustration,
    color: 'dark',
  },
  argTypes: {
    content: {
      control: false,
      description:
        'Title, description and up to two actions. Defaults to sample copy — replace it.',
      table: { category: 'Content' },
    },
    media: {
      control: false,
      description: 'The illustration: src and alt. Empty alt when it decorates the title.',
      table: { category: 'Content' },
    },
    color: {
      control: 'inline-radio',
      options: heroColors,
      description: 'Surface colour. Title, description and action colours follow it.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description: 'Full-bleed, or a centred 1200px column.',
      table: { category: 'Appearance' },
    },
    labelledBy: {
      control: 'text',
      description:
        '`id` given to the title and pointed at by the region. Change it when two heroes share a page.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
    innerClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof HeroSplit>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const hero = canvasElement.querySelector<HTMLElement>('[data-slot="hero"]')
    if (!hero) {
      throw new Error('Could not find an element with [data-slot="hero"].')
    }
    const labelledBy = hero.getAttribute('aria-labelledby')
    if (!labelledBy || !hero.ownerDocument.getElementById(labelledBy)) {
      throw new Error('The hero is not named by its title.')
    }
    if (!hero.querySelector('[data-slot="hero-media"] img')) {
      throw new Error('The split block did not render its illustration.')
    }
  },
}

export const Playground: Story = {}

// One story per block, so each hero is a click away in the sidebar as well
// as a section of the docs page. They take no args: the point of each is the
// combination it ships with.

export const Split: Story = { render: () => <HeroSplit media={illustration} /> }

export const Framed: Story = { render: () => <HeroFramed media={canvas} /> }

export const Panel: Story = { render: () => <HeroPanel media={stack} /> }

export const Centred: Story = { render: () => <HeroCentred media={illustration} /> }

export const Statement: Story = { render: () => <HeroStatement /> }
