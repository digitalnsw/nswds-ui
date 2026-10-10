/**
 * Toaster (sonner.tsx) — a toast notification surface wired to next-themes,
 * with NSWDS status icons. Mount one Toaster near the app root and fire toasts
 * with the `toast()` helper from the `sonner` package.
 *
 *   Components/Toaster        → this file: Docs, Default, Playground and one
 *                               story per docs section
 *   Components/Toaster/Tests  → sonner.tests.stories.tsx
 *
 * Each section mounts its own Toaster with an `id` and fires its toasts with a
 * matching `toasterId`, so the docs page (which renders every section at once)
 * shows each toast once. A consumer mounts one Toaster and needs neither.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { expect, within } from 'storybook/test'

import { Button } from './button.js'
import { Toaster } from './sonner.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function ToastTypesSection() {
  const toasterId = 'toast-types'
  const types = [
    ['success', 'Save draft', () => toast.success('Your draft has been saved', { toasterId })],
    [
      'info',
      'Planned outage',
      () => toast.info('Online services will be unavailable from 10pm', { toasterId }),
    ],
    [
      'warning',
      'Session timeout',
      () => toast.warning('Your session expires in 5 minutes', { toasterId }),
    ],
    [
      'error',
      'Failed save',
      () => toast.error('We could not save your draft. Try again.', { toasterId }),
    ],
    ['message', 'Email receipt', () => toast('We emailed your receipt to you', { toasterId })],
  ] as const
  return (
    <ExampleSection
      title='Toast types'
      description={
        <>
          Each <code>toast</code> function sets the icon: a tick for success, and the info, warning
          and error icons for the rest. Plain <code>toast()</code> has none. The words carry the
          meaning — the icon only supports them. Select a button to show its toast.
        </>
      }
    >
      <Example code={`toast.success('Your draft has been saved')`}>
        {types.map(([type, label, fire]) => (
          <ExampleCell key={type} label={type === 'message' ? 'toast()' : `toast.${type}()`}>
            <Button variant='outline' onClick={fire}>
              {label}
            </Button>
          </ExampleCell>
        ))}
      </Example>
      <Toaster id={toasterId} />
    </ExampleSection>
  )
}

function DescriptionAndActionSection() {
  const toasterId = 'description-and-action'
  return (
    <ExampleSection
      title='Description and action'
      description={
        <>
          A <code>description</code> adds a second line of detail. An <code>action</code> adds one
          button — most often Undo, for something done straight away that the reader may want back.
          A toast disappears on its own, so never put the only way to do something in one.
        </>
      }
    >
      <Example
        code={`toast('Vehicle removed from your account', {
  description: 'Toyota Corolla, ABC12D',
  action: { label: 'Undo', onClick: () => restoreVehicle() },
})`}
      >
        <ExampleCell label='description'>
          <Button
            variant='outline'
            onClick={() =>
              toast.success('Appointment booked', {
                description: 'Tuesday 14 October at 10.30am, Service NSW Parramatta.',
                toasterId,
              })
            }
          >
            Book appointment
          </Button>
        </ExampleCell>
        <ExampleCell label='description + action'>
          <Button
            variant='outline'
            onClick={() =>
              toast('Vehicle removed from your account', {
                description: 'Toyota Corolla, ABC12D',
                action: { label: 'Undo', onClick: () => {} },
                toasterId,
              })
            }
          >
            Remove vehicle
          </Button>
        </ExampleCell>
      </Example>
      <Toaster id={toasterId} />
    </ExampleSection>
  )
}

function PromisesSection() {
  const toasterId = 'promises'
  return (
    <ExampleSection
      title='Promises'
      description={
        <>
          <code>toast.promise</code> shows a loading toast while the work runs, then swaps it for
          the success or error message — one toast for the whole job, not three.
        </>
      }
    >
      <Example
        code={`toast.promise(submitApplication(), {
  loading: 'Submitting your application…',
  success: 'Application submitted',
  error: 'We could not submit your application',
})`}
      >
        <Button
          variant='outline'
          onClick={() =>
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
              loading: 'Submitting your application…',
              success: 'Application submitted',
              error: 'We could not submit your application',
              toasterId,
            })
          }
        >
          Submit application
        </Button>
      </Example>
      <Toaster id={toasterId} />
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ToasterDocs() {
  return (
    <DocsPage
      title='Toaster'
      npm='Toaster'
      registry='sonner'
      summary={
        <>
          A brief message that confirms something has happened, shown at the edge of the screen and
          gone after a few seconds. Mount one <code>Toaster</code> near the root of the app, then
          call <code>toast()</code> from the <code>sonner</code> package anywhere. It takes the NSW
          tokens and status icons, and follows the light or dark theme.
        </>
      }
    >
      <DocsUsage
        use={[
          'Confirming an action the reader just took, like saving a draft.',
          'Offering Undo for something done straight away.',
          'Reporting the progress and outcome of a background task.',
        ]}
        avoid={[
          'The reader must act or decide before going on — use AlertDialog.',
          'An error in a form field — show it at the field with FieldError.',
          'Information that must stay on screen — use a Callout on the page.',
        ]}
      />
      <ToastTypesSection />
      <DescriptionAndActionSection />
      <PromisesSection />
      <DocsApi description='Props of Toaster, which are sonner’s own. className, style, icons and toastOptions are merged with the NSW defaults, not replaced. Try them live in the Playground story.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ToasterDocs },
  },
  args: {
    position: 'bottom-right',
    expand: false,
    closeButton: false,
    richColors: false,
    duration: 4000,
    visibleToasts: 3,
  },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Where on the screen toasts stack.',
      table: { category: 'Appearance' },
    },
    expand: {
      control: 'boolean',
      description: 'Show every visible toast in full instead of stacking them.',
      table: { category: 'Appearance' },
    },
    richColors: {
      control: 'boolean',
      description: 'Tint success, info, warning and error toasts with their status colour.',
      table: { category: 'Appearance' },
    },
    visibleToasts: {
      control: 'number',
      description: 'How many toasts show at once; older ones wait.',
      table: { category: 'Appearance' },
    },
    icons: {
      control: false,
      description: 'Replace status icons. Merged with the NSW defaults.',
      table: { category: 'Appearance' },
    },
    closeButton: {
      control: 'boolean',
      description: 'Add a close button to every toast.',
      table: { category: 'Behavior' },
    },
    duration: {
      control: 'number',
      description: 'How long a toast stays, in milliseconds.',
      table: { category: 'Behavior' },
    },
    toastOptions: {
      control: false,
      description: 'Defaults for every toast. Merged with the NSW defaults.',
      table: { category: 'Behavior' },
    },
    hotkey: {
      control: false,
      description: 'Keys that move focus to the toasts. Alt+T by default.',
      table: { category: 'Accessibility' },
    },
    containerAriaLabel: {
      control: 'text',
      description: 'Accessible name of the toast region.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => (
    <div>
      <Toaster {...args} />
      <Button
        onClick={() =>
          toast.success('Your draft has been saved', {
            description: 'You can come back to it for 30 days.',
          })
        }
      >
        Save draft
      </Button>
    </div>
  ),
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // Firing a toast here would leave it for the next story to inherit, so the
    // smoke test stops at the mounted page: the trigger, and the toast region
    // sonner renders up front.
    await expect(within(canvasElement).getByRole('button', { name: 'Save draft' })).toBeVisible()
    await expect(canvasElement.querySelector('section[aria-label]')).toBeInTheDocument()
  },
}

export const Playground: Story = {}

export const ToastTypes: Story = { name: 'Toast types', render: () => <ToastTypesSection /> }

export const DescriptionAndAction: Story = {
  name: 'Description and action',
  render: () => <DescriptionAndActionSection />,
}

export const Promises: Story = { name: 'Promises', render: () => <PromisesSection /> }
