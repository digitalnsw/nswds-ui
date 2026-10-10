/**
 * Badge — an informational label for a status or a count.
 *
 *   Components/Badge                → this file: Docs, Default, Playground
 *   Components/Badge/Features       → badge.features.stories.tsx
 *   Components/Badge/Accessibility  → badge.accessibility.stories.tsx
 *   Components/Badge/Tests          → badge.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { IconCheck } from '../icons/check.js'
import { Badge } from './badge.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
  ThemeSurface,
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

type BadgeColor = (typeof colors)[number]

const variantDocs: ReadonlyArray<readonly [(typeof variants)[number], string]> = [
  ['solid', 'High emphasis — a filled label for the one status that matters most.'],
  ['soft', 'The quiet default — a tinted fill with no border.'],
  ['surface', 'A subtle fill with a visible border, for busy or tinted backgrounds.'],
  ['outline', 'Border only, on a transparent background.'],
]

const colourGroups: ReadonlyArray<{
  title: string
  description: string
  colors: readonly BadgeColor[]
  surface: 'default' | 'brand'
  code: string
}> = [
  {
    title: 'Brand colours',
    description:
      'Primary, tertiary and accent follow the selected brand theme. Grey provides a neutral label.',
    colors: ['primary', 'tertiary', 'accent', 'grey'],
    surface: 'default',
    code: `<Badge color="tertiary" variant="surface">Surface</Badge>`,
  },
  {
    title: 'Status colours',
    description:
      'Use success, warning and danger with a clear status label so the meaning is visible in the text.',
    colors: ['success', 'warning', 'danger'],
    surface: 'default',
    code: `<Badge color="warning">Pending</Badge>`,
  },
  {
    title: 'On dark surfaces',
    description:
      'White and secondary are intended for dark backgrounds. Shown here on a primary background.',
    colors: ['white', 'secondary'],
    surface: 'brand',
    code: `<Badge color="white">New</Badge>`,
  },
]

// One row of the colour matrix: the colour's name, then that colour in every
// variant, so a role's treatments read side by side (Button's colour rows).
function ColourRow({ color }: { color: BadgeColor }) {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <span className='w-24 shrink-0 text-base font-semibold'>{color}</span>
      {variants.map((variant) => (
        <Badge key={variant} color={color} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
      description='A soft primary badge is the default. Keep labels short and meaningful.'
    >
      <Example code={'<Badge>New</Badge>'}>
        <ExampleCell label='soft · primary'>
          <Badge>New</Badge>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description='Choose a visual treatment to suit the surrounding content. Soft is a quiet default; solid adds emphasis; surface and outline provide a visible border.'
    >
      <Example code={'<Badge variant="outline">New</Badge>'}>
        {variants.map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <Badge variant={variant}>New</Badge>
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

export function StatusSection() {
  return (
    <ExampleSection
      title='Status'
      description='Pair a status colour with a written label. The optional dot reinforces the status and is hidden from screen readers.'
    >
      <Example code={'<Badge color="success" dot>Approved</Badge>'}>
        <ExampleCell label='success'>
          <Badge color='success' dot>
            Approved
          </Badge>
        </ExampleCell>
        <ExampleCell label='warning'>
          <Badge color='warning' dot>
            Pending
          </Badge>
        </ExampleCell>
        <ExampleCell label='danger'>
          <Badge color='danger' dot>
            Declined
          </Badge>
        </ExampleCell>
        <ExampleCell label='grey'>
          <Badge color='grey' dot>
            Draft
          </Badge>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function CountsSection() {
  return (
    <ExampleSection
      title='Counts'
      description='Place the count next to the content it describes. A number alone does not explain what is being counted.'
    >
      <Example code={'<span>Applications <Badge color="grey">3</Badge></span>'}>
        <ExampleCell label='grey count'>
          <span className='inline-flex items-center gap-2'>
            Applications <Badge color='grey'>3</Badge>
          </span>
        </ExampleCell>
        <ExampleCell label='primary count'>
          <span className='inline-flex items-center gap-2'>
            Unread messages <Badge>99+</Badge>
          </span>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description='Every size uses 16px text. Small has the tightest padding; default and large add more.'
    >
      <Example code={'<Badge size="sm" color="success" dot>Approved</Badge>'}>
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <Badge size={size} dot color='success'>
              Approved
            </Badge>
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
      description='Badge uses the same colour roles as Button. Select the role that matches the meaning, then choose a variant.'
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
              // Outline and soft labels are measured against the page, so the
              // page-surface rows sit on it rather than on the tinted panel.
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

export function WithIconSection() {
  return (
    <ExampleSection
      title='With an icon'
      description='Use a single decorative icon alongside a visible label.'
    >
      <Example code={'<Badge color="success"><IconCheck aria-hidden /> Approved</Badge>'}>
        <ExampleCell label='icon before the label'>
          <Badge color='success'>
            <IconCheck aria-hidden /> Approved
          </Badge>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Keep the badge beside the item whose status it describes.'
    >
      <Example
        layout='fill'
        code={`<div className="flex items-center justify-between">
  <h3>Community garden grant</h3>
  <Badge color="success" dot>Approved</Badge>
</div>`}
      >
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
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function BadgeDocs() {
  return (
    <DocsPage
      title='Badge'
      npm={['Badge', 'badgeVariants']}
      registry='badge'
      summary={
        <>
          Badges show a status or count beside related content. They are informational and cannot be
          selected. Use Tag for categories, navigation and filters.
        </>
      }
    >
      <DocsUsage
        use={[
          'The status of an application, payment or request — Approved, Pending, Declined.',
          'A count beside the content it counts, such as unread messages.',
          'A short “New” or “Updated” marker on a listing.',
        ]}
        avoid={[
          'Labelling a category or topic, or filtering by one — use Tag.',
          'Explaining a problem or a next step in a sentence or more — use Callout.',
          'Anything a person should be able to press — use Button or Tag.',
        ]}
      />
      <DefaultSection />
      <VariantsSection />
      <StatusSection />
      <CountsSection />
      <SizesSection />
      <ColoursSection />
      <WithIconSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  excludeStories: /Section$/,
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
    dot: {
      control: 'boolean',
      description: 'Decorative dot beside the visible label. Hidden from screen readers.',
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
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'Padding step. Text is 16px at every size.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('[data-slot=badge]')
    await expect(badge).toHaveTextContent('New')
    await expect(badge).toHaveAttribute('data-variant', 'soft')
  },
}

export const Playground: Story = {
  render: (args) => (
    <ThemeSurface color={args.color ?? 'primary'}>
      <Badge {...args} />
    </ThemeSurface>
  ),
}
