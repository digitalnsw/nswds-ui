/**
 * AlertDialog — a modal that requires an explicit choice, on the Base UI
 * alert-dialog primitive (`role="alertdialog"`, no outside-click dismissal;
 * Escape still closes it, as Cancel).
 *
 *   Components/AlertDialog                → this file: Docs, Default, Playground
 *   Components/AlertDialog/Features       → alert-dialog.features.stories.tsx
 *   Components/AlertDialog/Accessibility  → alert-dialog.accessibility.stories.tsx
 *   Components/AlertDialog/Tests          → alert-dialog.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, type ReactNode, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { IconDelete, IconLogout, IconWarning } from '../icons/index.js'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogVariant,
} from './alert-dialog.js'
import { Button } from './button.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
  waitForUnmount,
} from './story-helpers.js'

const looks: ReadonlyArray<readonly [AlertDialogVariant, string]> = [
  [
    'default',
    'Hairline — the header and footer are divided off by hairlines that bleed to the edges.',
  ],
  ['band', 'The header is a solid band in the colour of the decision.'],
  [
    'rule',
    'A 4px rule in the colour of the decision caps the top edge; actions align to the start.',
  ],
]

/**
 * An alert dialog whose action closes it, the way a consumer's would:
 * AlertDialogAction does not close the dialog on its own, so the example
 * controls `open` and closes it once the action has run.
 */
