import { Button } from '@nswds/ui/components/button'
import { cn } from '@nswds/ui/lib/utils'
import {
  DEFAULT_THEME,
  findAccent,
  findPrimary,
  getAccents,
  getPrimaries,
  type PaletteOption,
  type ThemeCategory,
} from '@nswds/ui/lib/theme-palette'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useGlobals } from 'storybook/preview-api'
import { useEffect, useState } from 'react'

const meta = {
  title: 'Tools/Colour Tools',
  parameters: {
    layout: 'fullscreen',
    docs: { disable: true },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 shrink-0 rounded-full border border-border"
      style={{ backgroundColor: color }}
    />
  )
}

type Option = PaletteOption

function OptionGrid({
  options,
  selectedId,
  onSelect,
  groupLabel,
}: {
  options: Option[]
  selectedId: string
  onSelect: (id: string) => void
  groupLabel: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={groupLabel}
      className="grid grid-cols-2 gap-2"
    >
      {options.map((option) => {
        const selected = option.id === selectedId
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(option.id)}
            className={cn(
              'flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              selected
                ? 'border-foreground bg-background'
                : 'border-border bg-background hover:bg-muted'
            )}
          >
            <Swatch color={option.swatch} />
            <span className="font-medium">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function ThemeSettings() {
  const [globals, updateGlobals] = useGlobals()

  const primaryId =
    (globals.themePrimary as string | undefined) ?? DEFAULT_THEME.primaryId
  const accentId =
    (globals.themeAccent as string | undefined) ?? DEFAULT_THEME.accentId

  // Category is derived from the chosen primary's palette, so the tab always
  // matches the rendered result.
  const category: ThemeCategory =
    findPrimary(primaryId)?.category ?? DEFAULT_THEME.category

  const primaries = getPrimaries(category)
  const accents = getAccents(category)

  // Switching the category tab swaps primary/accent to the equivalent slot
  // in the new palette (same hue if possible, otherwise the first option).
  const setCategory = (next: ThemeCategory) => {
    const nextPrimaries = getPrimaries(next)
    const nextAccents = getAccents(next)
    const currentPrimaryHue = findPrimary(primaryId)?.hue
    const currentAccentHue = findAccent(accentId)?.hue
    updateGlobals({
      themePrimary:
        nextPrimaries.find((p) => p.hue === currentPrimaryHue)?.id ??
        nextPrimaries[0]?.id,
      themeAccent:
        nextAccents.find((a) => a.hue === currentAccentHue)?.id ??
        nextAccents[0]?.id,
    })
  }

  const [shareUrl, setShareUrl] = useState('')
  useEffect(() => {
    // Read URL from the parent manager window when Storybook is iframed.
    const url =
      typeof window !== 'undefined'
        ? window.parent?.location?.href ?? window.location.href
        : ''
    setShareUrl(url)
  }, [globals.themePrimary, globals.themeAccent])

  const [copied, setCopied] = useState(false)
  const copy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API may be blocked in cross-origin iframes; fall back to a
      // visible select so the user can copy manually.
      const el = document.getElementById(
        'colour-tools-share-url'
      ) as HTMLTextAreaElement | null
      el?.select()
    }
  }

  return (
    <aside className="bg-background text-foreground flex h-full w-full max-w-md flex-col gap-6 border-l border-border p-6">
      <header className="flex items-start justify-between gap-2">
        <h2 className="text-xl font-semibold">Theme Settings</h2>
      </header>
      <p className="text-sm text-muted-foreground">
        Choose your primary and accent colors to customize the palette.
      </p>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Theme Category</h3>
        <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-1">
          <button
            type="button"
            onClick={() => setCategory('brand')}
            className={cn(
              'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
              category === 'brand'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Brand Colors
          </button>
          <button
            type="button"
            onClick={() => setCategory('aboriginal')}
            className={cn(
              'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
              category === 'aboriginal'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Aboriginal Colors
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Primary Color</h3>
        <OptionGrid
          options={primaries}
          selectedId={primaryId}
          onSelect={(id) => updateGlobals({ themePrimary: id })}
          groupLabel="Primary Color"
        />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Accent Color</h3>
        <OptionGrid
          options={accents}
          selectedId={accentId}
          onSelect={(id) => updateGlobals({ themeAccent: id })}
          groupLabel="Accent Color"
        />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Share Theme</h3>
        <label
          htmlFor="colour-tools-share-url"
          className="text-xs text-muted-foreground"
        >
          Copy this URL to share your theme selection:
        </label>
        <textarea
          id="colour-tools-share-url"
          readOnly
          value={shareUrl}
          rows={3}
          className="rounded-md border border-border bg-muted/40 p-2 font-mono text-xs"
          onFocus={(e) => e.currentTarget.select()}
        />
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? 'Copied' : 'Copy URL'}
        </Button>
      </section>
    </aside>
  )
}

function ColourPreview() {
  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Colour Tools</h1>
        <p className="text-sm text-muted-foreground">
          Pick a primary and accent — components below update via CSS custom
          properties.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>Primary action</Button>
        <Button color="accent">Accent action</Button>
        <Button variant="outline">Outline</Button>
        <Button color="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TokenSwatch name="--color-primary-200" />
        <TokenSwatch name="--color-primary-600" />
        <TokenSwatch name="--color-primary-800" />
        <TokenSwatch name="--color-accent-200" />
        <TokenSwatch name="--color-accent-600" />
        <TokenSwatch name="--color-grey-800" />
      </div>
    </div>
  )
}

function TokenSwatch({ name }: { name: string }) {
  const [resolved, setResolved] = useState('')
  useEffect(() => {
    const tick = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim()
      setResolved(v)
    }
    tick()
    // Re-read whenever the documentElement style attribute changes (our
    // decorator writes to it on every global update).
    const observer = new MutationObserver(tick)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    return () => observer.disconnect()
  }, [name])

  return (
    <div className="flex items-center gap-3 rounded-md border border-border p-3">
      <span
        aria-hidden="true"
        className="h-10 w-10 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: `var(${name})` }}
      />
      <div className="flex flex-col">
        <code className="font-mono text-sm font-medium">{name}</code>
        <code className="font-mono text-xs text-muted-foreground">
          {resolved || '—'}
        </code>
      </div>
    </div>
  )
}

export const ColourTools: Story = {
  render: () => (
    <div className="flex min-h-screen w-full bg-background">
      <ColourPreview />
      <ThemeSettings />
    </div>
  ),
}
