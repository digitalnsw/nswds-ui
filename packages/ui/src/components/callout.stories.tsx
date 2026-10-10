/**
 * Callout — a bordered notice for static page content.
 *
 *   Components/Callout                → this file: Docs, Default, Playground
 *   Components/Callout/Features       → callout.features.stories.tsx
 *   Components/Callout/Accessibility  → callout.accessibility.stories.tsx
 *   Components/Callout/Tests          → callout.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'

import { IconSchedule } from '../icons/index.js'
import { Button } from './button.js'
import { Alert, Callout } from './callout.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

/**
 * A full-width specimen with its label above it. Callouts fill their column,
 * so Button's centred cell would shrink them to their text.
 */
function Specimen({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className='w-full space-y-2'>
      <p className='text-base font-medium tracking-wide text-muted-foreground'>{label}</p>
      {children}
    </div>
  )
}

const statusDocs = [
  ['info', 'Something a reader needs to know, with no judgement attached.'],
  ['success', 'An outcome has gone the way the reader wanted.'],
  ['warning', 'Something may get in the reader’s way, such as an outage or a deadline.'],
  ['danger', 'Something has gone wrong and the reader has to act.'],
] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function StatusSection() {
  return (
    <ExampleSection
      title='Status'
      description={
        <>
          <code>status</code> sets the surface, border and glyph — the same four statuses and glyphs
          as Toaster. Say what the status means in the title or the copy too: the glyph is
          decorative, so colour and shape alone never carry it.
        </>
      }
    >
      <Example
        layout='stack'
        className='gap-8'
        code={`<Callout status="warning" title="Planned outage">…</Callout>`}
      >
        <Specimen label='info'>
          <Callout status='info' title='You will need your licence number'>
            It is printed on the front of your licence card.
          </Callout>
        </Specimen>
        <Specimen label='success'>
          <Callout status='success' title='Your application has been approved'>
            We will email your certificate within 2 working days.
          </Callout>
        </Specimen>
        <Specimen label='warning'>
          <Callout status='warning' title='Planned outage'>
            This service will be unavailable on Sunday between 2am and 4am.
          </Callout>
        </Specimen>
        <Specimen label='danger'>
          <Callout status='danger' title='We could not process your payment'>
            Your card was declined. Check your card details or use another card.
          </Callout>
        </Specimen>
      </Example>
      <dl className='grid gap-x-8 gap-y-3 sm:grid-cols-2'>
        {statusDocs.map(([name, desc]) => (
          <div key={name} className='flex gap-3 text-base'>
            <dt className='w-20 shrink-0 font-semibold'>{name}</dt>
            <dd className='text-muted-foreground'>{desc}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

export function ContentSection() {
  return (
    <ExampleSection
      title='Content'
      description={
        <>
          <code>title</code> is an optional bold lead line; the body is <code>children</code>. Leave
          the title out when one sentence says it all.
        </>
      }
    >
      <Example
        layout='stack'
        className='gap-8'
        code={`<Callout>Applications close at 5pm on 30 June.</Callout>`}
      >
        <Specimen label='title and body'>
          <Callout title='Applications close soon'>
            Submit your application by 5pm on 30 June.
          </Callout>
        </Specimen>
        <Specimen label='body only'>
          <Callout>Applications close at 5pm on 30 June.</Callout>
        </Specimen>
      </Example>
    </ExampleSection>
  )
}

export function IconsSection() {
  return (
    <ExampleSection
      title='Icons'
      description={
        <>
          <code>icon</code> replaces the status glyph with any icon component. Pass{' '}
          <code>null</code> to drop it: the surface and border still carry the status.
        </>
      }
    >
      <Example
        layout='stack'
        className='gap-8'
        code={`<Callout icon={IconSchedule} title="…">…</Callout>`}
      >
        <Specimen label='icon={IconSchedule}'>
          <Callout icon={IconSchedule} title='Opening hours'>
            Service centres are open 8:30am to 5pm, Monday to Friday.
          </Callout>
        </Specimen>
        <Specimen label='icon={null}'>
          <Callout icon={null}>Bring photo identification to your appointment.</Callout>
        </Specimen>
      </Example>
    </ExampleSection>
  )
}

export function AsAlertSection() {
  return (
    <ExampleSection
      title='As Alert'
      description={
        <>
          <code>Alert</code> and <code>alertVariants</code> are Callout under shadcn&apos;s names,
          so code carried over from shadcn&apos;s <code>&lt;Alert&gt;</code> finds them. The props
          are Callout&apos;s: <code>status</code> rather than <code>variant</code>, a{' '}
          <code>title</code> prop rather than <code>AlertTitle</code>, and no{' '}
          <code>role=&quot;alert&quot;</code>.
        </>
      }
    >
      <Example layout='fill' code={`<Alert status="warning" title="Planned outage">…</Alert>`}>
        <Alert status='warning' title='Planned outage'>
          This service will be unavailable on Sunday between 2am and 4am.
        </Alert>
      </Example>
    </ExampleSection>
  )
}

function AnnouncedExample() {
  const [saved, setSaved] = useState(false)
  return (
    <div className='w-full space-y-4'>
      <Button variant='outline' onClick={() => setSaved(true)}>
        Save draft
      </Button>
      {/* The live region is on the page before the callout arrives, so the
          arrival is announced; Callout itself stays silent. */}
      <div role='status'>
        {saved ? (
          <Callout status='success' title='Draft saved'>
            You can come back and finish your application within 30 days.
          </Callout>
        ) : null}
      </div>
    </div>
  )
}

export function AnnouncingSection() {
  return (
    <ExampleSection
      title='Announcing a callout'
      description={
        <>
          A callout that is part of the page must not announce itself, so Callout has no live
          region. When you show one in response to an action and it does need announcing, wrap it in
          your own <code>role=&quot;status&quot;</code> region that is already on the page — or use
          Toaster, which does this for you.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<div role="status">
  {saved ? <Callout status="success" title="Draft saved">…</Callout> : null}
</div>`}
      >
        <AnnouncedExample />
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A callout sits in the flow of the page, beside the content it is about.'
    >
      <Example
        layout='fill'
        code={`<p>You will need proof of identity and a recent photo to apply online.</p>
<Callout status="info" title="Applying for someone else?">…</Callout>`}
      >
        <div className='max-w-prose space-y-4'>
          <p className='text-2xl font-semibold'>Before you start</p>
          <p>You will need proof of identity and a recent photo to apply online.</p>
          <Callout status='info' title='Applying for someone else?'>
            You will also need their written consent, signed in the last 3 months.
          </Callout>
          <p>It takes about 20 minutes to complete the application.</p>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function CalloutDocs() {
  return (
    <DocsPage
      title='Callout'
      npm={['Callout', 'calloutVariants', 'Alert', 'alertVariants']}
      registry='callout'
      summary={
        <>
          A bordered notice that marks a passage of page content as informational, confirming,
          cautionary or dangerous. It is for <strong>static</strong> content and carries no
          live-region semantics, so it never interrupts a screen-reader user who simply arrives on
          the page.
        </>
      }
    >
      <DocsUsage
        use={[
          'Something a reader must know before they start a task — documents to have ready.',
          'Confirming an outcome on the page that follows it, such as an approval.',
          'Warning of a planned outage or a deadline.',
        ]}
        avoid={[
          'A message in response to something the person just did — use Toaster.',
          'An error in one form field — use FieldError.',
          'A short status label beside an item — use Badge.',
        ]}
      />
      <StatusSection />
      <ContentSection />
      <IconsSection />
      <AsAlertSection />
      <AnnouncingSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: CalloutDocs },
  },
  args: {
    status: 'info',
    title: 'You will need your licence number',
    children: 'It is printed on the front of your licence card.',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional bold lead line above the body copy.',
      table: { category: 'Content' },
    },
    children: {
      control: 'text',
      description: 'Body copy.',
      table: { category: 'Content' },
    },
    icon: {
      control: false,
      description: 'Replaces the status glyph. Pass null to drop it.',
      table: { category: 'Content' },
    },
    status: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'danger'],
      description: 'Message status. Drives the surface, border and glyph.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Callout>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCallout(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="callout"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="callout"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const callout = getCallout(canvasElement)

    const status = callout.getAttribute('data-status')
    if (status !== args.status) {
      throw new Error(`Expected data-status="${args.status}", received "${status}".`)
    }

    // The status glyph must be decorative — status is conveyed by the copy, not
    // by an icon a screen reader would read out as a bare word.
    const icon = callout.querySelector('[data-slot="callout-icon"]')
    if (!icon) {
      throw new Error('Expected a status icon.')
    }
    if (icon.getAttribute('aria-hidden') !== 'true') {
      throw new Error('Expected the status icon to be aria-hidden.')
    }

    // Static content: it must NOT announce itself.
    if (callout.getAttribute('role') === 'alert' || callout.hasAttribute('aria-live')) {
      throw new Error('Callout must not carry live-region semantics.')
    }
  },
}

export const Playground: Story = {}
