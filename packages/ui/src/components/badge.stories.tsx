import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { IconCheck } from '../icons/check.js'
import { Badge } from './badge.js'
import {
  ExampleCell,
  ExampleCode,
  exampleDocsClassName,
  ExamplePreview,
  ExampleSection,
  ThemeSurface,
  titleClasses,
} from './story-helpers.js'

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

function VariantExamples() {
  return (
    <div className='flex flex-wrap gap-8'>
      {variants.map((variant) => (
        <ExampleCell key={variant} label={variant}>
          <Badge variant={variant}>New</Badge>
        </ExampleCell>
      ))}
    </div>
  )
}
function SizeExamples() {
  return (
    <div className='flex flex-wrap items-center gap-8'>
      {sizes.map((size) => (
        <ExampleCell key={size} label={size}>
          <Badge size={size} dot color='success'>
            Approved
          </Badge>
        </ExampleCell>
      ))}
    </div>
  )
}
function StatusExamples() {
  return (
    <div className='flex flex-wrap gap-3'>
      <Badge color='success' dot>
        Approved
      </Badge>
      <Badge color='warning' dot>
        Pending
      </Badge>
      <Badge color='danger' dot>
        Declined
      </Badge>
      <Badge color='grey' dot>
        Draft
      </Badge>
    </div>
  )
}
function CountExamples() {
  return (
    <div className='flex flex-wrap gap-8'>
      <span className='inline-flex items-center gap-2'>
        Applications <Badge color='grey'>3</Badge>
      </span>
      <span className='inline-flex items-center gap-2'>
        Unread messages <Badge>99+</Badge>
      </span>
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
            'Primary, tertiary and accent follow the selected brand theme. Grey provides a neutral label.',
          colors: ['primary', 'tertiary', 'accent', 'grey'] as const,
        },
        {
          title: 'Status colours',
          description:
            'Use success, warning and danger with a clear status label so the meaning is visible in the text.',
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
                <span className={`w-24 text-base font-semibold ${titleClasses(color)}`}>
                  {color}
                </span>
                {variants.map((variant) => (
                  <Badge key={variant} color={color} variant={variant}>
                    {variant}
                  </Badge>
                ))}
              </div>
            </ThemeSurface>
          ))}
        </div>
      ))}
    </div>
  )
}
function ApplicationExample() {
  return (
    <article className='max-w-xl space-y-4 rounded-md border border-border bg-background p-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h3 className='text-lg font-semibold'>Community garden grant</h3>
        <Badge color='success' dot>
          Approved
        </Badge>
      </div>
      <p className='text-muted-foreground'>
        Your application has been approved. We will email you the funding agreement.
      </p>
      <p className='text-base text-muted-foreground'>Application reference: CG-1042</p>
    </article>
  )
}
function BadgeDocs() {
  return (
    <div className={exampleDocsClassName}>
      <section className='space-y-4'>
        <h1 className='text-5xl font-bold tracking-tight'>Badge</h1>
        <p className='max-w-2xl text-lg leading-relaxed text-muted-foreground'>
          Badges show a status or count beside related content. They are informational and cannot be
          selected. Use Tag for categories, navigation and filters.
        </p>
      </section>
      <ExampleSection
        title='Default'
        description='A soft primary badge is the default. Keep labels short and meaningful.'
      >
        <ExamplePreview>
          <Badge>New</Badge>
        </ExamplePreview>
        <ExampleCode>{'<Badge>New</Badge>'}</ExampleCode>
      </ExampleSection>
      <ExampleSection
        title='Variants'
        description='Choose a visual treatment to suit the surrounding content. Soft is a quiet default; solid adds emphasis; surface and outline provide a visible border.'
      >
        <ExamplePreview>
          <VariantExamples />
        </ExamplePreview>
        <ExampleCode>{'<Badge variant="outline">New</Badge>'}</ExampleCode>
      </ExampleSection>
      <ExampleSection
        title='Status'
        description='Pair a status colour with a written label. The optional dot reinforces the status and is hidden from screen readers.'
      >
        <ExamplePreview>
          <StatusExamples />
        </ExamplePreview>
        <ExampleCode>{'<Badge color="success" dot>Approved</Badge>'}</ExampleCode>
      </ExampleSection>
      <ExampleSection
        title='Counts'
        description='Place the count next to the content it describes. A number alone does not explain what is being counted.'
      >
        <ExamplePreview>
          <CountExamples />
        </ExamplePreview>
        <ExampleCode>{'<span>Applications <Badge color="grey">3</Badge></span>'}</ExampleCode>
      </ExampleSection>
      <ExampleSection
        title='Sizes'
        description='Every size uses 16px text. Small has the tightest padding; default and large add more.'
      >
        <ExamplePreview>
          <SizeExamples />
        </ExamplePreview>
      </ExampleSection>
      <ExampleSection
        title='Colours'
        description='Badge uses the same colour roles as Button. Select the role that matches the meaning, then choose a variant.'
      >
        <ColourExamples />
      </ExampleSection>
      <ExampleSection
        title='With an icon'
        description='Use a single decorative icon alongside a visible label.'
      >
        <ExamplePreview>
          <Badge color='success'>
            <IconCheck aria-hidden /> Approved
          </Badge>
        </ExamplePreview>
        <ExampleCode>
          {'<Badge color="success"><IconCheck aria-hidden /> Approved</Badge>'}
        </ExampleCode>
      </ExampleSection>
      <ExampleSection
        title='In context'
        description='Keep the badge beside the item whose status it describes.'
      >
        <ApplicationExample />
      </ExampleSection>
    </div>
  )
}
const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      page: BadgeDocs,
      description: { component: 'An informational label for status and counts.' },
    },
  },
  args: { children: 'New', variant: 'soft', color: 'primary', size: 'default', dot: false },
  argTypes: {
    children: {
      control: 'text',
      description: 'Short status or count label.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'inline-radio',
      options: variants,
      description: 'Surface treatment.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: colors,
      description: 'Colour role shared with Button. White and secondary need a dark surface.',
      table: { category: 'Appearance' },
    },
    size: { control: 'inline-radio', options: sizes, table: { category: 'Appearance' } },
    dot: {
      control: 'boolean',
      description: 'Decorative dot beside the visible label.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot=badge]')).toHaveTextContent('New')
  },
}
export const Playground: Story = {
  render: (args) => (
    <ThemeSurface color={args.color ?? 'primary'}>
      <Badge {...args} />
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
      description='Use default for most content and small when space is limited.'
    >
      <ExamplePreview>
        <SizeExamples />
      </ExamplePreview>
    </ExampleSection>
  ),
}
export const Status: Story = {
  render: () => (
    <ExampleSection
      title='Status'
      description='A visible label carries the meaning; colour and a dot reinforce it.'
    >
      <ExamplePreview>
        <StatusExamples />
      </ExamplePreview>
    </ExampleSection>
  ),
}
export const Counts: Story = {
  render: () => (
    <ExampleSection title='Counts' description='Show each count beside the content it describes.'>
      <ExamplePreview>
        <CountExamples />
      </ExamplePreview>
    </ExampleSection>
  ),
}
export const WithIcon: Story = {
  render: () => (
    <ExampleSection
      title='With an icon'
      description='Keep the visible label and hide decorative icons from screen readers.'
    >
      <ExamplePreview>
        <Badge color='success'>
          <IconCheck aria-hidden /> Approved
        </Badge>
      </ExamplePreview>
    </ExampleSection>
  ),
}
export const InContext: Story = {
  render: () => (
    <ExampleSection
      title='Application status'
      description='Place the status beside the application title.'
    >
      <ApplicationExample />
    </ExampleSection>
  ),
}
