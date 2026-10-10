/**
 * Tag — category labels, navigation and filters.
 *
 *   Components/Tag                → this file: Docs, Default, Playground
 *   Components/Tag/Features       → tag.features.stories.tsx
 *   Components/Tag/Accessibility  → tag.accessibility.stories.tsx
 *   Components/Tag/Tests          → tag.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { expect } from 'storybook/test'

import { Badge } from './badge.js'
import { Button } from './button.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
  ThemeSurface,
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

type TagColor = (typeof colors)[number]

const variantDocs: ReadonlyArray<readonly [(typeof variants)[number], string]> = [
  ['outline', 'The default — a quiet bordered label for a static category.'],
  ['soft', 'A tinted fill with no border, for a set of topics with more presence.'],
  ['surface', 'A subtle fill with a visible border. TagRemovable uses it by default.'],
  ['solid', 'High emphasis — a filled label for the one topic that leads.'],
]

const colourGroups: ReadonlyArray<{
  title: string
  description: string
  colors: readonly TagColor[]
  surface: 'default' | 'brand'
  code: string
}> = [
  {
    title: 'Brand colours',
    description:
      'Use a consistent colour for related topics. Primary, tertiary and accent follow the selected brand theme.',
    colors: ['primary', 'tertiary', 'accent', 'grey'],
    surface: 'default',
    code: `<Tag color="tertiary" variant="surface">Surface</Tag>`,
  },
  {
    title: 'Semantic colours',
    description:
      'Use these colours only when the category has a matching meaning. Use Badge for an item’s status.',
    colors: ['success', 'warning', 'danger'],
    surface: 'default',
    code: `<Tag color="warning">Bushfire season</Tag>`,
  },
  {
    title: 'On dark surfaces',
    description:
      'White and secondary are intended for dark backgrounds. Shown here on a primary background.',
    colors: ['white', 'secondary'],
    surface: 'brand',
    code: `<Tag color="white">Environment</Tag>`,
  },
]

// One row of the colour matrix: the colour's name, then that colour in every
// variant (Button's colour rows).
function ColourRow({ color }: { color: TagColor }) {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <span className='w-24 shrink-0 text-base font-semibold'>{color}</span>
      {variants.map((variant) => (
        <Tag key={variant} color={color} variant={variant}>
          {variant}
        </Tag>
      ))}
    </div>
  )
}

// ─── Interactive examples ─────────────────────────────────────────────────────

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

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

const components = [
  ['Tag', 'Displays a category or topic.'],
  ['TagLink', 'Navigates to related content.'],
  ['TagCheckbox', 'Selects or clears a filter.'],
  ['TagRemovable', 'Displays an applied filter with a remove button.'],
  ['TagButton', 'Performs an action related to the topic.'],
] as const

export function ChooseAComponentSection() {
  return (
    <ExampleSection
      title='Choose a component'
      description='Choose the component by what the tag does.'
    >
      <Example
        layout='grid'
        code={`import { Tag, TagLink, TagCheckbox, TagRemovable, TagButton } from '@nswds/ui'`}
      >
        <ExampleCell label='Tag'>
          <Tag>Environment</Tag>
        </ExampleCell>
        <ExampleCell label='TagLink'>
          <TagLink href='#topic-results'>Grants</TagLink>
        </ExampleCell>
        <ExampleCell label='TagCheckbox'>
          <TagCheckbox defaultChecked>Regional NSW</TagCheckbox>
        </ExampleCell>
        <ExampleCell label='TagRemovable'>
          <TagRemovable removeLabel='Remove Community filter' onRemove={() => {}}>
            Community
          </TagRemovable>
        </ExampleCell>
        <ExampleCell label='TagButton'>
          <TagButton>Show all topics</TagButton>
        </ExampleCell>
      </Example>
      <dl className='grid gap-6 sm:grid-cols-2'>
        {components.map(([name, description]) => (
          <div key={name} className='space-y-1'>
            <dt className='font-semibold'>{name}</dt>
            <dd className='text-muted-foreground'>{description}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
      description='A static category label with an outline. It does not respond to clicks.'
    >
      <Example code={'<Tag>Environment</Tag>'}>
        <ExampleCell label='outline · primary'>
          <div className='flex flex-wrap gap-3'>
            <Tag>Environment</Tag>
            <Tag>Education</Tag>
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description='Outline is the default. Use soft, surface or solid when a different level of emphasis is appropriate.'
    >
      <Example code={'<Tag variant="soft">Environment</Tag>'}>
        {variants.map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <Tag variant={variant}>Environment</Tag>
          </ExampleCell>
        ))}
      </Example>
      <dl className='grid gap-x-8 gap-y-3 sm:grid-cols-2'>
        {variantDocs.map(([name, desc]) => (
          <div key={name} className='flex gap-3 text-base'>
            <dt className='w-20 shrink-0 font-semibold'>{name}</dt>
            <dd className='text-muted-foreground'>{desc}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

export function LinksSection() {
  return (
    <ExampleSection
      title='Links'
      description={
        <>
          Use TagLink to navigate to content in a category. The tag has hover feedback and a
          keyboard focus outline; its text stays ununderlined. It routes through <code>Link</code>,
          so a framework link set on <code>LinkProvider</code> applies.
        </>
      }
    >
      <Example
        layout='stack'
        code={'<TagLink href="/grants?topic=environment">Environment</TagLink>'}
      >
        <div className='w-full space-y-6'>
          <nav aria-label='Grant topics' className='flex flex-wrap gap-3'>
            <TagLink href='#environment-grants'>Environment</TagLink>
            <TagLink href='#education-grants'>Education</TagLink>
          </nav>
          <div className='grid gap-6 sm:grid-cols-2'>
            <section id='environment-grants' className='space-y-2'>
              <h3 className='text-lg font-semibold'>Environment grants</h3>
              <p className='text-muted-foreground'>
                Funding for community gardens and conservation projects.
              </p>
            </section>
            <section id='education-grants' className='space-y-2'>
              <h3 className='text-lg font-semibold'>Education grants</h3>
              <p className='text-muted-foreground'>Funding for learning and community training.</p>
            </section>
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function SelectableFiltersSection() {
  return (
    <ExampleSection
      title='Selectable filters'
      description='Use TagCheckbox for independent selections. Clicking or pressing Space toggles the selection. Manage checked and onCheckedChange to filter your results.'
    >
      <Example
        layout='fill'
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

export function RemovableFiltersSection() {
  return (
    <ExampleSection
      title='Removable filters'
      description='Only the remove button is interactive. Supply a specific removeLabel, update your selection in onRemove, and move focus to the next useful control when the tag disappears.'
    >
      <Example
        layout='fill'
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

export function TopicActionsSection() {
  return (
    <ExampleSection
      title='Topic actions'
      description='Use TagButton for a topic-specific action. Use Button for general page actions such as saving or submitting.'
    >
      <Example
        layout='fill'
        code={`<TagButton aria-expanded={expanded} onClick={toggle}>
  {expanded ? 'Fewer topics' : 'More topics'}
</TagButton>`}
      >
        <ActionExample />
      </Example>
    </ExampleSection>
  )
}

export function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description='Selectable tags support checked, indeterminate, disabled and readOnly states. The check mark identifies a selection without relying on colour alone.'
    >
      <Example code={'<TagCheckbox defaultChecked>Education</TagCheckbox>'}>
        <ExampleCell label='Unselected'>
          <TagCheckbox>Environment</TagCheckbox>
        </ExampleCell>
        <ExampleCell label='Selected'>
          <TagCheckbox defaultChecked>Education</TagCheckbox>
        </ExampleCell>
        <ExampleCell label='Mixed selection'>
          <TagCheckbox indeterminate>All regions</TagCheckbox>
        </ExampleCell>
        <ExampleCell label='Disabled'>
          <TagCheckbox disabled>Archived</TagCheckbox>
        </ExampleCell>
        <ExampleCell label='Read only'>
          <TagCheckbox readOnly defaultChecked>
            Regional NSW
          </TagCheckbox>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description='Every size uses 16px text; small has the tightest padding. Interactive tags keep a minimum 48px target at every size. Use a wrapping layout with space between tags.'
    >
      <Example code={'<TagLink size="sm" href="/grants">Grants</TagLink>'}>
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <div className='flex flex-wrap items-center gap-3'>
              <Tag size={size}>Environment</Tag>
              <TagLink size={size} href='#topic-results'>
                Grants
              </TagLink>
            </div>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description='Tag shares Button’s colour roles and supports light and dark themes.'
    >
      <div className='space-y-10'>
        {colourGroups.map((group) => (
          <div key={group.title} className='space-y-4'>
            <div className='space-y-1'>
              <h3 className='text-lg font-semibold'>{group.title}</h3>
              <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
                {group.description}
              </p>
            </div>
            <Example
              layout='stack'
              surface={group.surface}
              // Labels are measured against the page, so the page-surface rows
              // sit on it rather than on the tinted panel.
              className={group.surface === 'default' ? 'bg-background' : undefined}
              code={group.code}
            >
              {group.colors.map((color) => (
                <ColourRow key={color} color={color} />
              ))}
            </Example>
          </div>
        ))}
      </div>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Tags describe the grant’s topics. The badge beside the title shows its status.'
    >
      <Example
        layout='fill'
        code={`<h3>Community garden grants</h3>
<Badge color="success" dot>Open</Badge>
<Tag>Environment</Tag>
<Tag>Community</Tag>`}
      >
        <article
          id='topic-results'
          className='max-w-xl space-y-4 rounded-md border border-border bg-background p-6'
        >
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h3 className='text-xl font-semibold'>Community garden grants</h3>
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
          Tags organise content by category or topic. They can also link to related content, select
          filters or show filters that can be removed. Use Badge for status and counts.
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
      <ChooseAComponentSection />
      <DefaultSection />
      <VariantsSection />
      <LinksSection />
      <SelectableFiltersSection />
      <RemovableFiltersSection />
      <TopicActionsSection />
      <StatesSection />
      <SizesSection />
      <ColoursSection />
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
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: TagDocs, description: { component: 'Category labels, navigation and filters.' } },
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

export const Playground: Story = {
  render: (args) => (
    <ThemeSurface color={args.color ?? 'primary'}>
      <Tag {...args} />
    </ThemeSurface>
  ),
}
