/**
 * Button — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Button/Features        → button.features.stories.tsx
 *   Components/Button/Accessibility   → button.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { cn } from '../lib/utils.js'

import { Button, ButtonLink } from './button.js'
import { Icons } from './icons.js'

const variants = [
  'solid',
  'soft',
  'surface',
  'outline',
  'ghost',
  'link',
] as const
const sizes = ['sm', 'default', 'lg', 'icon'] as const
const colors = [
  'white',
  'grey',
  'primary',
  'secondary',
  'tertiary',
  'accent',
  'danger',
  'success',
  'warning',
] as const

// Colour groupings used by the docs page. Brand colours track the active
// masterbrand theme (and the toolbar Primary/Accent pickers); semantic colours
// carry a fixed meaning regardless of theme; on-dark colours are designed to
// sit on coloured/dark surfaces (their light treatments don't read on white).
const brandColors = ['primary', 'tertiary', 'accent', 'grey'] as const
const onDarkColors = ['white', 'secondary'] as const
const semanticColors = ['danger', 'success', 'warning'] as const

// The variant treatments shown in each colour row of the colour matrix.
const matrixVariants = ['solid', 'soft', 'surface', 'outline'] as const

const variantDocs: ReadonlyArray<readonly [(typeof variants)[number], string]> =
  [
    ['solid', 'High emphasis — the single primary action on a screen.'],
    ['soft', 'Medium emphasis — a tinted fill with no border.'],
    ['surface', 'Medium emphasis — a subtle fill with a visible border.'],
    ['outline', 'Low emphasis — border only, transparent background.'],
    ['ghost', 'Low emphasis — no border or fill until hovered.'],
    ['link', 'Minimal — renders as inline underlined text.'],
  ]

// ─── Docs page building blocks ──────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

// A neutral, generously padded surface that frames live examples and gives
// each section plenty of breathing room.
function Preview({
  children,
  dark = false,
  className,
}: {
  children: React.ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-8',
        dark ? 'border-transparent bg-primary' : 'border-border bg-muted/40',
        className
      )}
    >
      {children}
    </div>
  )
}

function Cell({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex min-h-12 items-center">{children}</div>
      <span className="text-xs font-medium tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

// One row of the colour matrix: a colour name followed by that colour rendered
// across the key variant treatments, so the difference between brand and
// semantic colours is legible at a glance.
function ColorRow({
  color,
  dark = false,
}: {
  color: (typeof colors)[number]
  dark?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-1">
      <span
        className={cn(
          'w-20 shrink-0 text-sm font-semibold',
          dark ? 'text-primary-foreground' : 'text-foreground'
        )}
      >
        {color}
      </span>
      {matrixVariants.map((variant) => (
        <Button key={variant} color={color} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  )
}

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        // `sb-unstyled` opts these anchors out of Storybook's docs stylesheet,
        // whose unlayered `:where(a:not(.sb-unstyled a))` rule paints every link
        // blue + underlined and (being unlayered) beats Tailwind's layered
        // utilities. Without this, a Button rendered as a link (href) loses its
        // variant text colour *inside docs only* — it renders correctly in real
        // apps and in the story canvas. The `[&_code]` styles restore the inline
        // code chips that `sb-unstyled` would otherwise reset.
        <div className="sb-unstyled max-w-4xl space-y-16 py-2 text-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_code]:font-medium [&_code]:text-foreground">
          {/* Intro */}
          <section className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">Button</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Buttons let people take actions and make choices. Pair a{' '}
              <strong className="font-semibold text-foreground">variant</strong>{' '}
              (how much emphasis it carries) with a{' '}
              <strong className="font-semibold text-foreground">colour</strong>{' '}
              (which role it plays) — use one high-emphasis button for the
              primary action and quieter treatments for everything else.
            </p>
          </section>

          {/* Default */}
          <Section
            title="Default"
            description="A solid, primary-coloured button — the out-of-the-box configuration."
          >
            <Preview className="flex items-center">
              <Button>Continue</Button>
            </Preview>
          </Section>

          {/* Variants */}
          <Section
            title="Variants"
            description="The variant sets the visual weight. Step down the emphasis as actions become more secondary."
          >
            <Preview>
              <div className="flex flex-wrap items-center gap-8">
                {variants.map((variant) => (
                  <Cell key={variant} label={variant}>
                    <Button variant={variant}>
                      {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </Button>
                  </Cell>
                ))}
              </div>
            </Preview>
            <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {variantDocs.map(([name, desc]) => (
                <div key={name} className="flex gap-3 text-sm">
                  <dt className="w-16 shrink-0 font-semibold">{name}</dt>
                  <dd className="text-muted-foreground">{desc}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* Sizes */}
          <Section
            title="Sizes"
            description="Four presets. Use icon for square, icon-only buttons (always supply an aria-label)."
          >
            <Preview>
              <div className="flex flex-wrap items-end gap-8">
                <Cell label="sm">
                  <Button size="sm">Button</Button>
                </Cell>
                <Cell label="default">
                  <Button size="default">Button</Button>
                </Cell>
                <Cell label="lg">
                  <Button size="lg">Button</Button>
                </Cell>
                <Cell label="icon">
                  <Button
                    size="icon"
                    aria-label="Add"
                    leadingVisual={Icons.add}
                  />
                </Cell>
              </div>
            </Preview>
          </Section>

          {/* Colours */}
          <Section
            title="Colours"
            description="The colour prop maps to a semantic token — it does not hard-code a hue. Colours fall into three roles, each shown below across the main variants."
          >
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Brand colours</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Drawn from the active masterbrand theme and the toolbar
                    Primary / Accent pickers. Use <code>primary</code> for the
                    main action; <code>tertiary</code> and <code>accent</code>{' '}
                    for supporting actions; <code>grey</code> for neutral,
                    low-emphasis actions.
                  </p>
                </div>
                <Preview className="space-y-3">
                  {brandColors.map((color) => (
                    <ColorRow key={color} color={color} />
                  ))}
                </Preview>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">On dark surfaces</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Theme colours designed to sit on coloured or dark
                    backgrounds — their lighter treatments do not read on white.
                    Use <code>white</code> for a high-contrast action and{' '}
                    <code>secondary</code> for a softer one. Shown here on a
                    primary background.
                  </p>
                </div>
                <Preview dark className="space-y-3">
                  {onDarkColors.map((color) => (
                    <ColorRow key={color} color={color} dark />
                  ))}
                </Preview>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Semantic colours</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Fixed meanings that stay constant across themes. Reserve{' '}
                    <code>danger</code> for destructive actions, and use{' '}
                    <code>success</code> / <code>warning</code> sparingly for
                    status-driven actions.
                  </p>
                </div>
                <Preview className="space-y-3">
                  {semanticColors.map((color) => (
                    <ColorRow key={color} color={color} />
                  ))}
                </Preview>
              </div>
            </div>
          </Section>

          {/* With icons */}
          <Section
            title="With icons"
            description="Add a leadingVisual or trailingVisual to reinforce meaning. Keep icons to a single, recognisable glyph."
          >
            <Preview>
              <div className="flex flex-wrap items-center gap-8">
                <Cell label="leadingVisual">
                  <Button leadingVisual={Icons.add}>Add item</Button>
                </Cell>
                <Cell label="trailingVisual">
                  <Button trailingVisual={Icons.arrow_forward}>Next</Button>
                </Cell>
                <Cell label="icon only">
                  <Button
                    aria-label="Search"
                    leadingVisual={Icons.search}
                    size="icon"
                  />
                </Cell>
              </div>
            </Preview>
          </Section>

          {/* States */}
          <Section
            title="States"
            description="Loading shows a spinner and blocks interaction; disabled removes the button from the tab order and dims it."
          >
            <Preview>
              <div className="flex flex-wrap items-center gap-8">
                <Cell label="default">
                  <Button>Save</Button>
                </Cell>
                <Cell label="loading">
                  <Button loading>Save</Button>
                </Cell>
                <Cell label="disabled">
                  <Button disabled>Save</Button>
                </Cell>
              </div>
            </Preview>
          </Section>

          {/* As a link */}
          <Section
            title="As a link"
            description="ButtonLink renders an anchor element with the button's full visual treatment — useful for navigation that should look like an action. It stays keyboard- and screen-reader-accessible."
          >
            <Preview className="flex flex-wrap items-center gap-8">
              <Cell label="solid">
                <ButtonLink
                  href="#"
                  variant="solid"
                  trailingVisual={Icons.arrow_forward}
                >
                  View documentation
                </ButtonLink>
              </Cell>
              <Cell label="outline">
                <ButtonLink
                  href="#"
                  variant="outline"
                  trailingVisual={Icons.arrow_forward}
                >
                  View documentation
                </ButtonLink>
              </Cell>
              <Cell label="link">
                <ButtonLink
                  href="#"
                  variant="link"
                  trailingVisual={Icons.arrow_forward}
                >
                  View documentation
                </ButtonLink>
              </Cell>
            </Preview>
          </Section>
        </div>
      ),
      description: {
        component:
          'High-detail button stories for design QA, interaction regression testing, and accessibility verification. Stories are organized by **theme first** and include matrix, stress, and touch-target diagnostics.',
      },
    },
  },
  args: {
    children: 'Continue',
    variant: 'solid',
    color: 'primary',
    size: 'default',
    disabled: false,
    loading: false,
    block: false,
    alignContent: 'center',
    onClick: fn(),
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button label/content.',
      table: { category: 'Content' },
    },
    leadingVisual: {
      control: 'select',
      options: ['none', 'arrow_forward', 'add', 'search', 'chevron_down'],
      mapping: {
        none: undefined,
        arrow_forward: Icons.arrow_forward,
        add: Icons.add,
        search: Icons.search,
        chevron_down: Icons.expand_more,
      },
      description: 'Icon component rendered before the label.',
      table: { category: 'Content' },
    },
    trailingVisual: {
      control: 'select',
      options: ['none', 'arrow_forward', 'add', 'search', 'chevron_down'],
      mapping: {
        none: undefined,
        arrow_forward: Icons.arrow_forward,
        add: Icons.add,
        search: Icons.search,
        chevron_down: Icons.expand_more,
      },
      description: 'Icon component rendered after the label.',
      table: { category: 'Content' },
    },
    trailingAction: {
      control: 'select',
      options: ['none', 'arrow_forward', 'add', 'chevron_down'],
      mapping: {
        none: undefined,
        arrow_forward: Icons.arrow_forward,
        add: Icons.add,
        chevron_down: Icons.expand_more,
      },
      description: 'Icon component rendered as a trailing action (far end).',
      table: { category: 'Content' },
    },
    labelWrap: {
      control: 'boolean',
      description: 'Allow the button label to wrap onto multiple lines.',
      table: { category: 'Content' },
    },
    count: {
      control: 'number',
      description: 'Optional numeric badge rendered after the label.',
      table: { category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables click/tap and applies disabled styles.',
      table: { category: 'Behavior' },
    },
    loading: {
      control: 'boolean',
      description: 'Shows a spinner and disables the button.',
      table: { category: 'Behavior' },
    },
    variant: {
      control: 'inline-radio',
      options: variants,
      description: 'Visual treatment of the button.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: colors,
      description: 'Theme token mapped to button foreground/background/border.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'Height/padding preset including icon-only mode.',
      table: { category: 'Appearance' },
    },
    block: {
      control: 'boolean',
      description: 'Stretches the button to fill its container width.',
      table: { category: 'Appearance' },
    },
    alignContent: {
      control: 'inline-radio',
      options: ['center', 'start'],
      description: 'Horizontal alignment of button content.',
      table: { category: 'Appearance' },
    },
    onClick: {
      description: 'Click handler (logged in Actions panel).',
      table: { category: 'Events' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for icon-only or non-text content.',
      table: { category: 'Accessibility' },
    },
    'aria-disabled': {
      control: 'boolean',
      description:
        'Marks the button as disabled without removing it from the tab order.',
      table: { category: 'Accessibility' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getButton(canvasElement: HTMLElement, name: string) {
  const button = Array.from(canvasElement.querySelectorAll('button')).find(
    (el) => el.textContent === name || el.getAttribute('aria-label') === name
  )

  if (!button) throw new Error(`Could not find button named "${name}".`)

  return button
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
    children: 'Continue',
    variant: 'solid',
  },
  play: async ({ canvasElement }) => {
    const button = getButton(canvasElement, 'Continue')
    expectAttribute(button, 'data-variant', 'solid')
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
    <div className="w-full max-w-xl rounded-sm border border-border bg-background p-6">
      <Button {...args}>{args.children}</Button>
    </div>
  ),
}
