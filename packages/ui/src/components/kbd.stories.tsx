/**
 * Kbd — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/Kbd        → this file: Docs, Default, Playground and one
 *                           story per docs section
 *   Components/Kbd/Tests  → kbd.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Kbd, KbdGroup } from './kbd.js'
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

function SingleKeysSection() {
  return (
    <ExampleSection
      title='Single keys'
      description={
        <>
          One <code>Kbd</code> per key. Write the key as it is printed on the keyboard — a word for
          named keys, the character for the rest.
        </>
      }
    >
      <Example code={`<Kbd>Esc</Kbd>`}>
        <ExampleCell label='named key'>
          <Kbd>Esc</Kbd>
        </ExampleCell>
        <ExampleCell label='named key'>
          <Kbd>Enter</Kbd>
        </ExampleCell>
        <ExampleCell label='character'>
          <Kbd>/</Kbd>
        </ExampleCell>
        <ExampleCell label='symbol'>
          <Kbd>⌘</Kbd>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function KeyCombinationsSection() {
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

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Keys sit inline in running text, at the reading size of the sentence around them.'
    >
      <Example layout='stack'>
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

export const SingleKeys: Story = { name: 'Single keys', render: () => <SingleKeysSection /> }

export const KeyCombinations: Story = {
  name: 'Key combinations',
  render: () => <KeyCombinationsSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
