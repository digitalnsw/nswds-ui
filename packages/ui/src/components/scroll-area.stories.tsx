/**
 * ScrollArea — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/ScrollArea                → this file: Docs, Default, Playground
 *   Components/ScrollArea/Features       → scroll-area.features.stories.tsx
 *   Components/ScrollArea/Accessibility  → scroll-area.accessibility.stories.tsx
 *   Components/ScrollArea/Tests          → scroll-area.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ScrollArea } from './scroll-area.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const serviceCentres = [
  'Albury',
  'Armidale',
  'Bathurst',
  'Blacktown',
  'Bondi Junction',
  'Broken Hill',
  'Campbelltown',
  'Coffs Harbour',
  'Dubbo',
  'Gosford',
  'Goulburn',
  'Griffith',
  'Haymarket',
  'Lismore',
  'Liverpool',
  'Newcastle',
  'Orange',
  'Parramatta',
  'Penrith',
  'Port Macquarie',
  'Queanbeyan',
  'Tamworth',
  'Wagga Wagga',
  'Wollongong',
]

const documents = [
  'Driver licence',
  'Passport',
  'Birth certificate',
  'Medicare card',
  'Photo card',
  'Utility bill',
  'Bank statement',
  'Rates notice',
]

const frame = 'rounded-md border border-border bg-background'

function CentreList() {
  return (
    <ul className='p-4'>
      {serviceCentres.map((centre) => (
        <li key={centre} className='py-1'>
          {centre}
        </li>
      ))}
    </ul>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

export function ScrollDirectionSection() {
  return (
    <ExampleSection
      title='Scroll direction'
      description={
        <>
          Give the area a fixed height to scroll vertically; the styled scrollbar appears along the
          inline end. Content wider than the area scrolls horizontally with the native gesture,
          trackpad or Shift and the scroll wheel.
        </>
      }
    >
      <Example
        code={`<ScrollArea className="h-48 w-64 rounded-md border">
  <ul>…</ul>
</ScrollArea>`}
      >
        <ExampleCell label='vertical'>
          <ScrollArea className={`h-48 w-64 ${frame}`}>
            <CentreList />
          </ScrollArea>
        </ExampleCell>
        <ExampleCell label='horizontal'>
          <ScrollArea className={`w-64 ${frame}`}>
            <ul className='flex gap-3 p-4'>
              {documents.map((document) => (
                <li
                  key={document}
                  className='flex h-20 w-32 shrink-0 items-center justify-center rounded-sm bg-foreground/10 p-2 text-center'
                >
                  {document}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function KeyboardSection() {
  return (
    <ExampleSection
      title='Keyboard'
      description={
        <>
          While its content overflows, the viewport is a Tab stop: focus it and the arrow keys, Page
          Up / Page Down and Space scroll it, with a ring to show where focus is. When everything
          fits, it drops out of the tab order so keyboard users are not stopped on a box with
          nothing to scroll.
        </>
      }
    >
      <Example code={`<ScrollArea className="h-48">…</ScrollArea>`}>
        <ExampleCell label='overflows — a Tab stop'>
          <ScrollArea className={`h-40 w-56 ${frame}`}>
            <CentreList />
          </ScrollArea>
        </ExampleCell>
        <ExampleCell label='fits — skipped'>
          <ScrollArea className={`h-40 w-56 ${frame}`}>
            <ul className='p-4'>
              <li>Albury</li>
              <li>Armidale</li>
            </ul>
          </ScrollArea>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Terms a person must read before they agree, held to a fixed height so the confirmation stays in view. Native scrolling and keyboard behaviour are untouched; only the scrollbar is restyled.'
    >
      <Example
        layout='fill'
        code={`<p>Terms and conditions</p>
<ScrollArea className="h-56 rounded-md border">
  <div className="p-4">…</div>
</ScrollArea>`}
      >
        <div className='max-w-md space-y-3'>
          <p className='font-semibold'>Terms and conditions</p>
          <ScrollArea className={`h-56 ${frame}`}>
            <div className='space-y-4 p-4 text-base/relaxed'>
              <p>
                By submitting this application you declare that the information you have provided is
                true and correct.
              </p>
              <p>
                Service NSW will use your personal information to process your application and may
                share it with the agency responsible for the licence.
              </p>
              <p>
                You must tell us within 14 days if your contact details or circumstances change
                while your application is being assessed.
              </p>
              <p>
                Giving false or misleading information is an offence and may result in your
                application being refused or your licence being cancelled.
              </p>
            </div>
          </ScrollArea>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ScrollAreaDocs() {
  return (
    <DocsPage
      title='ScrollArea'
      npm={['ScrollArea', 'ScrollBar']}
      registry='scroll-area'
      summary={
        <>
          A fixed-size region whose content scrolls, with a slim scrollbar that matches the system.
          Scrolling, touch and keyboard behaviour stay native; only the{' '}
          <strong>scrollbar chrome</strong> changes.
        </>
      }
    >
      <DocsUsage
        use={[
          'Long content inside a fixed-height panel, such as terms before a confirmation.',
          'A long list inside a popover, menu or side panel.',
          'A row of items wider than its container.',
        ]}
        avoid={[
          'The page itself — let the page scroll.',
          'A wide data table — use Table, which scrolls its own overflow.',
          'Content a person can expand when they need it — use Accordion or Collapsible.',
        ]}
      />
      <ScrollDirectionSection />
      <KeyboardSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ScrollAreaDocs },
  },
  args: {
    className: `h-48 w-64 ${frame}`,
    children: <CentreList />,
  },
  argTypes: {
    children: {
      control: false,
      description: 'The content that scrolls.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="scroll-area"]')
    if (!root) throw new Error('Could not find [data-slot="scroll-area"].')
    const viewport = canvasElement.querySelector('[data-slot="scroll-area-viewport"]')
    if (!viewport) {
      throw new Error('Could not find [data-slot="scroll-area-viewport"].')
    }
  },
}

export const Playground: Story = {}
