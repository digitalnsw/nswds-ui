/**
 * Tag — follows docs/reference-storybook-standard.md.
 *
 *   Components/Tag        → this file: Docs, Default, Playground and one story
 *                           per docs section
 *   Components/Tag/Tests  → tag.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { Badge } from './badge.js'
import { Button } from './button.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'
import { Tag, TagButton, TagCheckbox, TagLink, TagRemovable } from './tag.js'

const variants = ['solid', 'soft', 'surface', 'outline'] as const
const sizes = ['sm', 'default', 'lg'] as const
const colors = [
  'primary',
  'tertiary',
  'accent',
  'grey',
  'success',
  'warning',
  'danger',
  'white',
  'secondary',
] as const
const topics = ['Environment', 'Education', 'Regional NSW'] as const

function ColourRow({ color }: { color: (typeof colors)[number] }) {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <span className='w-24 shrink-0 font-semibold'>{color}</span>
      {variants.map((variant) => (
        <Tag key={variant} color={color} variant={variant}>
          {variant}
        </Tag>
      ))}
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description='Outline is the quiet default for a static category. Use soft, surface or solid when a set of topics needs more emphasis.'
    >
      <Example code={`<Tag variant="soft">Environment</Tag>`}>
        {variants.map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <Tag variant={variant}>Environment</Tag>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description='Every size keeps 16px text; sm has the tightest padding. Interactive tags reserve a 48px minimum target at every size, so give a row of them a wrapping layout with space between.'
    >
      <Example code={`<TagLink size="sm" href="/grants">Grants</TagLink>`}>
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <div className='flex flex-wrap items-center gap-3'>
              <Tag size={size}>Environment</Tag>
              <TagLink size={size} href='#grants'>
                Grants
              </TagLink>
            </div>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          Tag shares Button&apos;s colour roles. Give related topics one consistent colour. Use
          success, warning and danger only when the category itself carries that meaning — an
          item&apos;s status belongs in a Badge. <code>white</code> and <code>secondary</code> are
          for dark surfaces.
        </>
      }
    >
      <Example layout='stack' code={`<Tag color="tertiary" variant="surface">Surface</Tag>`}>
        {(['primary', 'tertiary', 'accent', 'grey'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
      <Example layout='stack' code={`<Tag color="warning">Bushfire season</Tag>`}>
        {(['success', 'warning', 'danger'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
      <Example layout='stack' surface='brand' code={`<Tag color="white">Environment</Tag>`}>
        {(['white', 'secondary'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
    </ExampleSection>
  )
}

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description='A selectable tag can be checked, mixed, disabled or read only. The check mark shows a selection without relying on colour alone.'
    >
      <Example code={`<TagCheckbox defaultChecked>Education</TagCheckbox>`}>
        <ExampleCell label='unchecked'>
          <TagCheckbox>Environment</TagCheckbox>
        </ExampleCell>
        <ExampleCell label='checked'>
          <TagCheckbox defaultChecked>Education</TagCheckbox>
        </ExampleCell>
        <ExampleCell label='indeterminate'>
          <TagCheckbox indeterminate>All regions</TagCheckbox>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <TagCheckbox disabled>Archived</TagCheckbox>
        </ExampleCell>
        <ExampleCell label='readOnly'>
          <TagCheckbox readOnly defaultChecked>
            Regional NSW
          </TagCheckbox>
        </ExampleCell>
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
          <code>TagLink</code> navigates to content in a category. It has hover feedback and a
          keyboard focus outline, and its text is never underlined. It routes through{' '}
          <code>Link</code>, so a framework link set on <code>LinkProvider</code> applies.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<TagLink href="/grants?topic=environment">Environment</TagLink>`}
      >
        <nav aria-label='Grant topics' className='flex flex-wrap gap-3'>
          <TagLink href='#environment-grants'>Environment</TagLink>
          <TagLink href='#education-grants'>Education</TagLink>
        </nav>
        <div className='grid gap-6 sm:grid-cols-2'>
          <div id='environment-grants' className='space-y-2'>
            <p className='font-semibold'>Environment grants</p>
            <p className='text-muted-foreground'>
              Funding for community gardens and conservation projects.
            </p>
          </div>
          <div id='education-grants' className='space-y-2'>
            <p className='font-semibold'>Education grants</p>
            <p className='text-muted-foreground'>Funding for learning and community training.</p>
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

function SelectableExample() {
  const [selected, setSelected] = useState<string[]>(['Environment'])
  return (
    <div className='space-y-4'>
      <fieldset className='space-y-3'>
        <legend className='font-semibold'>Filter by topic</legend>
        <div className='flex flex-wrap gap-3'>
          {topics.map((topic) => (
            <TagCheckbox
              key={topic}
              name='topic'
              value={topic}
              checked={selected.includes(topic)}
              onCheckedChange={(checked) =>
                setSelected((current) =>
                  checked ? [...current, topic] : current.filter((value) => value !== topic),
                )
              }
            >
              {topic}
            </TagCheckbox>
          ))}
        </div>
      </fieldset>
      <p aria-live='polite' className='text-base text-muted-foreground'>
        Selected topics: {selected.length ? selected.join(', ') : 'All topics'}
      </p>
    </div>
  )
}

function SelectableFiltersSection() {
  return (
    <ExampleSection
      title='Selectable filters'
      description={
        <>
          <code>TagCheckbox</code> is a Base UI checkbox shaped as a tag, for independent
          selections. Clicking or pressing Space toggles it. Control it with <code>checked</code>{' '}
          and <code>onCheckedChange</code> to filter your results.
        </>
      }
    >
      <Example
        code={`<TagCheckbox name="topic" value="environment"
  checked={isEnvironment} onCheckedChange={setIsEnvironment}>
  Environment
</TagCheckbox>`}
      >
        <SelectableExample />
      </Example>
    </ExampleSection>
  )
}

function RemovableExample() {
  const [selected, setSelected] = useState<string[]>(['Environment', 'Education'])
  const resetRef = useRef<HTMLButtonElement>(null)
  return (
    <div className='space-y-4'>
      <p className='font-semibold'>Applied filters</p>
      <div className='flex flex-wrap items-center gap-3'>
        {selected.map((topic) => (
          <TagRemovable
            key={topic}
            removeLabel={`Remove ${topic} filter`}
            onRemove={() => {
              setSelected((current) => current.filter((value) => value !== topic))
              resetRef.current?.focus()
            }}
          >
            {topic}
          </TagRemovable>
        ))}
        {selected.length === 0 && (
          <p role='status' className='text-muted-foreground'>
            No filters applied.
          </p>
        )}
      </div>
      <Button
        ref={resetRef}
        variant='outline'
        size='sm'
        onClick={() => setSelected(['Environment', 'Education'])}
      >
        Reset filters
      </Button>
    </div>
  )
}

function RemovableFiltersSection() {
  return (
    <ExampleSection
      title='Removable filters'
      description={
        <>
          <code>TagRemovable</code> shows an applied filter. Only its remove button is interactive:
          give it a specific <code>removeLabel</code>, update your selection in{' '}
          <code>onRemove</code>, and move focus to the next useful control once the tag is gone.
        </>
      }
    >
      <Example
        code={`<TagRemovable removeLabel="Remove Environment filter"
  onRemove={removeEnvironment}>
  Environment
</TagRemovable>`}
      >
        <RemovableExample />
      </Example>
    </ExampleSection>
  )
}

function ActionExample() {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <Tag>Environment</Tag>
      <Tag>Education</Tag>
      {expanded && (
        <>
          <Tag>Regional NSW</Tag>
          <Tag>Community</Tag>
        </>
      )}
      <TagButton aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
        {expanded ? 'Fewer topics' : 'More topics'}
      </TagButton>
    </div>
  )
}

function TopicActionsSection() {
  return (
    <ExampleSection
      title='Topic actions'
      description={
        <>
          <code>TagButton</code> performs an action that belongs to a set of topics, such as showing
          more of them. Page actions like saving or submitting use Button.
        </>
      }
    >
      <Example code={`<TagButton onClick={showMoreTopics}>More topics</TagButton>`}>
        <ActionExample />
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Tags describe the grant’s topics; the badge beside its title shows its status.'
    >
      <Example layout='fill' surface='subtle'>
        <article className='max-w-xl space-y-4 rounded-md bg-background p-6 ring-1 ring-foreground/10'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <p className='text-xl font-semibold'>Community garden grants</p>
            <Badge color='success' dot>
              Open
            </Badge>
          </div>
          <p className='text-muted-foreground'>
            Funding for local organisations to create and improve shared gardens.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Tag>Environment</Tag>
            <Tag>Community</Tag>
            <Tag>Regional NSW</Tag>
          </div>
        </article>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function TagDocs() {
  return (
    <DocsPage
      title='Tag'
      npm={['Tag', 'TagLink', 'TagCheckbox', 'TagRemovable', 'TagButton', 'tagVariants']}
      registry='tag'
      summary={
        <>
          Tags organise content by category or topic. Choose the export by what the tag does: a
          static <strong>Tag</strong> labels, <strong>TagLink</strong> navigates,{' '}
          <strong>TagCheckbox</strong> selects a filter, <strong>TagRemovable</strong> shows one
          that can be removed, and <strong>TagButton</strong> runs a topic action.
        </>
      }
    >
      <DocsUsage
        use={[
          'Labelling the categories or topics of a grant, service or article.',
          'Linking to more content in the same category — as a TagLink.',
          'Filtering search results by topic — as TagCheckbox, with applied filters as TagRemovable.',
        ]}
        avoid={[
          'Showing the status of an item, or a count — use Badge.',
          'Choosing one option from a set — use RadioGroup or ToggleGroup.',
          'A general page action such as Save or Submit — use Button.',
        ]}
      />
      <VariantsSection />
      <SizesSection />
      <ColoursSection />
      <StatesSection />
      <LinksSection />
      <SelectableFiltersSection />
      <RemovableFiltersSection />
      <TopicActionsSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: TagDocs },
  },
  args: { children: 'Environment', variant: 'outline', color: 'primary', size: 'default' },
  argTypes: {
    children: {
      control: 'text',
      description: 'Short category or topic label.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'inline-radio',
      options: variants,
      description: 'Surface treatment. TagCheckbox uses its own selection treatment.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: colors,
      description: 'Colour role shared with Button. White and secondary need a dark surface.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'Padding step. Text is 16px at every size.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Tag>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const tag = canvasElement.querySelector('[data-slot=tag]')
    await expect(tag).toHaveTextContent('Environment')
    await expect(tag).toHaveAttribute('data-variant', 'outline')
  },
}

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const Links: Story = { name: 'Links', render: () => <LinksSection /> }

export const Selectable: Story = {
  name: 'Selectable filters',
  render: () => <SelectableFiltersSection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const education = canvas.getByRole('checkbox', { name: 'Education' })
    await userEvent.click(education)
    await expect(education).toBeChecked()
    await expect(canvas.getByText('Selected topics: Environment, Education')).toBeVisible()
    await userEvent.keyboard(' ')
    await expect(education).not.toBeChecked()
  },
}

export const Removable: Story = {
  name: 'Removable filters',
  render: () => <RemovableFiltersSection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Environment filter' }))
    await expect(
      canvas.queryByRole('button', { name: 'Remove Environment filter' }),
    ).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Reset filters' })).toHaveFocus()
    await userEvent.click(canvas.getByRole('button', { name: 'Reset filters' }))
    await expect(canvas.getByRole('button', { name: 'Remove Environment filter' })).toBeVisible()
  },
}

export const Actions: Story = { name: 'Topic actions', render: () => <TopicActionsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
