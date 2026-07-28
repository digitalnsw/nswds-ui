/**
 * Badge — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Badge/Features        → badge.features.stories.tsx
 *   Components/Badge/Accessibility   → badge.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from './badge.js'

const variants = ['solid', 'soft', 'surface', 'outline'] as const
const sizes = ['sm', 'default', 'lg'] as const
const colors = [
  'primary/grey',
  'light',
  'primary/white',
  'white',
  'grey',
  'primary',
  'secondary',
  'tertiary',
  'accent',
] as const

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Badge</h1>
            <p className='text-base text-muted-foreground'>
              Badges are small inline pills used to indicate status, count, or category. The Badge
              component is presentational by default and becomes interactive when paired with
              BadgeButton, which expands the hit area to 44×44px and renders as a button or link.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Default</h2>
            <Badge>New</Badge>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Variants</h2>
            <div className='flex flex-wrap gap-3'>
              {variants.map((variant) => (
                <Badge key={variant} variant={variant}>
                  {variant}
                </Badge>
              ))}
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Colours</h2>
            <div className='flex flex-wrap gap-3'>
              {colors.map((color) => (
                <Badge key={color} color={color}>
                  {color}
                </Badge>
              ))}
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Badge — small inline pill used to indicate status, count, or category. Presentational by default; pair with BadgeButton for an interactive variant that exposes the correct role and an expanded touch target.',
      },
    },
  },
  args: {
    children: 'New',
    variant: 'soft',
    color: 'primary',
    size: 'default',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Badge label/content rendered inside the pill.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'inline-radio',
      options: variants,
      description: 'Visual treatment of the badge surface and border.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: colors,
      description: 'Theme token mapped to badge foreground/background/border.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'Height/padding preset for the badge label.',
      table: { category: 'Appearance' },
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBadge(canvasElement: HTMLElement, label: string) {
  const badge = Array.from(canvasElement.querySelectorAll('span[data-variant]')).find(
    (el) => el.textContent === label,
  ) as HTMLElement | undefined

  if (!badge) throw new Error(`Could not find badge labelled "${label}".`)

  return badge
}

function expectAttribute(element: Element, name: string, expectedValue: string) {
  const receivedValue = element.getAttribute(name)

  if (receivedValue !== expectedValue) {
    throw new Error(`Expected ${name}="${expectedValue}", received "${receivedValue}".`)
  }
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'New',
    variant: 'soft',
  },
  play: async ({ canvasElement }) => {
    const badge = getBadge(canvasElement, 'New')
    expectAttribute(badge, 'data-variant', 'soft')
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      // Compact view: Name + Control only, no description/type/default columns
      expanded: false,
      sort: 'requiredFirst',
    },
  },
  render: (args) => (
    <div className='w-full max-w-xl rounded-sm border border-border bg-background p-6'>
      <Badge {...args}>{args.children}</Badge>
    </div>
  ),
}
