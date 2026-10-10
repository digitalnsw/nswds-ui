/**
 * Logo — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Logo                → this file: Docs, Default, Playground
 *   Components/Logo/Features       → logo.features.stories.tsx
 *   Components/Logo/Accessibility  → logo.accessibility.stories.tsx
 *   Components/Logo/Tests          → logo.tests.stories.tsx (hidden)
 *
 * Every example follows DESIGN.md's Fixed-Mark Rule: full colour on light
 * surfaces, full colour reversed on the `-800` brand band, and the mono marks
 * only under "Restricted use", labelled as needing NSW Government Brand Team
 * approval — mono-white on the `-600` surface Footer falls back to it on.
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
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

// The solid -800 brand band the reversed mark is sanctioned on, deepening to
// -950 in dark mode with the rest of the band family (AGENTS.md §3).
const band = 'bg-primary-800 dark:bg-primary-950'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story. Default,
// Variants and Accessible name are the sections this page has always had, in
// their order.

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
      description={
        <>
          Full colour — blue wordmark, red waratah — is the preferred mark and the out-of-the-box{' '}
          <code>logoType</code>. It goes on every light surface, and turns white in dark mode on its
          own.
        </>
      }
    >
      <Example code={`<Logo className="h-16 w-auto" />`}>
        <Logo className='h-16 w-auto' />
      </Example>
    </ExampleSection>
  )
}

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          The mark is painted from fixed brand values and never inherits a colour, so choose the{' '}
          <code>logoType</code> against the surface behind it, in the masterbrand’s order of
          preference: full colour first, full colour reversed where full colour is illegible, and
          mono only as a last resort.
        </>
      }
    >
      <div className='space-y-10'>
        <div className='space-y-4'>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold'>Sanctioned</h3>
            <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
              <code>default</code> on every light surface, including a muted section.{' '}
              <code>reversed</code> — white wordmark, red waratah — on the solid <code>-800</code>{' '}
              brand band, where the blue wordmark would vanish into its own colour.
            </p>
          </div>
          <Example code={`<Logo className="h-16 w-auto" />`}>
            <ExampleCell label='default'>
              <Logo logoType='default' className='h-16 w-auto' />
            </ExampleCell>
          </Example>
          <Example
            surface='brand'
            className={band}
            code={`<Logo logoType="reversed" className="h-16 w-auto" />`}
          >
            <ExampleCell label='reversed, on the -800 brand band'>
              <Logo logoType='reversed' className='h-16 w-auto' />
            </ExampleCell>
          </Example>
        </div>

        <div className='space-y-4'>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold'>Restricted use</h3>
            <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
              The mono marks are restricted use only and need NSW Government Brand Team approval
              before they are used — never a default for dark surfaces. <code>mono-white</code> is
              for the mid-tone <code>-600</code> surfaces, where neither sanctioned mark keeps its
              waratah; Footer falls back to it there and warns in development.{' '}
              <code>mono-black</code> is the one-colour black mark; no surface in this system
              selects it.
            </p>
          </div>
          <Example
            code={`// Only with NSW Government Brand Team approval
<Logo logoType="mono-white" className="h-16 w-auto" />`}
          >
            <ExampleCell label='mono-white, on a -600 surface · restricted'>
              <div className='rounded-md bg-primary-600 p-4'>
                <Logo logoType='mono-white' className='h-16 w-auto' />
              </div>
            </ExampleCell>
            <ExampleCell label='mono-black · restricted'>
              <div className='rounded-md bg-background p-4 ring-1 ring-foreground/10'>
                <Logo logoType='mono-black' className='h-16 w-auto' />
              </div>
            </ExampleCell>
          </Example>
        </div>
      </div>
    </ExampleSection>
  )
}

const sizes = [
  ['h-8', '32px'],
  ['h-12', '48px'],
  ['h-16', '64px'],
  ['h-24', '96px'],
] as const

export function SizesSection() {
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

export function WordmarkSection() {
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

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='The reversed mark on the brand band, growing from 32px on a phone to 64px on a wide screen. In a product, Header places the mark for you.'
    >
      <Example
        layout='fill'
        surface='brand'
        className={band}
        code={`<div className="flex items-center gap-6 bg-primary-800">
  <Logo logoType="reversed" className="h-8 w-auto md:h-12 lg:h-16" />
  <span>Department of Education</span>
</div>`}
      >
        <div className='flex items-center gap-6'>
          <Logo logoType='reversed' className='h-8 w-auto md:h-12 lg:h-16' />
          <span className='text-lg font-semibold text-white'>Department of Education</span>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function AccessibleNameSection() {
  return (
    <ExampleSection
      title='Accessible name'
      description={
        <>
          The Logo renders a visually hidden &quot;NSW Government&quot; label immediately before the
          SVG so screen readers announce the mark by name. The SVG itself is decorative (
          <code>aria-hidden=&quot;true&quot;</code>) so assistive tech is not read the path data.
        </>
      }
    >
      <Example
        code={`<!-- What <Logo /> renders -->
<span class="sr-only">NSW Government</span>
<svg viewBox="0 0 259 280" aria-hidden="true">…</svg>`}
      >
        <ExampleCell label='announced as “NSW Government”'>
          <Logo className='h-16 w-auto' />
        </ExampleCell>
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
          The NSW Government waratah lockup. Use it as the primary brand mark on agency websites,
          applications, and digital products. Choose the variant that gives the strongest contrast
          against the surface behind the mark.
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
      <DefaultSection />
      <VariantsSection />
      <SizesSection />
      <WordmarkSection />
      <InContextSection />
      <AccessibleNameSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  excludeStories: /Section$/,
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

export const Playground: Story = {
  render: (args) => {
    // Each colourway on the surface it is chosen for (the Fixed-Mark Rule):
    // reversed on the -800 band, the restricted mono-white on a -600 surface.
    const surface =
      args.logoType === 'reversed'
        ? 'bg-primary-800 dark:bg-primary-950'
        : args.logoType === 'mono-white'
          ? 'bg-primary-600'
          : 'bg-background ring-1 ring-foreground/10'
    return (
      <div className={`w-full max-w-xl rounded-md p-6 ${surface}`}>
        <Logo {...args} />
      </div>
    )
  },
}
