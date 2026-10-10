/**
 * DropdownMenu — a menu of actions opened from a trigger, on the Base UI menu
 * primitive. Base UI owns roving focus, typeahead, submenus and dismissal.
 *
 *   Components/DropdownMenu        → this file: Docs, Default, Playground and
 *                                    one story per docs section
 *   Components/DropdownMenu/Tests  → dropdown-menu.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import {
  IconContentCopy,
  IconDelete,
  IconDownload,
  IconEdit,
  IconMoreHoriz,
  IconPrint,
} from '../icons/index.js'
import { Button } from './button.js'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  type DropdownMenuVariant,
} from './dropdown-menu.js'
import {
  closeOverlay,
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const looks: ReadonlyArray<readonly [DropdownMenuVariant, string]> = [
  ['default', 'Hairline — the highlighted row takes a tint, and keyboard focus adds a 2px ring.'],
  ['band', 'The highlighted row is a solid band in the action colour; rows run edge to edge.'],
  ['rule', 'A 4px rule caps the top edge, and a 4px rail marks the highlighted row.'],
]

/** The account menu every look is shown with. */
function AccountMenu({ variant, trigger }: { variant?: DropdownMenuVariant; trigger: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant='outline' />}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent variant={variant}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Signed in as Alex</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Notifications</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive'>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          <code>variant</code> on <code>DropdownMenuContent</code> picks one of three looks, shared
          with Dialog and AlertDialog. Each draws keyboard focus rather than relying on a tint,
          which alone is too faint to see. A submenu takes the look of the menu it opens from. Open
          a menu and use the arrow keys to see the focus treatment.
        </>
      }
    >
      <Example code={`<DropdownMenuContent variant="rule">…</DropdownMenuContent>`}>
        {looks.map(([look]) => (
          <ExampleCell key={look} label={look}>
            <AccountMenu variant={look} trigger={`My account (${look})`} />
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

function WithIconsSection() {
  return (
    <ExampleSection
      title='With icons'
      description={
        <>
          An icon leads its label inside the item. When only some rows have one, give the others{' '}
          <code>inset</code> so every label starts on the same line. A{' '}
          <code>DropdownMenuShortcut</code> sits at the end of the row.
        </>
      }
    >
      <Example
        code={`<DropdownMenuItem>
  <IconEdit /> Rename
  <DropdownMenuShortcut>F2</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem inset>Move to folder</DropdownMenuItem>`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant='outline' />}>Document</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <IconEdit aria-hidden='true' />
              Rename
              <DropdownMenuShortcut>F2</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconContentCopy aria-hidden='true' />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconDownload aria-hidden='true' />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPrint aria-hidden='true' />
              Print
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem inset>Move to folder</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Example>
    </ExampleSection>
  )
}

function GroupsAndLabelsSection() {
  return (
    <ExampleSection
      title='Groups and labels'
      description={
        <>
          Wrap related rows in <code>DropdownMenuGroup</code> and give it a{' '}
          <code>DropdownMenuLabel</code>: the label names the group for assistive tech, not just on
          screen. Divide groups with <code>DropdownMenuSeparator</code>.
        </>
      }
    >
      <Example
        code={`<DropdownMenuGroup>
  <DropdownMenuLabel>Your licences</DropdownMenuLabel>
  <DropdownMenuItem>Driver licence</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant='outline' />}>Renew</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Your licences</DropdownMenuLabel>
              <DropdownMenuItem>Driver licence</DropdownMenuItem>
              <DropdownMenuItem>Boat licence</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Your registrations</DropdownMenuLabel>
              <DropdownMenuItem>Car — ABC12D</DropdownMenuItem>
              <DropdownMenuItem>Trailer — T12345</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Example>
    </ExampleSection>
  )
}

function CheckboxesAndRadiosMenu() {
  const [showStatus, setShowStatus] = useState(true)
  const [showClosed, setShowClosed] = useState(false)
  const [sort, setSort] = useState('closing')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant='outline' />}>View options</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
            Application status
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showClosed} onCheckedChange={setShowClosed}>
            Closed grants
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value='closing'>Closing date</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='amount'>Grant amount</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='name'>Name</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CheckboxesAndRadiosSection() {
  return (
    <ExampleSection
      title='Checkboxes and radios'
      description={
        <>
          <code>DropdownMenuCheckboxItem</code> toggles a setting on or off;{' '}
          <code>DropdownMenuRadioItem</code>s in a <code>DropdownMenuRadioGroup</code> pick one of
          several. Both keep the menu open, so a reader can change more than one thing.
        </>
      }
    >
      <Example
        code={`<DropdownMenuCheckboxItem checked={showClosed} onCheckedChange={setShowClosed}>
  Closed grants
</DropdownMenuCheckboxItem>
<DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
  <DropdownMenuRadioItem value="closing">Closing date</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>`}
      >
        <CheckboxesAndRadiosMenu />
      </Example>
    </ExampleSection>
  )
}

function SubmenusSection() {
  return (
    <ExampleSection
      title='Submenus'
      description={
        <>
          <code>DropdownMenuSub</code> nests a menu behind a <code>DropdownMenuSubTrigger</code>.
          Right arrow opens it and left arrow returns. Keep to one level — a reader should not have
          to hunt through layers.
        </>
      }
    >
      <Example
        code={`<DropdownMenuSub>
  <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Drafts</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant='outline' />}>
            Application
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Drafts</DropdownMenuItem>
                <DropdownMenuItem>Submitted</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </Example>
    </ExampleSection>
  )
}

function LinksSection() {
  return (
    <ExampleSection
      title='Links'
      description={
        <>
          Use <code>DropdownMenuLinkItem</code> for a row that navigates. It renders a real anchor,
          so the browser keeps open-in-new-tab and the status bar, and it closes the menu as the
          page changes.
        </>
      }
    >
      <Example code={`<DropdownMenuLinkItem href="/help">Help and support</DropdownMenuLinkItem>`}>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant='outline' />}>Help</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLinkItem href='#help'>Help and support</DropdownMenuLinkItem>
            <DropdownMenuLinkItem href='#contact'>Contact us</DropdownMenuLinkItem>
            <DropdownMenuLinkItem href='#accessibility'>Accessibility</DropdownMenuLinkItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Example>
    </ExampleSection>
  )
}

function DestructiveAndDisabledSection() {
  return (
    <ExampleSection
      title='Destructive and disabled items'
      description={
        <>
          <code>variant=&quot;destructive&quot;</code> paints an item in the danger colour — keep it
          last, after a separator, and confirm it with an AlertDialog if it cannot be undone. A{' '}
          <code>disabled</code> item stays reachable by keyboard and is announced as unavailable,
          but does nothing.
        </>
      }
    >
      <Example
        code={`<DropdownMenuItem disabled>Submit application</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem variant="destructive">Delete draft</DropdownMenuItem>`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant='outline' />}>Draft</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Continue editing</DropdownMenuItem>
            <DropdownMenuItem disabled>Submit application</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>
              <IconDelete aria-hidden='true' />
              Delete draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A “More actions” menu at the end of a list row, opened from an icon-only button with an aria-label. The menu is never narrower than 192px, so it does not shrink to the button.'
    >
      <Example layout='fill' surface='subtle'>
        <div className='flex max-w-md items-center justify-between gap-4 rounded-md bg-background py-3 ps-6 pe-3 ring-1 ring-foreground/10'>
          <div>
            <p className='font-semibold'>Working with Children Check</p>
            <p className='text-muted-foreground'>Draft saved 3 October</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant='ghost'
                  iconOnly
                  aria-label='More actions for Working with Children Check'
                  leadingVisual={IconMoreHoriz}
                />
              }
            />
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>Continue application</DropdownMenuItem>
              <DropdownMenuItem>Download a copy</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive'>Delete draft</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function DropdownMenuDocs() {
  return (
    <DocsPage
      title='DropdownMenu'
      npm={[
        'DropdownMenu',
        'DropdownMenuTrigger',
        'DropdownMenuContent',
        'DropdownMenuGroup',
        'DropdownMenuLabel',
        'DropdownMenuItem',
        'DropdownMenuLinkItem',
        'DropdownMenuCheckboxItem',
        'DropdownMenuRadioGroup',
        'DropdownMenuRadioItem',
        'DropdownMenuSeparator',
        'DropdownMenuShortcut',
        'DropdownMenuSub',
        'DropdownMenuSubTrigger',
        'DropdownMenuSubContent',
      ]}
      registry='dropdown-menu'
      summary={
        <>
          A menu of actions, links and options that opens from a button. Base UI gives it roving
          focus with the arrow keys, typeahead, submenus, focus return to the trigger, and Escape or
          an outside click to dismiss. Rows are 44px tall and 16px in every look.
        </>
      }
    >
      <DocsUsage
        use={[
          'Several actions on one item, behind a “More actions” button.',
          'An account menu in page chrome.',
          'View options — what to show and how to sort — that change a list in place.',
        ]}
        avoid={[
          'Choosing a value for a form field — use Select or Combobox.',
          'Site or section navigation — use MainNav or SideNav.',
          'Supporting content rather than actions — use Popover.',
        ]}
      />
      <VariantsSection />
      <WithIconsSection />
      <GroupsAndLabelsSection />
      <CheckboxesAndRadiosSection />
      <SubmenusSection />
      <LinksSection />
      <DestructiveAndDisabledSection />
      <InContextSection />
      <DocsApi description='Props of the DropdownMenu root, plus the look set on DropdownMenuContent. Try them live in the Playground story.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * The look is a prop of `DropdownMenuContent`, not of the root the meta
 * documents, hence the widened args type.
 */
type StoryArgs = ComponentProps<typeof DropdownMenu> & { variant?: DropdownMenuVariant }

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: DropdownMenuDocs },
  },
  args: {
    variant: 'default',
    modal: true,
    loopFocus: true,
    disabled: false,
    onOpenChange: fn(),
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'band', 'rule'],
      description: 'The look, set on DropdownMenuContent: default (Hairline), band or rule.',
      table: { category: 'Appearance' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the menu is open on first render (uncontrolled).',
      table: { category: 'Behavior' },
    },
    open: {
      control: false,
      description: 'Whether the menu is open. Pair with onOpenChange to control it.',
      table: { category: 'Behavior' },
    },
    modal: {
      control: 'boolean',
      description: 'Lock page scroll and block outside interaction while the menu is open.',
      table: { category: 'Behavior' },
    },
    loopFocus: {
      control: 'boolean',
      description: 'Wrap arrow-key focus from the last row to the first, and back.',
      table: { category: 'Behavior' },
    },
    highlightItemOnHover: {
      control: 'boolean',
      description: 'Highlight a row when the pointer moves over it.',
      table: { category: 'Behavior' },
    },
    closeParentOnEsc: {
      control: 'boolean',
      description: 'In a submenu, whether Escape closes the whole menu rather than one level.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Stops the menu from opening.',
      table: { category: 'Behavior' },
    },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description: 'Which arrow keys move between rows.',
      table: { category: 'Accessibility' },
    },
    onOpenChange: {
      description: 'Called when the menu opens or closes (logged in the Actions panel).',
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
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant='outline' />}>My account</DropdownMenuTrigger>
      <DropdownMenuContent variant={variant}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Signed in as Alex</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Notifications</DropdownMenuItem>
          <DropdownMenuLinkItem href='#help'>Help and support</DropdownMenuLinkItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive'>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'My account' })
    await userEvent.click(trigger)

    const menu = await within(document.body).findByRole('menu')
    const items = within(menu).getAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Profile⇧⌘P',
      'Notifications',
      'Help and support',
      'Billing',
      'Sign out',
    ])
    // The link item is a real anchor, not a scripted div.
    await expect(within(menu).getByRole('menuitem', { name: 'Help and support' }).tagName).toBe('A')

    // Keyboard: ArrowDown from the trigger-opened menu lands on the first item.
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName(/^Profile/))

    // A disabled item stays reachable by keyboard, is announced as disabled,
    // and Enter on it does nothing — the menu stays open. (It takes no pointer
    // events at all, so a click cannot reach it.)
    const billing = within(menu).getByRole('menuitem', { name: 'Billing' })
    await expect(billing).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    await waitFor(() => expect(billing).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(document.querySelector('[data-slot="dropdown-menu-content"]')).toBeInTheDocument()

    await closeOverlay('dropdown-menu-content')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const WithIcons: Story = { name: 'With icons', render: () => <WithIconsSection /> }

export const GroupsAndLabels: Story = {
  name: 'Groups and labels',
  render: () => <GroupsAndLabelsSection />,
}

export const CheckboxesAndRadios: Story = {
  name: 'Checkboxes and radios',
  render: () => <CheckboxesAndRadiosSection />,
}

export const Submenus: Story = { name: 'Submenus', render: () => <SubmenusSection /> }

export const Links: Story = { name: 'Links', render: () => <LinksSection /> }

export const DestructiveAndDisabledItems: Story = {
  name: 'Destructive and disabled items',
  render: () => <DestructiveAndDisabledSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
