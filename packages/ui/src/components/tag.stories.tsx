import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { Badge } from './badge.js'
import { Button } from './button.js'
import {
  ExampleCell,
  ExampleCode,
  exampleDocsClassName,
  ExamplePreview,
  ExampleSection,
  ThemeSurface,
  titleClasses,
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

function VariantExamples() {
  return (
    <div className='flex flex-wrap gap-8'>
      {variants.map((variant) => (
        <ExampleCell key={variant} label={variant}>
          <Tag variant={variant}>Environment</Tag>
        </ExampleCell>
      ))}
    </div>
  )
}
function SizeExamples() {
  return (
    <div className='flex flex-wrap gap-8'>
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
    </div>
  )
}
function ColourExamples() {
  return (
    <div className='space-y-8'>
      {[
        {
          title: 'Brand colours',
          description:
            'Use a consistent colour for related topics. Primary, tertiary and accent follow the selected brand theme.',
          colors: ['primary', 'tertiary', 'accent', 'grey'] as const,
        },
        {
          title: 'Semantic colours',
          description:
            'Use these colours only when the category has a matching meaning. Use Badge for an item’s status.',
          colors: ['success', 'warning', 'danger'] as const,
        },
        {
          title: 'On dark surfaces',
          description: 'White and secondary are intended for dark backgrounds.',
          colors: ['white', 'secondary'] as const,
        },
      ].map((group) => (
        <div key={group.title} className='space-y-3'>
          <h3 className='text-lg font-semibold'>{group.title}</h3>
          <p className='text-muted-foreground'>{group.description}</p>
          {group.colors.map((color) => (
            <ThemeSurface key={color} color={color}>
              <div className='flex flex-wrap items-center gap-3'>
                <span className={`w-20 text-sm font-semibold ${titleClasses(color)}`}>{color}</span>
                {variants.map((variant) => (
                  <Tag key={variant} color={color} variant={variant}>
                    {variant}
                  </Tag>
                ))}
              </div>
            </ThemeSurface>
          ))}
        </div>
      ))}
    </div>
  )
}
function LinkExamples() {
  return (
    <div className='space-y-6'>
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
      <p aria-live='polite' className='text-sm text-muted-foreground'>
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
    <div className='space-y-4'>
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
    </div>
  )
}
function StateExamples() {
  return (
    <div className='flex flex-wrap gap-8'>
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
    </div>
  )
}
function GrantExample() {
  return (
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
  )
}
function TagDocs() {
  return (
    <div className={exampleDocsClassName}>
      <section className='space-y-4'>
        <h1 className='text-5xl font-bold tracking-tight'>Tag</h1>
        <p className='max-w-2xl text-lg leading-relaxed text-muted-foreground'>
          Tags organise content by category or topic. They can also link to related content, select
          filters or show filters that can be removed. Use Badge for status and counts.
        </p>
      </section>
      <ExampleSection
        title='Choose a component'
        description='Choose the component by what the tag does.'
      >
        <dl className='grid gap-6 sm:grid-cols-2'>
          {[
            ['Tag', 'Displays a category or topic.'],
            ['TagLink', 'Navigates to related content.'],
            ['TagCheckbox', 'Selects or clears a filter.'],
            ['TagRemovable', 'Displays an applied filter with a remove button.'],
            ['TagButton', 'Performs an action related to the topic.'],
          ].map(([name, description]) => (
            <div key={name} className='space-y-1'>
              <dt className='font-semibold'>{name}</dt>
              <dd className='text-muted-foreground'>{description}</dd>
            </div>
          ))}
        </dl>
      </ExampleSection>
      <ExampleSection
        title='Default'
        description='A static category label with an outline. It does not respond to clicks.'
      >
        <ExamplePreview>
          <div className='flex flex-wrap gap-3'>
            <Tag>Environment</Tag>
            <Tag>Education</Tag>
          </div>
        </ExamplePreview>
        <ExampleCode>{'<Tag>Environment</Tag>'}</ExampleCode>
      </ExampleSection>
      <ExampleSection
        title='Variants'
        description='Outline is the default. Use soft, surface or solid when a different level of emphasis is appropriate.'
      >
        <ExamplePreview>
          <VariantExamples />
        </ExamplePreview>
        <ExampleCode>{'<Tag variant="soft">Environment</Tag>'}</ExampleCode>
      </ExampleSection>
      <ExampleSection
        title='Links'
        description='Use TagLink to navigate to content in a category. The tag has hover feedback and a keyboard focus outline; its text stays ununderlined.'
      >
        <ExamplePreview>
          <LinkExamples />
        </ExamplePreview>
        <ExampleCode>
          {'<TagLink href="/grants?topic=environment">Environment</TagLink>'}
        </ExampleCode>
      </ExampleSection>
      <ExampleSection
        title='Selectable filters'
        description='Use TagCheckbox for independent selections. Clicking or pressing Space toggles the selection. Manage checked and onCheckedChange to filter your results.'
      >
        <ExamplePreview>
          <SelectableExample />
        </ExamplePreview>
        <ExampleCode>
          {
            '<TagCheckbox name="topic" value="environment"\n  checked={isEnvironment} onCheckedChange={setIsEnvironment}>\n  Environment\n</TagCheckbox>'
          }
        </ExampleCode>
      </ExampleSection>
      <ExampleSection
        title='Removable filters'
        description='Only the remove button is interactive. Supply a specific removeLabel, update your selection in onRemove, and move focus to the next useful control when the tag disappears.'
      >
        <ExamplePreview>
          <RemovableExample />
        </ExamplePreview>
        <ExampleCode>
          {
            '<TagRemovable removeLabel="Remove Environment filter"\n  onRemove={removeEnvironment}>\n  Environment\n</TagRemovable>'
          }
        </ExampleCode>
      </ExampleSection>
      <ExampleSection
        title='Topic actions'
        description='Use TagButton for a topic-specific action. Use Button for general page actions such as saving or submitting.'
      >
        <ExamplePreview>
          <ActionExample />
        </ExamplePreview>
      </ExampleSection>
      <ExampleSection
        title='States'
        description='Selectable tags support checked, indeterminate, disabled and readOnly states. The check mark identifies a selection without relying on colour alone.'
      >
        <ExamplePreview>
          <StateExamples />
        </ExamplePreview>
      </ExampleSection>
      <ExampleSection
        title='Sizes'
        description='Small uses 14px text; default and large use 16px. Interactive tags keep a minimum 48px target at every size. Use a wrapping layout with space between tags.'
      >
        <ExamplePreview>
          <SizeExamples />
        </ExamplePreview>
      </ExampleSection>
      <ExampleSection
        title='Colours'
        description='Tag shares Button’s colour roles and supports light and dark themes.'
      >
        <ColourExamples />
      </ExampleSection>
      <ExampleSection
        title='In context'
        description='Tags describe the grant’s topics. The badge beside the title shows its status.'
      >
        <GrantExample />
      </ExampleSection>
    </div>
  )
}
const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
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
    size: { control: 'inline-radio', options: sizes, table: { category: 'Appearance' } },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Tag>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot=tag]')).toHaveTextContent('Environment')
  },
}
export const Playground: Story = {
  render: (args) => (
    <ThemeSurface color={args.color ?? 'primary'}>
      <Tag {...args} />
    </ThemeSurface>
  ),
}
export const Variants: Story = {
  render: () => (
    <ExampleSection title='Variants' description='Four treatments, shown with the primary colour.'>
      <ExamplePreview>
        <VariantExamples />
      </ExamplePreview>
    </ExampleSection>
  ),
}
export const Colours: Story = {
  render: () => (
    <ExampleSection title='Colours' description='Choose a colour role and a surface treatment.'>
      <ColourExamples />
    </ExampleSection>
  ),
}
export const Sizes: Story = {
  render: () => (
    <ExampleSection
      title='Sizes'
      description='Each example pairs a static category with a link. Interactive tags reserve a larger target.'
    >
      <ExamplePreview>
        <SizeExamples />
      </ExamplePreview>
    </ExampleSection>
  ),
}
export const Links: Story = {
  render: () => (
    <ExampleSection
      title='Category links'
      description='Select a topic to jump to its related content.'
    >
      <ExamplePreview>
        <LinkExamples />
      </ExamplePreview>
    </ExampleSection>
  ),
}
export const Selectable: Story = {
  render: () => (
    <ExampleSection
      title='Selectable filters'
      description='Choose any combination of topics. Click a selected tag again to clear it.'
    >
      <ExamplePreview>
        <SelectableExample />
      </ExamplePreview>
    </ExampleSection>
  ),
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
  render: () => (
    <ExampleSection
      title='Removable filters'
      description='Remove a topic with its close button. Reset filters restores the example.'
    >
      <ExamplePreview>
        <RemovableExample />
      </ExamplePreview>
    </ExampleSection>
  ),
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
export const Actions: Story = {
  render: () => (
    <ExampleSection
      title='Topic actions'
      description='Show or hide additional topics with a tag-shaped button.'
    >
      <ExamplePreview>
        <ActionExample />
      </ExamplePreview>
    </ExampleSection>
  ),
}
export const States: Story = {
  render: () => (
    <ExampleSection
      title='Selection states'
      description='Compare the available checkbox states. Disabled and read-only tags cannot be changed.'
    >
      <ExamplePreview>
        <StateExamples />
      </ExamplePreview>
    </ExampleSection>
  ),
}
export const InContext: Story = {
  render: () => (
    <ExampleSection
      title='Grant categories'
      description='Topics and status have different purposes and use different components.'
    >
      <GrantExample />
    </ExampleSection>
  ),
}
