/**
 * Sheet — an edge-anchored dialog that slides in from any side, on the Base UI
 * dialog primitive. Base UI owns the focus trap, scroll lock, and dismissal.
 *
 *   Components/Sheet                → this file: Docs, Default, Playground
 *   Components/Sheet/Features       → sheet.features.stories.tsx
 *   Components/Sheet/Accessibility  → sheet.accessibility.stories.tsx
 *   Components/Sheet/Tests          → sheet.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useRef } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from './button.js'
import { Checkbox } from './checkbox.js'
import { Field, FieldLabel } from './field.js'
import { Input } from './input.js'
import { Label } from './label.js'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet.js'
import {
  closeOverlay,
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

type Side = 'top' | 'right' | 'bottom' | 'left'

const sides: Side[] = ['right', 'left', 'top', 'bottom']

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function SidesSection() {
  return (
    <ExampleSection
      title='Sides'
      description={
        <>
          <code>side</code> on <code>SheetContent</code> sets the edge it slides in from. Left and
          right sheets take three quarters of a phone screen and 384px from <code>sm</code> up; top
          and bottom sheets span the width and size to their content. Right is the default; left
          suits navigation, top an announcement, and bottom short actions on a phone. In a
          right-to-left page, left and right follow the reading direction.
        </>
      }
    >
      <Example code={`<SheetContent side="left">…</SheetContent>`}>
        {sides.map((side) => (
          <ExampleCell key={side} label={`side="${side}"`}>
            <Sheet>
              <SheetTrigger render={<Button variant='outline' />}>From the {side}</SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Your saved services</SheetTitle>
                  <SheetDescription>This sheet slides in from the {side}.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function CloseButtonSection() {
  return (
    <ExampleSection
      title='Close button'
      description={
        <>
          A sheet opens with focus on its icon-only close button, named by <code>closeLabel</code> —
          translate it with the page. Content in that corner keeps clear of it on its own. With{' '}
          <code>showCloseButton=&#123;false&#125;</code>, give the reader a <code>SheetClose</code>{' '}
          of their own; the sheet then takes focus itself, so a long sheet still opens at the top.
        </>
      }
    >
      <Example
        code={`<SheetContent showCloseButton={false}>
  …
  <SheetFooter>
    <SheetClose render={<Button />}>Done</SheetClose>
  </SheetFooter>
</SheetContent>`}
      >
        <ExampleCell label='corner (default)'>
          <Sheet>
            <SheetTrigger render={<Button variant='outline' />}>Opening hours</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Service NSW Parramatta</SheetTitle>
                <SheetDescription>Open Monday to Friday, 8.30am to 5pm.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </ExampleCell>
        <ExampleCell label='SheetClose in the footer'>
          <Sheet>
            <SheetTrigger render={<Button variant='outline' />}>What to bring</SheetTrigger>
            <SheetContent showCloseButton={false}>
              <SheetHeader>
                <SheetTitle>What to bring to your appointment</SheetTitle>
                <SheetDescription>
                  Bring proof of identity and your booking number.
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <SheetClose render={<Button />}>Done</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function InitialFocusExample() {
  const search = useRef<HTMLInputElement>(null)
  return (
    <Sheet>
      <SheetTrigger render={<Button variant='outline' />}>Find a service centre</SheetTrigger>
      <SheetContent initialFocus={search}>
        <SheetHeader>
          <SheetTitle>Find a service centre</SheetTitle>
          <SheetDescription>Search by suburb or postcode.</SheetDescription>
        </SheetHeader>
        <div className='grid gap-2 px-6'>
          <Label htmlFor='sheet-search'>Suburb or postcode</Label>
          <Input ref={search} id='sheet-search' type='search' />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function InitialFocusSection() {
  return (
    <ExampleSection
      title='Initial focus'
      description={
        <>
          When a sheet exists to fill in one field, pass that field&apos;s ref as{' '}
          <code>initialFocus</code> so the reader can start typing straight away.
        </>
      }
    >
      <Example
        code={`const search = useRef<HTMLInputElement>(null)

<SheetContent initialFocus={search}>
  …
  <Input ref={search} type="search" />
</SheetContent>`}
      >
        <InitialFocusExample />
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Filters for a list of results, kept in a sheet so the list keeps the width of the page.'
    >
      <Example
        layout='fill'
        surface='subtle'
        code={`<Sheet>
  <SheetTrigger render={<Button variant="outline" size="sm" />}>Filter</SheetTrigger>
  <SheetContent>
    <form className="flex flex-1 flex-col">
      <SheetHeader>
        <SheetTitle>Filter grants</SheetTitle>
        <SheetDescription>Show only the grants you are eligible for.</SheetDescription>
      </SheetHeader>
      <fieldset>…</fieldset>
      <SheetFooter>
        <SheetClose render={<Button />}>Show results</SheetClose>
        <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
      </SheetFooter>
    </form>
  </SheetContent>
</Sheet>`}
      >
        <div className='max-w-md space-y-4 rounded-md bg-background p-6 ring-1 ring-foreground/10'>
          <div className='flex items-center justify-between gap-4'>
            <h3 className='text-xl font-semibold'>24 grants found</h3>
            <Sheet>
              <SheetTrigger render={<Button variant='outline' size='sm' />}>Filter</SheetTrigger>
              <SheetContent>
                <form className='flex flex-1 flex-col' onSubmit={(event) => event.preventDefault()}>
                  <SheetHeader>
                    <SheetTitle>Filter grants</SheetTitle>
                    <SheetDescription>Show only the grants you are eligible for.</SheetDescription>
                  </SheetHeader>
                  <fieldset className='grid gap-3 px-6'>
                    <legend className='mb-3 font-semibold'>Who is applying</legend>
                    {['Individuals', 'Small businesses', 'Community groups'].map((label) => (
                      <Field key={label} orientation='horizontal' className='min-h-11 gap-4'>
                        <Checkbox name='applicant' value={label} />
                        <FieldLabel className='font-normal'>{label}</FieldLabel>
                      </Field>
                    ))}
                  </fieldset>
                  <SheetFooter>
                    <SheetClose render={<Button />}>Show results</SheetClose>
                    <SheetClose render={<Button variant='outline' />}>Cancel</SheetClose>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          </div>
          <p className='text-muted-foreground'>Grants are listed by closing date, soonest first.</p>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SheetDocs() {
  return (
    <DocsPage
      title='Sheet'
      npm={[
        'Sheet',
        'SheetTrigger',
        'SheetContent',
        'SheetHeader',
        'SheetTitle',
        'SheetDescription',
        'SheetFooter',
        'SheetClose',
      ]}
      registry='sheet'
      summary={
        <>
          A dialog anchored to an edge of the screen, for a task that sits beside the page rather
          than over its middle — filters, settings, a list of saved items. Base UI traps focus
          inside it, locks the page scroll, returns focus on close and dismisses it on Escape or an
          outside click.
        </>
      }
    >
      <DocsUsage
        use={[
          'Filters or settings that change the page behind them.',
          'Secondary content the reader dips into and closes, like saved items.',
          'A task with more content than a centred dialog comfortably holds.',
        ]}
        avoid={[
          'A short, focused task or question — use Dialog, or AlertDialog to confirm.',
          'A panel the reader drags away on a touch screen — use Drawer.',
          'The site’s main navigation on small screens — use MainNav.',
        ]}
      />
      <SidesSection />
      <CloseButtonSection />
      <InitialFocusSection />
      <InContextSection />
      <DocsApi description='Props of the Sheet root, plus the side set on SheetContent. Try them live in the Playground story.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * The side is a prop of `SheetContent`, not of the root the meta documents, so
 * the args type is widened to let the Playground switch it.
 */
type StoryArgs = ComponentProps<typeof Sheet> & { side?: Side }

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: SheetDocs },
  },
  args: {
    side: 'right',
    modal: true,
    disablePointerDismissal: false,
    onOpenChange: fn(),
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Set on SheetContent: the edge the sheet slides in from.',
      table: { category: 'Appearance' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the sheet is open on first render (uncontrolled).',
      table: { category: 'Behavior' },
    },
    open: {
      control: false,
      description: 'Whether the sheet is open. Pair with onOpenChange to control it.',
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
      description: 'Stops an outside click from closing the sheet. Escape still closes it.',
      table: { category: 'Behavior' },
    },
    onOpenChange: {
      description: 'Called when the sheet opens or closes (logged in the Actions panel).',
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
  render: ({ side, ...args }) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button />}>Your saved services</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Your saved services</SheetTitle>
          <SheetDescription>Services you saved to come back to later.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Your saved services' }),
    )
    // The popup is portaled, so query the whole document, not the canvas.
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Your saved services' },
      { timeout: 3000 },
    )
    await expect(sheet).toHaveAttribute('data-side', 'right')
    await closeOverlay('sheet-content')
  },
}

export const Playground: Story = {}
