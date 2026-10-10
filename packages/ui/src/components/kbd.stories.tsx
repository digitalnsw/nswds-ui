/**
 * Kbd — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/Kbd                → this file: Docs, Default, Playground
 *   Components/Kbd/Features       → kbd.features.stories.tsx
 *   Components/Kbd/Accessibility  → kbd.accessibility.stories.tsx
 *   Components/Kbd/Tests          → kbd.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import {
  IconKeyboardArrowDown,
  IconKeyboardArrowUp,
  IconKeyboardReturn,
  IconSearch,
} from '../icons/index.js'
import { Button } from './button.js'
import { Kbd, KbdGroup } from './kbd.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function SingleKeysSection() {
  return (
    <ExampleSection
      title='Single keys'
      description={
        <>
          One <code>Kbd</code> per key. Write the key as it is printed on the keyboard — a word for
          named keys like Esc and Enter, the character for letters and punctuation, and the symbol
          macOS prints for its modifier keys.
        </>
      }
    >
      <Example code={`<Kbd>Esc</Kbd>`}>
        <ExampleCell label='named key'>
          <Kbd>Esc</Kbd>
        </ExampleCell>
        <ExampleCell label='letter'>
          <Kbd>K</Kbd>
        </ExampleCell>
        <ExampleCell label='character'>
          <Kbd>/</Kbd>
        </ExampleCell>
        <ExampleCell label='symbol (macOS Command)'>
          <Kbd>⌘</Kbd>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function KeyCombinationsSection() {
  return (
    <ExampleSection
      title='Key combinations'
      description={
        <>
          <code>KbdGroup</code> sets several keys pressed together as one shortcut. It renders a
          wrapping <code>&lt;kbd&gt;</code> — the HTML for one input made of several keys.
        </>
      }
    >
      <Example
        code={`<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>`}
      >
        <ExampleCell label='Windows'>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </ExampleCell>
        <ExampleCell label='macOS'>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </ExampleCell>
        <ExampleCell label='three keys'>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>P</Kbd>
          </KbdGroup>
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
          For keys printed as a glyph — the arrows, Return — put the icon inside the{' '}
          <code>Kbd</code>; it is sized to the key. The icon says nothing to a screen reader, so
          hide it and add the key&apos;s name in visually hidden text.
        </>
      }
    >
      <Example
        code={`<Kbd>
  <IconKeyboardArrowUp aria-hidden="true" />
  <span className="sr-only">Up arrow</span>
</Kbd>`}
      >
        {(
          [
            ['Up arrow', IconKeyboardArrowUp],
            ['Down arrow', IconKeyboardArrowDown],
            ['Return', IconKeyboardReturn],
          ] as const
        ).map(([name, Icon]) => (
          <ExampleCell key={name} label={name}>
            <Kbd>
              <Icon aria-hidden='true' />
              <span className='sr-only'>{name}</span>
            </Kbd>
          </ExampleCell>
        ))}
        <ExampleCell label='icon and word'>
          <Kbd>
            <IconKeyboardReturn aria-hidden='true' />
            Enter
          </Kbd>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InATooltipSection() {
  return (
    <ExampleSection
      title='In a tooltip'
      description={
        <>
          Inside <code>TooltipContent</code> a key takes the tooltip&apos;s inverted colours — a
          translucent chip in the tooltip&apos;s text colour — so the shortcut reads as part of the
          label rather than a grey patch on it. Nothing to set: it follows from where it sits.
        </>
      }
    >
      <Example
        code={`<TooltipContent>
  Search <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
</TooltipContent>`}
      >
        <TooltipProvider>
          <ExampleCell label='on the page'>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </ExampleCell>
          <ExampleCell label='in a tooltip (hover or focus the button)'>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant='outline'
                    iconOnly
                    aria-label='Search'
                    leadingVisual={IconSearch}
                  />
                }
              />
              <TooltipContent>
                Search
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </TooltipContent>
            </Tooltip>
          </ExampleCell>
        </TooltipProvider>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Keys sit inline in running text, at the reading size of the sentence around them.'
    >
      <Example
        layout='stack'
        code={`<p>
  Press <Kbd>/</Kbd> to search Service NSW from any page, then <Kbd>Enter</Kbd> to see
  the results.
</p>`}
      >
        <p className='max-w-prose text-base'>
          Press <Kbd>/</Kbd> to search Service NSW from any page, then <Kbd>Enter</Kbd> to see the
          results.
        </p>
        <p className='max-w-prose text-base'>
          To save your application and finish it later, press{' '}
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>S</Kbd>
          </KbdGroup>
          .
        </p>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function KbdDocs() {
  return (
    <DocsPage
      title='Kbd'
      npm={['Kbd', 'KbdGroup']}
      registry='kbd'
      summary={
        <>
          Kbd shows a keyboard key, and KbdGroup a combination of keys, so people can see exactly
          what to press. It is presentational only — it describes a shortcut, it does not create
          one.
        </>
      }
    >
      <DocsUsage
        use={[
          'Telling people which key or shortcut performs an action.',
          'Listing the keyboard shortcuts a tool supports.',
          'Showing the shortcut beside a search field, as SiteSearch does.',
        ]}
        avoid={[
          'Showing code or a value someone should type — use a code element.',
          'Labelling a status or count — use Badge.',
          'Offering an action people can click — use Button.',
        ]}
      />
      <SingleKeysSection />
      <KeyCombinationsSection />
      <WithIconsSection />
      <InATooltipSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    docs: { page: KbdDocs },
  },
  args: {
    children: 'Esc',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The key, as printed on the keyboard.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The rendered key text is the whole contract for this presentational badge.
    const kbd = canvas.getByText('Esc')
    await expect(kbd).toBeInTheDocument()
    await expect(kbd).toHaveAttribute('data-slot', 'kbd')
  },
}

export const Playground: Story = {}
