/**
 * Menubar — Default + States + CheckboxRadio + Submenu + CssCheck
 *
 * The desktop "File / Edit / View" pattern: a horizontal row of menu triggers
 * on the Base UI Menubar container, with each dropdown a Base UI Menu.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './menubar.js'

const meta = {
  title: 'Components/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Menubar</h1>
            <p className='text-base text-muted-foreground'>
              A horizontal, always-visible row of menu triggers — the desktop
              &ldquo;File&nbsp;/&nbsp;Edit&nbsp;/&nbsp;View&rdquo; pattern. Base UI provides the
              full WAI-ARIA menubar behaviour: Left/Right roves between triggers, Down opens a menu,
              Up/Down move the item highlight, Escape dismisses, and typeahead matches item labels.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>Parts</h2>
            <p className='text-base text-muted-foreground'>
              Compose <code>MenubarMenu</code> trees inside the bar: <code>MenubarTrigger</code>{' '}
              opens a <code>MenubarContent</code> holding <code>MenubarItem</code>,{' '}
              <code>MenubarCheckboxItem</code>, <code>MenubarRadioGroup</code> /{' '}
              <code>MenubarRadioItem</code>, <code>MenubarSub</code> submenus,{' '}
              <code>MenubarSeparator</code> rules and <code>MenubarShortcut</code> hints. Shortcuts
              are visual only — wire the actual key handling in the app.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'A horizontal row of menu triggers (the desktop File/Edit/View pattern) on the Base UI Menubar + Menu primitives, with checkbox items, radio groups, submenus and shortcut hints.',
      },
    },
  },
  argTypes: {
    modal: {
      control: 'boolean',
      description:
        'Whether an open menu locks page scroll and outside pointer interaction. Base UI default: true.',
      table: { category: 'Behaviour' },
    },
    loopFocus: {
      control: 'boolean',
      description: 'Loop arrow-key focus from the last trigger back to the first.',
      table: { category: 'Behaviour' },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Arrow-key axis for roving between triggers.',
      table: { category: 'Behaviour' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the whole menubar.',
      table: { category: 'Behaviour' },
    },
    children: {
      table: { disable: true, category: 'Content' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Menubar>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Poll until `predicate` holds, so portal/transition state has time to settle. */
async function waitFor(predicate: () => boolean, message: string, timeout = 2000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (predicate()) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 16))
  }
  throw new Error(message)
}

/**
 * Open a menu the way a pointer would. Base UI's menubar triggers open on
 * mousedown (not click), so a bare `.click()` would not open them — and a
 * full mousedown→click sequence would immediately toggle back closed.
 */
function pointerOpen(trigger: Element) {
  trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }))
}

/**
 * Dispatch a keyboard event where Base UI listens for it: the focused element
 * inside the popup when the roving focus has landed, the popup itself
 * otherwise. Headless-safe — no hover, no trusted-event dependence.
 */
function pressKey(popup: HTMLElement, key: string) {
  const active = document.activeElement
  const target = active instanceof HTMLElement && popup.contains(active) ? active : popup
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
}

/** The open dropdown panel — portalled to <body>, so query the document. */
function findOpenMenu() {
  return document.querySelector<HTMLElement>(
    '[data-slot="menubar-content"], [data-slot="menubar-sub-content"]',
  )
}

function getTriggers(canvasElement: HTMLElement) {
  return Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="menubar-trigger"]'))
}

