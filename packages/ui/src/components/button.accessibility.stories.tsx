/**
 * Button — Accessibility
 *
 * Touch-target size validation and accessible interaction patterns.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

import { Button } from './button.js'
import { Icons } from './icons.js'

// ─── Constants ────────────────────────────────────────────────────────────────

type VariantKey = 'solid' | 'soft' | 'surface' | 'outline' | 'ghost' | 'link'
type SizeKey = 'sm' | 'default' | 'lg' | 'icon'
type ColorKey =
  | 'white'
  | 'grey'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'danger'

const lowContrastColors = ['white', 'secondary'] as const
const lowContrastSet = new Set<ColorKey>(lowContrastColors)

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Button/Accessibility',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Next',
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const docsTemplate = ({
  what,
  why,
  how,
  caveat,
}: {
  what: string
  why: string
  how: string
  caveat: string
}) =>
  `${what}\n\nWhy it matters: ${why}\n\nHow to test: ${how}\n\nCaveats: ${caveat}`

function needsGreySurface(color: ColorKey): boolean {
  return lowContrastSet.has(color)
}

function titleClasses(color: ColorKey): string {
  return needsGreySurface(color) ? 'text-grey-50' : 'text-foreground'
}

function bodyClasses(color: ColorKey): string {
  return needsGreySurface(color) ? 'text-grey-200' : 'text-muted-foreground'
}

function surfaceClasses(color: ColorKey): string {
  return needsGreySurface(color)
    ? 'rounded-sm border border-grey-700 bg-grey-800 p-4'
    : 'rounded-sm border border-border bg-background p-4'
}

function ThemeSurface({
  color,
  children,
  className,
}: {
  color: ColorKey
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`${surfaceClasses(color)}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}

function TapTargetPanel({
  color,
  compact = false,
}: {
  color: ColorKey
  compact?: boolean
}) {
  const items: ReadonlyArray<{
    id: string
    label: string
    variant: VariantKey
    size: SizeKey
    icon?: boolean
  }> = [
    { id: 'small-solid', label: 'Small', variant: 'solid', size: 'sm' },
    {
      id: 'small-outline',
      label: 'Small outline',
      variant: 'outline',
      size: 'sm',
    },
    {
      id: 'default-solid',
      label: 'Default',
      variant: 'solid',
      size: 'default',
    },
    {
      id: 'icon-ghost',
      label: 'Icon',
      variant: 'ghost',
      size: 'icon',
      icon: true,
    },
  ]

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <div className="flex flex-wrap items-start gap-5">
        {items.map((item) => (
          <div key={`${color}-${item.id}`} className="space-y-2">
            <div className="relative inline-flex items-center justify-center">
              <Button
                variant={item.variant}
                color={color}
                size={item.size}
                aria-label={item.icon ? 'More options' : undefined}
              >
                {item.icon ? <Icons.more_horiz data-slot="icon" /> : item.label}
              </Button>

              <span
                className="pointer-events-none absolute inset-0 rounded-sm border border-primary-500/70"
                aria-hidden="true"
              />

              <span
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-dashed border-red-400/80"
                style={{
                  width: 'max(100%, 2.75rem)',
                  height: 'max(100%, 2.75rem)',
                }}
                aria-hidden="true"
              />
            </div>
            <p className={`text-xs ${bodyClasses(color)}`}>
              {item.id.replaceAll('-', ' ')}
            </p>
          </div>
        ))}
      </div>

      <p className={`text-sm ${bodyClasses(color)}`}>
        Blue outline = visible button bounds. Red dashed outline = expanded
        touch target geometry (max(100%, 44px)) used on coarse-pointer devices.
      </p>
    </div>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const TapTarget: Story = {
  name: 'Touch Target',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Explicit touch-target visualization using primary and accent themes.',
          why: 'Prevents confusion between visible control size and expanded hit area semantics.',
          how: 'Compare blue (visible bounds) vs red dashed (expanded hit area) outlines on small and icon buttons.',
          caveat:
            'Dashed outline models CSS geometry (max(100%, 44px)) and is a visual aid only; it is not interactive DOM hit testing.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-6xl space-y-3">
      {(['primary', 'accent'] as const).map((color) => (
        <ThemeSurface key={`tap-target-${color}`} color={color}>
          <h4 className={`mb-3 text-sm font-semibold ${titleClasses(color)}`}>
            Theme: {color}
          </h4>
          <TapTargetPanel color={color} />
        </ThemeSurface>
      ))}
    </div>
  ),
}
