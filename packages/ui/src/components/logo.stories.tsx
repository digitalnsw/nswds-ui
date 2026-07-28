/**
 * Logo — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Logo/Features        → logo.features.stories.tsx
 *   Components/Logo/Accessibility   → logo.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Logo } from './logo.js'

const logoTypes = ['default', 'reversed', 'mono-white', 'mono-black'] as const

const meta = {
  title: 'Components/Logo',
  component: Logo,
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
            <h1 className='text-4xl font-bold tracking-normal'>Logo</h1>
            <p className='text-base text-muted-foreground'>
              The NSW Government waratah lockup. Use it as the primary brand mark on agency
              websites, applications, and digital products. Choose the variant that gives the
              strongest contrast against the surface behind the mark.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Default</h2>
            <Logo className='h-16 w-auto' />
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Variants</h2>
            <div className='flex flex-wrap items-center gap-6'>
              <div className='rounded-sm border border-border bg-background p-6'>
                <Logo logoType='default' className='h-16 w-auto' />
                <p className='mt-3 text-xs text-muted-foreground'>default</p>
              </div>
              <div className='rounded-sm border border-border bg-background p-6'>
                <Logo logoType='mono-black' className='h-16 w-auto' />
                <p className='mt-3 text-xs text-muted-foreground'>mono-black</p>
              </div>
              <div className='rounded-sm border border-grey-700 bg-grey-900 p-6'>
                <Logo logoType='reversed' className='h-16 w-auto' />
                <p className='mt-3 text-xs text-grey-200'>reversed</p>
              </div>
              <div className='rounded-sm border border-grey-700 bg-grey-900 p-6'>
                <Logo logoType='mono-white' className='h-16 w-auto' />
                <p className='mt-3 text-xs text-grey-200'>mono-white</p>
              </div>
            </div>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>Accessible name</h2>
            <p className='text-base text-muted-foreground'>
              The Logo renders a visually hidden &quot;NSW Government&quot; label immediately before
              the SVG so screen readers announce the mark by name. The SVG itself is decorative (
              <code>aria-hidden=&quot;true&quot;</code>) so assistive tech is not read the path
              data.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'NSW Government waratah lockup rendered as an inline SVG. Four colour treatments cover light, dark, and monochrome surfaces, and the mark carries a visually hidden accessible name for assistive technology.',
      },
    },
  },
  args: {
    logoType: 'default',
    className: 'h-16 w-auto',
  },
  argTypes: {
    logoType: {
      control: 'inline-radio',
      options: logoTypes,
      description:
        'Colour treatment of the waratah lockup. Pick the variant that gives strongest contrast against the surface behind the mark.',
      table: { category: 'Appearance' },
    },
    className: {
      control: 'text',
      description:
        'Tailwind utility classes forwarded to the underlying SVG element — used to control the size and any layout treatment.',
      table: { disable: true, category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Logo>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLogoSvg(canvasElement: HTMLElement): SVGSVGElement {
  const svg = canvasElement.querySelector('svg')
  if (!svg) throw new Error('Could not find the Logo svg element in canvas.')
  return svg
}

function getSrOnlyName(canvasElement: HTMLElement): HTMLSpanElement {
  const span = canvasElement.querySelector<HTMLSpanElement>('span.sr-only')
  if (!span) throw new Error('Could not find the sr-only accessible name span.')
  return span
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    logoType: 'default',
    className: 'h-16 w-auto',
  },
  play: async ({ canvasElement }) => {
    const svg = getLogoSvg(canvasElement)
    if (svg.getAttribute('aria-hidden') !== 'true') {
      throw new Error(
        `Expected the Logo svg to have aria-hidden="true", received "${svg.getAttribute(
          'aria-hidden',
        )}".`,
      )
    }

    const srOnly = getSrOnlyName(canvasElement)
    if (srOnly.textContent !== 'NSW Government') {
      throw new Error(`Expected sr-only text "NSW Government", received "${srOnly.textContent}".`)
    }
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
  render: (args) => {
    const onDarkSurface = args.logoType === 'reversed' || args.logoType === 'mono-white'
    const containerClasses = onDarkSurface
      ? 'w-full max-w-xl rounded-sm border border-grey-700 bg-grey-900 p-6'
      : 'w-full max-w-xl rounded-sm border border-border bg-background p-6'

    return (
      <div className={containerClasses}>
        <Logo {...args} />
      </div>
    )
  },
}