function ConfirmDialog({
  trigger,
  title,
  description,
  cancel = 'Cancel',
  action,
  danger = false,
  media,
  plainAction = false,
  ...content
}: {
  trigger: string
  title: string
  description: string
  cancel?: string
  action: ReactNode
  danger?: boolean
  media?: ReactNode
  /** Confirm with a plain Button rather than AlertDialogAction. */
  plainAction?: boolean
} & Pick<ComponentProps<typeof AlertDialogContent>, 'variant' | 'size' | 'tone'>) {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant='outline' />}>{trigger}</AlertDialogTrigger>
      <AlertDialogContent {...content}>
        <AlertDialogHeader>
          {media ? <AlertDialogMedia>{media}</AlertDialogMedia> : null}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancel}</AlertDialogCancel>
          {plainAction ? (
            <Button color={danger ? 'danger' : undefined} onClick={() => setOpen(false)}>
              {action}
            </Button>
          ) : (
            <AlertDialogAction color={danger ? 'danger' : undefined} onClick={() => setOpen(false)}>
              {action}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          <code>variant</code> on <code>AlertDialogContent</code> picks the same three looks as
          Dialog. Under <code>band</code> and <code>rule</code> the colour is the decision&apos;s:
          the action colour here, danger for a destructive confirm (see Destructive actions).
        </>
      }
    >
      <Example code={`<AlertDialogContent variant="band">…</AlertDialogContent>`}>
        {looks.map(([look]) => (
          <ExampleCell key={look} label={look}>
            <ConfirmDialog
              variant={look}
              trigger={`Submit (${look})`}
              title='Submit your application?'
              description='You cannot change your answers after you submit.'
              cancel='Go back'
              action='Submit application'
            />
          </ExampleCell>
        ))}
      </Example>
      <dl className='grid gap-x-10 gap-y-3'>
        {looks.map(([name, description]) => (
          <div key={name} className='flex gap-4'>
            <dt className='w-20 shrink-0 font-semibold'>{name}</dt>
            <dd className='text-muted-foreground'>{description}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

export function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          <code>default</code> is 512px wide. <code>sm</code> narrows it to 384px and splits the
          footer into two equal buttons — for a short question with short answers.
        </>
      }
    >
      <Example code={`<AlertDialogContent size="sm">…</AlertDialogContent>`}>
        <ExampleCell label='default'>
          <ConfirmDialog
            trigger='Discard changes'
            title='Discard your changes?'
            description='The changes you made to your contact details have not been saved.'
            cancel='Keep editing'
            action='Discard changes'
          />
        </ExampleCell>
        <ExampleCell label='sm'>
          <ConfirmDialog
            size='sm'
            trigger='Sign out'
            title='Sign out?'
            description='Unsaved changes will be lost.'
            cancel='Stay'
            action='Sign out'
          />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function WithIconsSection() {
  return (
    <ExampleSection
      title='With icons'
      description={
        <>
          <code>AlertDialogMedia</code> puts an icon with the title: on a tile in the default look,
          bare above the title in <code>band</code>, and beside it in <code>rule</code>. The icon is
          decorative — the title carries the meaning — so hide it from assistive tech.
        </>
      }
    >
      <Example
        code={`<AlertDialogHeader>
  <AlertDialogMedia><IconWarning aria-hidden="true" /></AlertDialogMedia>
  <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
</AlertDialogHeader>`}
      >
        {looks.map(([look]) => (
          <ExampleCell key={look} label={look}>
            <ConfirmDialog
              variant={look}
              danger
              media={<IconWarning aria-hidden='true' />}
              trigger={`Delete draft (${look})`}
              title='Delete this draft?'
              description='The draft and its attachments are deleted permanently.'
              action='Delete draft'
            />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function DestructiveActionsSection() {
  return (
    <ExampleSection
      title='Destructive actions'
      description={
        <>
          The colour follows the decision, so a &ldquo;Sign out?&rdquo; never borrows the alarm of a
          &ldquo;Delete?&rdquo;. An <code>AlertDialogAction</code> with{' '}
          <code>color=&quot;danger&quot;</code> is detected and turns the band or rule red. If the
          danger button is anything else — a plain <code>Button</code>, a link — say so with{' '}
          <code>tone=&quot;danger&quot;</code>.
        </>
      }
    >
      <Example code={`<AlertDialogAction color="danger">Delete account</AlertDialogAction>`}>
        <ExampleCell label='action colour'>
          <ConfirmDialog
            variant='band'
            media={<IconLogout aria-hidden='true' />}
            trigger='Sign out'
            title='Sign out of your account?'
            description='You will need to sign in again to continue your application.'
            action='Sign out'
          />
        </ExampleCell>
        <ExampleCell label='color="danger"'>
          <ConfirmDialog
            variant='band'
            danger
            media={<IconDelete aria-hidden='true' />}
            trigger='Delete account'
            title='Delete your account?'
            description='Your saved applications and documents are deleted permanently.'
            action='Delete account'
          />
        </ExampleCell>
      </Example>
      <Example code={`<AlertDialogContent variant="rule" tone="danger">…</AlertDialogContent>`}>
        <ExampleCell label='rule + color="danger"'>
          <ConfirmDialog
            variant='rule'
            danger
            trigger='Remove vehicle'
            title='Remove this vehicle from your account?'
            description='Its registration reminders will stop.'
            action='Remove vehicle'
          />
        </ExampleCell>
        <ExampleCell label='rule + tone="danger"'>
          <ConfirmDialog
            variant='rule'
            tone='danger'
            danger
            plainAction
            trigger='Cancel booking'
            title='Cancel your driving test booking?'
            description='Your booking fee is refunded only if you cancel at least 2 full business days before the test.'
            cancel='Keep booking'
            action='Cancel booking'
          />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function ControlledExample() {
  const [open, setOpen] = useState(false)
  const [withdrawn, setWithdrawn] = useState(false)
  return (
    <div className='flex flex-col items-start gap-4'>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger render={<Button variant='outline' />} disabled={withdrawn}>
          Withdraw application
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw your application?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to start a new application if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep application</AlertDialogCancel>
            <AlertDialogAction
              color='danger'
              onClick={() => {
                setWithdrawn(true)
                setOpen(false)
              }}
            >
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className='text-muted-foreground' aria-live='polite'>
        {withdrawn ? 'Your application has been withdrawn.' : 'Application in progress.'}
      </p>
    </div>
  )
}

export function ControlledSection() {
  return (
    <ExampleSection
      title='Controlled'
      description={
        <>
          <code>AlertDialogAction</code> does not close the dialog by itself, so the action can run
          — and fail — first. Control <code>open</code> and close it from the handler once the
          action succeeds. Escape and Cancel both close it without acting.
        </>
      }
    >
      <Example
        code={`const [open, setOpen] = useState(false)

<AlertDialog open={open} onOpenChange={setOpen}>
  …
  <AlertDialogAction color="danger" onClick={async () => {
    await withdraw()
    setOpen(false)
  }}>
    Withdraw
  </AlertDialogAction>
</AlertDialog>`}
      >
        <ControlledExample />
      </Example>
    </ExampleSection>
  )
}

const savedVehicles = [
  ['Toyota Corolla', 'ABC12D'],
  ['Mazda CX-5', 'XYZ34E'],
] as const

function SavedVehiclesExample() {
  const [vehicles, setVehicles] = useState<ReadonlyArray<readonly [string, string]>>(savedVehicles)
  const [removing, setRemoving] = useState<string | null>(null)
  return (
    <div className='w-full max-w-md space-y-4 rounded-md bg-background p-6 ring-1 ring-foreground/10'>
      <p className='text-xl font-semibold'>Your vehicles</p>
      {vehicles.length === 0 ? (
        <p className='text-muted-foreground'>You have no vehicles on your account.</p>
      ) : (
        <ul className='divide-y divide-border'>
          {vehicles.map(([model, plate]) => (
            <li key={plate} className='flex items-center justify-between gap-4 py-3'>
              <div>
                <p className='font-semibold'>{model}</p>
                <p className='text-muted-foreground'>Registration {plate}</p>
              </div>
              <AlertDialog
                open={removing === plate}
                onOpenChange={(open) => setRemoving(open ? plate : null)}
              >
                <AlertDialogTrigger render={<Button variant='outline' color='danger' />}>
                  Remove<span className='sr-only'> {model}</span>
                </AlertDialogTrigger>
                <AlertDialogContent variant='rule'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove {model} from your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Registration renewal reminders for {plate} will stop. You can add the vehicle
                      again at any time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep vehicle</AlertDialogCancel>
                    <AlertDialogAction
                      color='danger'
                      onClick={() => {
                        setVehicles((list) => list.filter(([, p]) => p !== plate))
                        setRemoving(null)
                      }}
                    >
                      Remove vehicle
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          Removing a vehicle from an online account. Each Remove button names its vehicle for screen
          readers, the question repeats it, and the safe choice comes first — it is also what Escape
          does.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<AlertDialogContent variant="rule">
  <AlertDialogHeader>
    <AlertDialogTitle>Remove Toyota Corolla from your account?</AlertDialogTitle>
    <AlertDialogDescription>…</AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>Keep vehicle</AlertDialogCancel>
    <AlertDialogAction color="danger" onClick={remove}>Remove vehicle</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`}
      >
        <SavedVehiclesExample />
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function AlertDialogDocs() {
  return (
    <DocsPage
      title='AlertDialog'
      npm={[
        'AlertDialog',
        'AlertDialogTrigger',
        'AlertDialogContent',
        'AlertDialogHeader',
        'AlertDialogMedia',
        'AlertDialogTitle',
        'AlertDialogDescription',
        'AlertDialogFooter',
        'AlertDialogAction',
        'AlertDialogCancel',
      ]}
      registry='alert-dialog'
      summary={
        <>
          A modal that interrupts the reader to confirm or cancel a consequential action. It has no
          close button and an outside click does not dismiss it: the reader answers the question.
          Escape still closes it, and counts as Cancel — so never make closing the dialog perform
          the action.
        </>
      }
    >
      <DocsUsage
        use={[
          'Confirming an action that cannot be undone, like deleting or withdrawing.',
          'Warning that leaving will lose unsaved work.',
          'A yes-or-no decision the reader must make before they can continue.',
        ]}
        avoid={[
          'Collecting input or showing detail the reader can dismiss — use Dialog.',
          'Telling the reader something happened — use a toast (Toaster), or a Callout on the page.',
          'The action is easy to undo — act straight away and offer Undo in a toast instead.',
        ]}
      />
      <VariantsSection />
      <SizesSection />
      <WithIconsSection />
      <DestructiveActionsSection />
      <ControlledSection />
      <InContextSection />
      <DocsApi description='Props of the AlertDialog root, plus the look and size set on AlertDialogContent. Try them live in the Playground story.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * The look and size are props of `AlertDialogContent`, not of the root the
 * meta documents, so the args type is widened to let the Playground switch them.
 */
type StoryArgs = ComponentProps<typeof AlertDialog> & {
  variant?: AlertDialogVariant
  size?: 'default' | 'sm'
}

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: AlertDialogDocs },
  },
  args: {
    variant: 'default',
    size: 'default',
    onOpenChange: fn(),
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'band', 'rule'],
      description: 'The look, set on AlertDialogContent: default (Hairline), band or rule.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm'],
      description: 'Set on AlertDialogContent. sm narrows the popup and splits the footer evenly.',
      table: { category: 'Appearance' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the dialog is open on first render (uncontrolled).',
      table: { category: 'Behavior' },
    },
    open: {
      control: false,
      description:
        'Whether the dialog is open. Control it to close the dialog once the action succeeds.',
      table: { category: 'Behavior' },
    },
    onOpenChange: {
      description: 'Called when the dialog opens or closes (logged in the Actions panel).',
      table: { category: 'Events' },
    },
    onOpenChangeComplete: {
      description: 'Called once the open or close transition has finished.',
      table: { category: 'Events' },
    },
    actionsRef: { table: { disable: true } },
    handle: { table: { disable: true } },
    triggerId: { table: { disable: true } },
    defaultTriggerId: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: ({ variant, size, ...args }) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger render={<Button variant='outline' />}>
        Withdraw application
      </AlertDialogTrigger>
      <AlertDialogContent variant={variant} size={size}>
        <AlertDialogHeader>
          <AlertDialogTitle>Withdraw your application?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to start a new application if you change your mind.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep application</AlertDialogCancel>
          <AlertDialogAction color='danger'>Withdraw</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Withdraw application' })
    await userEvent.click(trigger)

    const dialog = await within(document.body).findByRole('alertdialog', {
      name: 'Withdraw your application?',
    })
    await expect(dialog).toHaveAccessibleDescription(
      'You will need to start a new application if you change your mind.',
    )
    // No corner close button: the footer's two choices are the only buttons.
    await expect(
      within(dialog)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Keep application', 'Withdraw'])

    await userEvent.click(within(dialog).getByRole('button', { name: 'Keep application' }))
    await waitForUnmount('alert-dialog-content')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const Playground: Story = {}
