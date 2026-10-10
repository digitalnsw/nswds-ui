/**
 * Dialog — a centred modal window on the Base UI dialog primitive. Base UI
 * owns the focus trap, scroll lock, focus return and Escape / outside-click
 * dismissal.
 *
 *   Components/Dialog                → this file: Docs, Default, Playground
 *   Components/Dialog/Features       → dialog.features.stories.tsx
 *   Components/Dialog/Accessibility  → dialog.accessibility.stories.tsx
 *   Components/Dialog/Tests          → dialog.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button.js'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogVariant,
} from './dialog.js'
import { Input } from './input.js'
import { Label } from './label.js'
import {
  closeOverlay,
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const looks: ReadonlyArray<readonly [DialogVariant, string]> = [
  [
    'default',
    'Hairline — the header and footer are divided off by hairlines that bleed to the edges.',
  ],
  ['band', 'The header is a solid band in the action colour; the footer sits on a subtle band.'],
  [
    'rule',
    'A 4px rule caps the top edge, the title sits on a hairline, and actions align to the start.',
  ],
]

/** The contact-details dialog every look is shown with. */
function ContactDialog({ variant, trigger }: { variant?: DialogVariant; trigger: string }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant='outline' />}>{trigger}</DialogTrigger>
      <DialogContent variant={variant}>
        <DialogHeader>
          <DialogTitle>Edit contact details</DialogTitle>
          <DialogDescription>
            We use these details to contact you about your application.
          </DialogDescription>
        </DialogHeader>
        <p>Your changes are saved when you select Save.</p>
        <DialogFooter>
          <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
          <DialogClose render={<Button />}>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
          <code>variant</code> on <code>DialogContent</code> picks one of three looks. None casts a
          shadow or blurs the page behind — depth is drawn. Select a button to open the dialog in
          that look.
        </>
      }
    >
      <Example code={`<DialogContent variant="band">…</DialogContent>`}>
        {looks.map(([look]) => (
          <ExampleCell key={look} label={look}>
            <ContactDialog variant={look} trigger={`Open ${look}`} />
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

export function CloseButtonSection() {
  return (
    <ExampleSection
      title='Close button'
      description={
        <>
          Every dialog gets an icon-only close button in the corner. Its name is{' '}
          <code>closeLabel</code> — the only thing a screen reader hears, so translate it with the
          page. Where a labelled button reads better, turn the corner one off with{' '}
          <code>showCloseButton=&#123;false&#125;</code> and add one to the footer.
        </>
      }
    >
      <Example
        code={`<DialogContent showCloseButton={false}>
  …
  <DialogFooter showCloseButton closeLabel="Done" />
</DialogContent>`}
      >
        <ExampleCell label='corner (default)'>
          <Dialog>
            <DialogTrigger render={<Button variant='outline' />}>View receipt</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Payment received</DialogTitle>
                <DialogDescription>
                  Receipt number 4410 2387 has been emailed to you.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </ExampleCell>
        <ExampleCell label='footer'>
          <Dialog>
            <DialogTrigger render={<Button variant='outline' />}>Save changes</DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Changes saved</DialogTitle>
                <DialogDescription>Your contact details have been updated.</DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton closeLabel='Done' />
            </DialogContent>
          </Dialog>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function LongContentSection() {
  return (
    <ExampleSection
      title='Long content'
      description='The dialog caps its height at the viewport and scrolls inside, so the footer is never off-screen. It opens at the top with focus on the close button, so a reader starts at the title, not past it.'
    >
      <Example
        code={`<DialogContent>{/* scrolls once it reaches the viewport height */}</DialogContent>`}
      >
        <Dialog>
          <DialogTrigger render={<Button variant='outline' />}>Read the conditions</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Conditions of your permit</DialogTitle>
              <DialogDescription>Read every condition before you accept.</DialogDescription>
            </DialogHeader>
            {[
              'Display the permit on the dashboard so it can be read from outside the vehicle.',
              'The permit is valid only for the vehicle registration shown on it.',
              'Park only in the zones listed for your permit area.',
              'Tell us within 14 days if you change address or vehicle.',
              'A lost or stolen permit must be reported before a replacement is issued.',
              'The permit does not exempt you from clearways, bus zones or no stopping signs.',
              'We may cancel the permit if it is misused or the conditions are not met.',
              'The permit remains the property of the council and must be returned on request.',
            ].map((condition, i) => (
              <p key={i}>
                {i + 1}. {condition}
              </p>
            ))}
            <DialogFooter>
              <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
              <DialogClose render={<Button />}>Accept conditions</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Example>
    </ExampleSection>
  )
}

function ControlledExample() {
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  return (
    <div className='flex flex-col items-start gap-4'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant='outline' />}>Change email address</DialogTrigger>
        <DialogContent>
          <form
            className='grid gap-6'
            onSubmit={(event) => {
              event.preventDefault()
              setSaved(true)
              setOpen(false)
            }}
          >
            <DialogHeader>
              <DialogTitle>Change email address</DialogTitle>
              <DialogDescription>We will send a confirmation to the new address.</DialogDescription>
            </DialogHeader>
            <div className='grid gap-2'>
              <Label htmlFor='controlled-email'>Email address</Label>
              <Input id='controlled-email' type='email' defaultValue='alex.citizen@example.com' />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
              <Button type='submit'>Save email</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <p className='text-muted-foreground' aria-live='polite'>
        {saved ? 'Email address updated.' : 'No changes yet.'}
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
          Pass <code>open</code> and <code>onOpenChange</code> to close the dialog from your own
          code — after a save succeeds, say, rather than as soon as a button is pressed. Keep it
          open and show the error if the save fails.
        </>
      }
    >
      <Example
        code={`const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  …
  <form onSubmit={async (event) => {
    event.preventDefault()
    await save()
    setOpen(false)
  }}>…</form>
</Dialog>`}
      >
        <ControlledExample />
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A summary of the details a service holds, with each change made in a dialog so the reader never leaves the page.'
    >
      <Example
        layout='fill'
        surface='subtle'
        code={`<Dialog>
  <DialogTrigger render={<Button variant="outline" size="sm" />}>Change postal address</DialogTrigger>
  <DialogContent>
    <form onSubmit={save}>
      <DialogHeader>
        <DialogTitle>Change postal address</DialogTitle>
        <DialogDescription>We send renewal notices to this address.</DialogDescription>
      </DialogHeader>
      …
      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        <DialogClose render={<Button />}>Save address</DialogClose>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>`}
      >
        <div className='max-w-md space-y-4 rounded-md bg-background p-6 ring-1 ring-foreground/10'>
          <h3 className='text-xl font-semibold'>Your details</h3>
          <dl className='space-y-3'>
            <div>
              <dt className='font-semibold'>Postal address</dt>
              <dd className='text-muted-foreground'>12 Smith Street, Parramatta NSW 2150</dd>
            </div>
          </dl>
          <Dialog>
            <DialogTrigger render={<Button variant='outline' size='sm' />}>
              Change postal address
            </DialogTrigger>
            <DialogContent>
              <form className='grid gap-6' onSubmit={(event) => event.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Change postal address</DialogTitle>
                  <DialogDescription>We send renewal notices to this address.</DialogDescription>
                </DialogHeader>
                <div className='grid gap-2'>
                  <Label htmlFor='context-street'>Street address</Label>
                  <Input id='context-street' defaultValue='12 Smith Street' />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='context-suburb'>Suburb</Label>
                  <Input id='context-suburb' defaultValue='Parramatta' />
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
                  <DialogClose render={<Button />}>Save address</DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function DialogDocs() {
  return (
    <DocsPage
      title='Dialog'
      npm={[
        'Dialog',
        'DialogTrigger',
        'DialogContent',
        'DialogHeader',
        'DialogTitle',
        'DialogDescription',
        'DialogFooter',
        'DialogClose',
      ]}
      registry='dialog'
      summary={
        <>
          A modal window centred over the page, for a short task that needs the reader&apos;s full
          attention without taking them somewhere else. Base UI traps focus inside it, locks the
          page scroll, returns focus to the trigger on close and dismisses it on Escape or an
          outside click.
        </>
      }
    >
      <DocsUsage
        use={[
          'Editing a small set of details without leaving the page.',
          'A short form or task that blocks the rest of the page until it is done.',
          'Showing supporting detail, like a receipt, that the reader dismisses when finished.',
        ]}
        avoid={[
          'The reader must confirm or cancel a consequential action — use AlertDialog.',
          'A longer task, or filters to keep beside the page — use Sheet, or Drawer on touch.',
          'Confirming that something happened without blocking the page — use a toast (Toaster).',
        ]}
      />
      <VariantsSection />
      <CloseButtonSection />
      <LongContentSection />
      <ControlledSection />
      <InContextSection />
      <DocsApi description='Props of the Dialog root, plus the look set on DialogContent. Try them live in the Playground story.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * The look is a prop of `DialogContent`, not of the root the meta documents,
 * so the args type is widened to let the Playground switch it.
 */
type StoryArgs = ComponentProps<typeof Dialog> & { variant?: DialogVariant }

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: DialogDocs },
  },
  args: {
    variant: 'default',
    modal: true,
    disablePointerDismissal: false,
    onOpenChange: fn(),
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'band', 'rule'],
      description: 'The look, set on DialogContent: default (Hairline), band or rule.',
      table: { category: 'Appearance' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the dialog is open on first render (uncontrolled).',
      table: { category: 'Behavior' },
    },
    open: {
      control: false,
      description: 'Whether the dialog is open. Pair with onOpenChange to control it.',
      table: { category: 'Behavior' },
    },
    modal: {
      control: 'inline-radio',
      options: [true, false, 'trap-focus'],
      description:
        'true locks scroll and blocks the page; trap-focus keeps focus inside without locking scroll.',
      table: { category: 'Behavior' },
    },
    disablePointerDismissal: {
      control: 'boolean',
      description: 'Stops an outside click from closing the dialog. Escape still closes it.',
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
  render: ({ variant, ...args }) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button />}>Edit contact details</DialogTrigger>
      <DialogContent variant={variant}>
        <DialogHeader>
          <DialogTitle>Edit contact details</DialogTitle>
          <DialogDescription>
            We use these details to contact you about your application.
          </DialogDescription>
        </DialogHeader>
        <p>Your changes are saved when you select Save.</p>
        <DialogFooter>
          <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Edit contact details' })
    await userEvent.click(trigger)

    // The popup is PORTALED to the document body, so query the whole document
    // rather than canvasElement.
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Edit contact details',
    })
    await expect(dialog).toHaveAccessibleDescription(
      'We use these details to contact you about your application.',
    )
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))

    await closeOverlay('dialog-content')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const Playground: Story = {}
