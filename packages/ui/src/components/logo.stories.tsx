/**
 * Logo — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Logo                → this file: Docs, Default, Playground and
 *                                    one story per docs section
 *   Components/Logo/Tests          → logo.tests.stories.tsx
 *   Components/Logo/Accessibility  → logo.accessibility.stories.tsx
 *
 * Every example shows a pairing the masterbrand sanctions (DESIGN.md, The
 * Fixed-Mark Rule): full colour on light surfaces, full colour reversed on the
 * `-800` brand band. The mono marks are restricted use and need NSW Government
 * Brand Team approval, so they are documented but never shown as an example.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Logo } from './logo.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const sizes = [
  ['h-8', '32px'],
  ['h-12', '48px'],
  ['h-16', '64px'],
  ['h-24', '96px'],
] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          The mark scales to whatever height you give it. Set the height and <code>w-auto</code> so
          the lockup keeps its proportions; 48–64px suits a desktop header.
        </>
      }
    >
      <Example code={`<Logo className="h-12 w-auto" />`}>
        {sizes.map(([className, pixels]) => (
          <ExampleCell key={className} label={`${className} · ${pixels}`}>
            <Logo className={`${className} w-auto`} />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          The mark is painted from fixed brand values, so choose its colourway against the surface
          behind it. Full colour (<code>default</code>) goes on every light surface and turns white
          in dark mode on its own. Full colour reversed (<code>reversed</code>) is for the solid{' '}
          <code>-800</code> brand band. <code>mono-white</code> and <code>mono-black</code> are
          restricted use and need NSW Government Brand Team approval — they are not a default for
          dark surfaces.
        </>
      }
    >
      <Example code={`<Logo className="h-16 w-auto" />`}>
        <ExampleCell label='default'>
          <Logo className='h-16 w-auto' />
        </ExampleCell>
      </Example>
      <Example surface='subtle'>
        <ExampleCell label='default, on a muted section'>
          <Logo className='h-16 w-auto' />
        </ExampleCell>
      </Example>
      <Example surface='brand' code={`<Logo logoType="reversed" className="h-16 w-auto" />`}>
        <ExampleCell label={<span className='text-white'>reversed, on the brand band</span>}>
          <Logo logoType='reversed' className='h-16 w-auto' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function WordmarkSection() {
  return (
    <ExampleSection
      title='Wordmark'
      description={
        <>
          <code>wordmark=&quot;nsw&quot;</code> drops the “Government” row for tight horizontal
          space; Header switches to it on narrow screens. Both lockups are announced as “NSW
          Government”.
        </>
      }
    >
      <Example code={`<Logo wordmark="nsw" className="h-16 w-auto" />`}>
        <ExampleCell label='full (default)'>
          <Logo className='h-16 w-auto' />
        </ExampleCell>
        <ExampleCell label='nsw'>
          <Logo wordmark='nsw' className='h-16 w-auto' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='The reversed mark on a brand band, growing from 32px on a phone to 64px on a wide screen. In a product, Header places the mark for you.'
    >
      <Example layout='fill' surface='brand'>
        <div className='flex items-center gap-6'>
          <Logo logoType='reversed' className='h-8 w-auto md:h-12 lg:h-16' />
          <span className='text-lg font-semibold text-white'>Department of Education</span>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function LogoDocs() {
  return (
    <DocsPage
      title='Logo'
      npm='Logo'
      registry='logo'
      summary={
        <>
          The NSW Government waratah lockup as an inline SVG. The mark does not inherit colour: pick
          its <strong>colourway</strong> to suit the surface behind it — full colour on light
          surfaces, reversed on the brand band.
        </>
      }
    >
      <DocsUsage
        use={[
          'Identifying an NSW Government website, service or product.',
          'A brand band or splash screen that sits outside the page chrome.',
          'A service’s sign-in or landing screen, beside the service name.',
        ]}
        avoid={[
          'The top of a page — use Header, which places and sizes the mark.',
          'The bottom of a page — use Footer, which picks the colourway for its surface.',
          'A decorative flourish or a bullet — use an icon, and keep the mark for identity.',
        ]}
      />
      <SizesSection />
      <ColoursSection />
      <WordmarkSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: LogoDocs },
  },
  args: {
    logoType: 'default',
    wordmark: 'full',
    className: 'h-16 w-auto',
  },
  argTypes: {
    logoType: {
      control: 'inline-radio',
      options: ['default', 'reversed', 'mono-white', 'mono-black'],
      description:
        'Colourway. `default` on light surfaces, `reversed` on the -800 brand band; the mono marks need Brand Team approval.',
      table: { category: 'Appearance' },
    },
    wordmark: {
      control: 'inline-radio',
      options: ['full', 'nsw'],
      description: 'Which rows to draw. `nsw` drops “Government” for tight spaces.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Logo>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    if (!svg) throw new Error('Could not find the Logo svg element in canvas.')
    if (svg.getAttribute('aria-hidden') !== 'true') {
      throw new Error(
        `Expected the Logo svg to have aria-hidden="true", received "${svg.getAttribute(
          'aria-hidden',
        )}".`,
      )
    }

    const srOnly = canvasElement.querySelector<HTMLSpanElement>('span.sr-only')
    if (!srOnly) throw new Error('Could not find the sr-only accessible name span.')
    if (srOnly.textContent !== 'NSW Government') {
      throw new Error(`Expected sr-only text "NSW Government", received "${srOnly.textContent}".`)
    }
  },
}

export const Playground: Story = {}

export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const Wordmark: Story = { name: 'Wordmark', render: () => <WordmarkSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