/** The canonical File / Edit / View example used by most stories. */
function DemoMenubar(props: React.ComponentProps<typeof Menubar>) {
  return (
    <Menubar {...props}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print… <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant='destructive'>Delete draft</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem defaultChecked>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Always Show Full URLs</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarLabel inset>Panel position</MenubarLabel>
            <MenubarRadioGroup defaultValue='bottom'>
              <MenubarRadioItem value='left'>Left</MenubarRadioItem>
              <MenubarRadioItem value='right'>Right</MenubarRadioItem>
              <MenubarRadioItem value='bottom'>Bottom</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => <DemoMenubar {...args} />,
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector<HTMLElement>('[data-slot="menubar"]')
    if (!bar) {
      throw new Error('Could not find [data-slot="menubar"].')
    }
    if (bar.getAttribute('role') !== 'menubar') {
      throw new Error(
        `Expected the Menubar container to render role="menubar", got "${bar.getAttribute('role')}".`,
      )
    }

    const triggers = getTriggers(canvasElement)
    if (triggers.length !== 3) {
      throw new Error(`Expected 3 menu triggers (File, Edit, View), got ${triggers.length}.`)
    }
    const file = triggers[0]!
    if (file.getAttribute('role') !== 'menuitem') {
      throw new Error('Expected triggers inside a menubar to render role="menuitem".')
    }

    // Open the File menu with a pointer gesture.
    pointerOpen(file)
    await waitFor(
      () => findOpenMenu() !== null,
      'Expected mousedown on the File trigger to open its menu.',
    )
    const popup = findOpenMenu()!
    await waitFor(
      () => popup.querySelectorAll('[data-slot="menubar-item"]').length > 0,
      'Expected the open File menu to contain menu items.',
    )
    if (!file.hasAttribute('data-popup-open')) {
      throw new Error('Expected the File trigger to carry data-popup-open while its menu is open.')
    }
    if (!popup.querySelector('[data-slot="menubar-shortcut"]')) {
      throw new Error('Expected the File menu to render shortcut hints.')
    }

    // ArrowDown highlights the first item…
    pressKey(popup, 'ArrowDown')
    await waitFor(
      () => popup.querySelector('[data-highlighted]') !== null,
      'Expected ArrowDown to highlight a menu item (data-highlighted).',
    )
    const first = popup.querySelector('[data-highlighted]')!

    // …and a second ArrowDown moves the highlight on.
    pressKey(popup, 'ArrowDown')
    await waitFor(() => {
      const current = popup.querySelector('[data-highlighted]')
      return current !== null && current !== first
    }, 'Expected a second ArrowDown to move the highlight to a different item.')

    // Escape dismisses the menu entirely.
    pressKey(popup, 'Escape')
    await waitFor(
      () => findOpenMenu() === null,
      'Expected Escape to close the menu and unmount its popup.',
    )
    if (file.hasAttribute('data-popup-open')) {
      throw new Error('Expected data-popup-open to clear from the trigger once the menu closed.')
    }
  },
}

export const CheckboxAndRadio: Story = {
  name: 'Checkbox and radio items',
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem defaultChecked>Always Show Full URLs</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarLabel inset>Panel position</MenubarLabel>
            <MenubarRadioGroup defaultValue='left'>
              <MenubarRadioItem value='left'>Left</MenubarRadioItem>
              <MenubarRadioItem value='right'>Right</MenubarRadioItem>
              <MenubarRadioItem value='bottom'>Bottom</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ canvasElement }) => {
    const trigger = getTriggers(canvasElement)[0]
    if (!trigger) {
      throw new Error('Could not find the View trigger.')
    }

    pointerOpen(trigger)
    await waitFor(() => findOpenMenu() !== null, 'Expected the View menu to open.')
    const popup = findOpenMenu()!

    // Checkbox: unchecked → activate → checked, without closing the menu.
    const checkboxes = popup.querySelectorAll<HTMLElement>('[data-slot="menubar-checkbox-item"]')
    if (checkboxes.length !== 2) {
      throw new Error(`Expected 2 checkbox items, got ${checkboxes.length}.`)
    }
    const [unchecked, prechecked] = [checkboxes[0]!, checkboxes[1]!]
    if (unchecked.hasAttribute('data-checked')) {
      throw new Error('Expected the first checkbox item to start unchecked.')
    }
    if (!prechecked.hasAttribute('data-checked')) {
      throw new Error('Expected defaultChecked to render the second checkbox item checked.')
    }
    const tick = prechecked.querySelector('[data-slot="menubar-checkbox-item-indicator"] svg')
    if (!tick) {
      throw new Error('Expected the checked item to render its tick indicator.')
    }
    // Decorative: aria-checked already announces the state, and the generated
    // icon components do not self-hide.
    if (tick.getAttribute('aria-hidden') !== 'true') {
      throw new Error('Expected the tick indicator icon to be aria-hidden.')
    }

    unchecked.click()
    await waitFor(
      () => unchecked.hasAttribute('data-checked'),
      'Expected activating the checkbox item to check it (data-checked).',
    )
    if (findOpenMenu() === null) {
      throw new Error('Expected the menu to stay open after toggling a checkbox item.')
    }

    // Radio group: selecting one item moves data-checked off the previous one.
    const radios = popup.querySelectorAll<HTMLElement>('[data-slot="menubar-radio-item"]')
    if (radios.length !== 3) {
      throw new Error(`Expected 3 radio items, got ${radios.length}.`)
    }
    const [left, right] = [radios[0]!, radios[1]!]
    if (!left.hasAttribute('data-checked')) {
      throw new Error('Expected defaultValue="left" to select the Left radio item.')
    }

    right.click()
    await waitFor(
      () => right.hasAttribute('data-checked') && !left.hasAttribute('data-checked'),
      'Expected selecting Right to move data-checked from Left to Right.',
    )
    // The dot indicator is decorative for the same reason as the tick.
    const dot = right.querySelector('[data-slot="menubar-radio-item-indicator"] svg')
    if (!dot || dot.getAttribute('aria-hidden') !== 'true') {
      throw new Error('Expected the selected radio item to render an aria-hidden dot indicator.')
    }

    // Leave the canvas tidy for the next story.
    pressKey(popup, 'Escape')
    await waitFor(() => findOpenMenu() === null, 'Expected Escape to close the View menu.')
  },
}

