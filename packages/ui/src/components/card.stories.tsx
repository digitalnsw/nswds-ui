/**
 * Card — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Card/Features        → card.features.stories.tsx
 *   Components/Card/Accessibility   → card.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card.js'

const sizes = ['sm', 'default'] as const

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className="text-foreground max-w-3xl space-y-8">
          <section className="space-y-3">
            <h1 className="text-4xl font-bold tracking-normal">Card</h1>
            <p className="text-muted-foreground text-base">
              Card is a generic content container that groups related
              information into a bordered, rounded surface. It composes from
              header, title, description, action, content, and footer parts so
              consumers can assemble any layout without ad-hoc wrappers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Default</h2>
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>You have 3 unread messages.</CardDescription>
              </CardHeader>
              <CardContent>
                Manage how you receive emails and in-app alerts.
              </CardContent>
              <CardFooter>Updated just now.</CardFooter>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Sizes</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {sizes.map((size) => (
                <Card key={size} size={size}>
                  <CardHeader>
                    <CardTitle>Size: {size}</CardTitle>
                    <CardDescription>
                      Padding and gap scale with the size token.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>Card body content.</CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Card is a composable surface for grouping related content. Compose header, title, description, action, content, and footer parts to assemble dashboards, list rows, summary panels, or feature blocks without ad-hoc wrappers.',
      },
    },
  },
  args: {
    size: 'default',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes,
      description:
        'Padding and internal gap preset. Use "sm" for dense lists or compact dashboards.',
      table: { category: 'Appearance' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
  render: (args) => (
    <Card {...args} className="max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        Manage how you receive emails and in-app alerts.
      </CardContent>
      <CardFooter>Updated just now.</CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCard(canvasElement: HTMLElement) {
  const card = canvasElement.querySelector('[data-slot="card"]')
  if (!card) throw new Error('Could not find [data-slot="card"].')
  return card
}

function expectAttribute(
  element: Element,
  name: string,
  expectedValue: string
) {
  const receivedValue = element.getAttribute(name)
  if (receivedValue !== expectedValue) {
    throw new Error(
      `Expected ${name}="${expectedValue}", received "${receivedValue}".`
    )
  }
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 'default',
  },
  play: async ({ canvasElement }) => {
    const card = getCard(canvasElement)
    expectAttribute(card, 'data-size', 'default')
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
    <div className="border-border bg-background w-full max-w-xl rounded-sm border p-6">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Project status</CardTitle>
          <CardDescription>
            Quarterly summary across active workstreams.
          </CardDescription>
          <CardAction>
            <button className="text-primary text-xs font-medium underline-offset-4 hover:underline">
              View all
            </button>
          </CardAction>
        </CardHeader>
        <CardContent>
          12 tasks in review, 4 blocked, and 28 completed this sprint.
        </CardContent>
        <CardFooter>Last sync 5 minutes ago.</CardFooter>
      </Card>
    </div>
  ),
}
