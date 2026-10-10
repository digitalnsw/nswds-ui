/**
 * Skeleton — a placeholder block shaped like the content that will replace it.
 *
 *   Components/Skeleton                → this file: Docs, Default, Playground
 *   Components/Skeleton/Features       → skeleton.features.stories.tsx
 *   Components/Skeleton/Accessibility  → skeleton.accessibility.stories.tsx
 *   Components/Skeleton/Tests          → skeleton.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Skeleton } from './skeleton.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const looks = ['default', 'band', 'rule'] as const

const lookDocs: ReadonlyArray<readonly [(typeof looks)[number], string]> = [
  ['default', 'A filled block with 8px corners, for cards, Dialog and most pages.'],
  ['band', 'A square-cornered band, inside the band look of Dialog and DropdownMenu.'],
  ['rule', 'An outline with no fill, inside the rule look — and in forced colours.'],
]

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          Three looks, matching the <code>variant</code> of Dialog, AlertDialog and DropdownMenu so
          a loading state can wear the family of the surface around it: <code>default</code> is a
          filled block with 8px corners, <code>band</code> a square-cornered band, and{' '}
          <code>rule</code> an outline with no fill.
        </>
      }
    >
      <Example code={`<Skeleton variant="band" className="h-4 w-48" />`}>
        {looks.map((look) => (
          <ExampleCell key={look} label={look}>
            <div aria-hidden='true' className='grid w-48 gap-2'>
              <Skeleton variant={look} className='aspect-video w-full' />
              <Skeleton variant={look} className='h-4 w-3/4' />
            </div>
          </ExampleCell>
        ))}
      </Example>
      <dl className='grid gap-x-8 gap-y-3 sm:grid-cols-3'>
        {lookDocs.map(([name, desc]) => (
          <div key={name} className='space-y-1 text-base'>
            <dt className='font-semibold'>{name}</dt>
            <dd className='text-muted-foreground'>{desc}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

export function ShapesSection() {
  return (
    <ExampleSection
      title='Shapes'
      description='Skeleton has no size of its own. Size it with utilities to echo the shape of what will replace it — a line of text, an avatar, an image.'
    >
      <Example code={`<Skeleton className="size-12 rounded-full" />`}>
        <ExampleCell label='h-4 w-48'>
          <Skeleton aria-hidden='true' className='h-4 w-48' />
        </ExampleCell>
        <ExampleCell label='size-12 rounded-full'>
          <Skeleton aria-hidden='true' className='size-12 rounded-full' />
        </ExampleCell>
        <ExampleCell label='aspect-video w-48'>
          <Skeleton aria-hidden='true' className='aspect-video w-48' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function ListsSection() {
  return (
    <ExampleSection
      title='Lists'
      description='Repeat one row shape for a list that is loading. Match the number of rows to what usually arrives, so the page grows little when the real rows land.'
    >
      <Example
        layout='fill'
        code={`<ul aria-busy="true">
  <li><Skeleton className="size-10 rounded-full" /><Skeleton className="h-4 w-56" /></li>
  …
</ul>`}
      >
        <div aria-busy='true' className='max-w-md'>
          <span className='sr-only'>Loading your applications</span>
          <ul className='divide-y divide-border'>
            {[0, 1, 2].map((row) => (
              <li key={row} className='flex items-center gap-4 py-4'>
                <Skeleton className='size-10 shrink-0 rounded-full' />
                <div className='flex flex-1 flex-col gap-2'>
                  <Skeleton className='h-4 w-56 max-w-full' />
                  <Skeleton className='h-4 w-32' />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function AnnouncingTheWaitSection() {
  return (
    <ExampleSection
      title='Announcing the wait'
      description={
        <>
          Skeleton is purely visual. Put <code>aria-busy=&quot;true&quot;</code> on the region being
          loaded and give screen-reader users a text status such as a visually hidden
          &ldquo;Loading…&rdquo;. The pulse only runs when the reader has not asked for reduced
          motion.
        </>
      }
    >
      <Example
        code={`<div aria-busy="true">
  <span className="sr-only">Loading your profile</span>
  <Skeleton className="size-12 rounded-full" />
  …
</div>`}
      >
        <div aria-busy='true' className='flex items-center gap-4'>
          <span className='sr-only'>Loading your profile</span>
          <Skeleton className='size-12 rounded-full' />
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-64' />
            <Skeleton className='h-4 w-48' />
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A news card and a form field, loading. Each block stands where the real content will land.'
    >
      <Example
        layout='fill'
        code={`<div aria-busy="true">
  <span className="sr-only">Loading</span>
  <Skeleton className="aspect-video w-full" />
  <Skeleton className="h-6 w-3/4" />
  …
</div>`}
      >
        <div aria-busy='true' className='flex max-w-sm flex-col gap-8'>
          <span className='sr-only'>Loading</span>
          <div className='flex flex-col gap-3'>
            <Skeleton className='aspect-video w-full' />
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
          </div>
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-12 w-full rounded-sm' />
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SkeletonDocs() {
  return (
    <DocsPage
      title='Skeleton'
      npm={['Skeleton', 'skeletonVariants']}
      registry='skeleton'
      summary={
        <>
          A placeholder block shown where content is still loading, shaped like what will replace
          it, so the page does not jump when the content arrives.
        </>
      }
    >
      <DocsUsage
        use={[
          'Content that loads in after the page — a list of applications, a profile, a card grid.',
          'Keeping the layout steady while data arrives.',
          'Loads long enough to notice but short enough not to need progress.',
        ]}
        avoid={[
          'An action is in progress, such as submitting a form — use Spinner, or Button’s loading.',
          'The wait has a known length — use Progress.',
          'There is nothing to load — use Empty.',
        ]}
      />
      <VariantsSection />
      <ShapesSection />
      <ListsSection />
      <AnnouncingTheWaitSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: SkeletonDocs },
  },
  args: { variant: 'default', className: 'h-4 w-64' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: looks,
      description: 'The look: filled block, square band or outlined rule.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const block = canvasElement.querySelector('[data-slot="skeleton"]')
    await expect(block).toHaveAttribute('data-variant', 'default')
  },
}

export const Playground: Story = {}