export const Submenu: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ canvasElement }) => {
    const trigger = getTriggers(canvasElement)[0]
    if (!trigger) {
      throw new Error('Could not find the File trigger.')
    }

    pointerOpen(trigger)
    await waitFor(() => findOpenMenu() !== null, 'Expected the File menu to open.')
    const popup = findOpenMenu()!

    const subTrigger = popup.querySelector<HTMLElement>('[data-slot="menubar-sub-trigger"]')
    if (!subTrigger) {
      throw new Error('Expected a [data-slot="menubar-sub-trigger"] item in the File menu.')
    }
    // Base UI wires the disclosure semantics; the chevron is decorative.
    if (subTrigger.getAttribute('aria-haspopup') !== 'menu') {
      throw new Error('Expected the submenu trigger to expose aria-haspopup="menu".')
    }
    const chevron = subTrigger.querySelector('svg[data-slot="icon"]')
    if (!chevron) {
      throw new Error('Expected the submenu trigger to render its trailing chevron icon.')
    }
    if (chevron.getAttribute('aria-hidden') !== 'true') {
      throw new Error('Expected the decorative chevron to be aria-hidden (aria-expanded speaks).')
    }

    pressKey(popup, 'Escape')
    await waitFor(() => findOpenMenu() === null, 'Expected Escape to close the File menu.')
  },
}

export const States: Story = {
  name: 'Item states',
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Document</MenubarLabel>
            <MenubarItem>
              Rename… <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem inset>Inset item</MenubarItem>
            <MenubarItem disabled>Disabled item</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem variant='destructive'>Delete draft</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ canvasElement }) => {
    const trigger = getTriggers(canvasElement)[0]
    if (!trigger) {
      throw new Error('Could not find the Edit trigger.')
    }

    pointerOpen(trigger)
    await waitFor(() => findOpenMenu() !== null, 'Expected the Edit menu to open.')
    const popup = findOpenMenu()!

    const inset = popup.querySelector<HTMLElement>('[data-slot="menubar-item"][data-inset]')
    if (!inset) {
      throw new Error('Expected the inset item to carry a bare data-inset attribute.')
    }
    const plain = popup.querySelector<HTMLElement>('[data-slot="menubar-item"]:not([data-inset])')
    if (!plain) {
      throw new Error('Expected non-inset items to omit data-inset entirely.')
    }
    if (
      parseFloat(getComputedStyle(inset).paddingLeft) <=
      parseFloat(getComputedStyle(plain).paddingLeft)
    ) {
      throw new Error('Expected data-inset to indent the item beyond the default padding.')
    }

    const disabled = popup.querySelector<HTMLElement>('[data-slot="menubar-item"][data-disabled]')
    if (!disabled) {
      throw new Error('Expected the disabled item to carry data-disabled.')
    }

    const destructive = popup.querySelector<HTMLElement>('[data-variant="destructive"]')
    if (!destructive) {
      throw new Error('Expected the destructive item to carry data-variant="destructive".')
    }
    if (getComputedStyle(destructive).color === getComputedStyle(plain).color) {
      throw new Error('Expected the destructive item to render in a different (danger) ink.')
    }

    pressKey(popup, 'Escape')
    await waitFor(() => findOpenMenu() === null, 'Expected Escape to close the Edit menu.')
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  render: () => <DemoMenubar />,
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the bar resolves the semantic --background
    // and --border tokens to real, non-transparent colours.
    const bar = canvasElement.querySelector<HTMLElement>('[data-slot="menubar"]')
    if (!bar) throw new Error('Menubar not found.')
    const styles = getComputedStyle(bar)
    if (styles.backgroundColor === '' || styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --background token to resolve to a visible colour, got "${styles.backgroundColor}". Is globals.css loaded?`,
      )
    }
    if (styles.borderTopColor === '' || styles.borderTopColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --border token to resolve to a visible colour, got "${styles.borderTopColor}".`,
      )
    }
  },
}

export const Playground: Story = {
  render: (args) => <DemoMenubar {...args} />,
  parameters: {
    controls: {
      expanded: false,
    },
  },
}
