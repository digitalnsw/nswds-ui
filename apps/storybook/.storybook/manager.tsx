// Relative import: Storybook's manager bundle uses esbuild and doesn't read
// tsconfig paths the way the preview Vite build does, so `@nswds/ui/lib/...`
// can't be used here without the package being built first.
import React from 'react'
import { Select } from 'storybook/internal/components'
import {
  addons,
  types,
  useGlobals,
  useStorybookState,
} from 'storybook/manager-api'
import {
  DEFAULT_THEME,
  getAccentSwatch,
  getColorHues,
  getHueLabel,
  getPrimarySwatch,
  resolveAccentHue,
  resolvePrimaryHue,
  type ThemeCategory,
} from '../../../packages/ui/src/lib/theme-palette'

// Auto-loaded by Storybook's manager bundle (no entry needed in main.ts).
// Registers a "Theme" panel tab alongside Controls/Actions/A11y so the
// primary/accent picker is reachable from every story, not just from
// `Tools / Colour Tools`. The panel writes the same globals the preview
// decorator reads (themeCategory, themePrimary, themeAccent), so picks
// propagate to all stories instantly.

const ADDON_ID = 'nswds/theme'
const PANEL_ID = `${ADDON_ID}/panel`
const CATEGORY_TOOL_ID = `${ADDON_ID}/category-tool`
const PRIMARY_TOOL_ID = `${ADDON_ID}/primary-tool`
const ACCENT_TOOL_ID = `${ADDON_ID}/accent-tool`

// Small coloured dot rendered next to each option's label in the toolbar
// dropdowns. Matches the in-panel swatch style.
const ToolbarSwatch = ({ hex }: { hex: string }) => (
  <span
    aria-hidden
    style={{
      display: 'inline-block',
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: hex,
      border: '1px solid rgba(0,0,0,0.15)',
      flexShrink: 0,
    }}
  />
)

const CategoryTool = React.memo(function CategoryTool() {
  const [globals, updateGlobals] = useGlobals()
  const category = (globals.themeCategory ??
    DEFAULT_THEME.category) as ThemeCategory
  const primaryHue = resolvePrimaryHue(
    category,
    globals.themePrimary as string | undefined
  )
  const accentHue = resolveAccentHue(
    category,
    primaryHue,
    globals.themeAccent as string | undefined
  )

  return (
    <Select
      ariaLabel="Theme category"
      size="small"
      defaultOptions={category}
      options={[
        { value: 'brand', title: 'Brand' },
        { value: 'aboriginal', title: 'Aboriginal' },
      ]}
      onSelect={(next) => {
        const nextCategory = next as ThemeCategory
        const nextPrimary = resolvePrimaryHue(nextCategory, primaryHue)
        const nextAccent = resolveAccentHue(
          nextCategory,
          nextPrimary,
          accentHue
        )
        updateGlobals({
          themeCategory: nextCategory,
          themePrimary: nextPrimary,
          themeAccent: nextAccent,
        })
      }}
    >
      Category
    </Select>
  )
})

const PrimaryTool = React.memo(function PrimaryTool() {
  const [globals, updateGlobals] = useGlobals()
  const category = (globals.themeCategory ??
    DEFAULT_THEME.category) as ThemeCategory
  const primaryHue = resolvePrimaryHue(
    category,
    globals.themePrimary as string | undefined
  )
  const accentHue = resolveAccentHue(
    category,
    primaryHue,
    globals.themeAccent as string | undefined
  )

  const options = getColorHues(category).map((hue) => ({
    value: hue,
    title: getHueLabel(category, hue),
    icon: <ToolbarSwatch hex={getPrimarySwatch(category, hue)} />,
  }))

  return (
    <Select
      ariaLabel="Primary colour"
      size="small"
      defaultOptions={primaryHue}
      options={options}
      icon={<ToolbarSwatch hex={getPrimarySwatch(category, primaryHue)} />}
      onSelect={(next) => {
        const nextPrimary = next as string
        const nextAccent = resolveAccentHue(category, nextPrimary, accentHue)
        updateGlobals({
          themePrimary: nextPrimary,
          themeAccent: nextAccent,
        })
      }}
    >
      Primary
    </Select>
  )
})

const AccentTool = React.memo(function AccentTool() {
  const [globals, updateGlobals] = useGlobals()
  const category = (globals.themeCategory ??
    DEFAULT_THEME.category) as ThemeCategory
  const primaryHue = resolvePrimaryHue(
    category,
    globals.themePrimary as string | undefined
  )
  const accentHue = resolveAccentHue(
    category,
    primaryHue,
    globals.themeAccent as string | undefined
  )

  const options = getColorHues(category)
    .filter((h) => h !== primaryHue)
    .map((hue) => ({
      value: hue,
      title: getHueLabel(category, hue),
      icon: <ToolbarSwatch hex={getAccentSwatch(category, hue)} />,
    }))

  return (
    <Select
      ariaLabel="Accent colour"
      size="small"
      defaultOptions={accentHue}
      options={options}
      icon={<ToolbarSwatch hex={getAccentSwatch(category, accentHue)} />}
      onSelect={(next) => {
        const nextAccent = next as string
        if (nextAccent === primaryHue) return
        updateGlobals({ themeAccent: nextAccent })
      }}
    >
      Accent
    </Select>
  )
})

const styles = {
  root: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 20,
    fontFamily: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  h3: {
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
    color: '#2e3438',
  },
  segmented: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 4,
    padding: 4,
    border: '1px solid #e6e6e6',
    borderRadius: 6,
    background: '#fafafa',
  },
  segmentBtn: (active: boolean) =>
    ({
      padding: '6px 12px',
      borderRadius: 4,
      border: 'none',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: active ? 700 : 500,
      background: active ? '#ffffff' : 'transparent',
      color: active ? '#2e3438' : '#73828c',
      boxShadow: active ? '0 1px 2px rgba(0,0,0,0.08)' : undefined,
    }) as const,
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
  },
  optionBtn: (active: boolean) =>
    ({
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      border: `1px solid ${active ? '#2e3438' : '#e6e6e6'}`,
      borderRadius: 6,
      background: '#ffffff',
      cursor: 'pointer',
      textAlign: 'left' as const,
      fontSize: 13,
      fontWeight: 500,
      color: '#2e3438',
    }) as const,
  swatch: (hex: string) =>
    ({
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: hex,
      border: '1px solid rgba(0,0,0,0.1)',
      flexShrink: 0,
    }) as const,
  shareBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
    padding: 12,
    border: '1px solid #e6e6e6',
    borderRadius: 6,
    background: '#fafafa',
  },
  shareLabel: { fontSize: 11, color: '#73828c' },
  shareUrl: {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: 11,
    wordBreak: 'break-all' as const,
    padding: 8,
    background: '#ffffff',
    border: '1px solid #e6e6e6',
    borderRadius: 4,
    color: '#2e3438',
  },
  copyBtn: {
    alignSelf: 'flex-end' as const,
    padding: '6px 12px',
    border: '1px solid #e6e6e6',
    borderRadius: 4,
    background: '#ffffff',
    cursor: 'pointer',
    fontSize: 12,
    color: '#2e3438',
  },
}

function ThemePanel() {
  const [globals, updateGlobals] = useGlobals()
  // Re-render when route/query changes so the share URL stays current.
  useStorybookState()

  const category = (globals.themeCategory ??
    DEFAULT_THEME.category) as ThemeCategory

  const primaryHue = resolvePrimaryHue(
    category,
    globals.themePrimary as string | undefined
  )
  const accentHue = resolveAccentHue(
    category,
    primaryHue,
    globals.themeAccent as string | undefined
  )

  const primaryHues = getColorHues(category)
  const accentHues = primaryHues.filter((h) => h !== primaryHue)

  const setCategory = (next: ThemeCategory) => {
    const nextPrimary = resolvePrimaryHue(next, primaryHue)
    const nextAccent = resolveAccentHue(next, nextPrimary, accentHue)
    updateGlobals({
      themeCategory: next,
      themePrimary: nextPrimary,
      themeAccent: nextAccent,
    })
  }

  const setPrimary = (next: string) => {
    const nextAccent = resolveAccentHue(category, next, accentHue)
    updateGlobals({ themePrimary: next, themeAccent: nextAccent })
  }

  const setAccent = (next: string) => {
    if (next === primaryHue) return
    updateGlobals({ themeAccent: next })
  }

  const [copied, setCopied] = React.useState(false)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore; clipboard may be blocked
    }
  }

  return (
    <div style={styles.root}>
      <section style={styles.section}>
        <h3 style={styles.h3}>Theme Category</h3>
        <div
          role="radiogroup"
          aria-label="Theme Category"
          style={styles.segmented}
        >
          <button
            type="button"
            role="radio"
            aria-checked={category === 'brand'}
            onClick={() => setCategory('brand')}
            style={styles.segmentBtn(category === 'brand')}
          >
            Brand Colors
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={category === 'aboriginal'}
            onClick={() => setCategory('aboriginal')}
            style={styles.segmentBtn(category === 'aboriginal')}
          >
            Aboriginal Colors
          </button>
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.h3}>Primary Color</h3>
        <div role="radiogroup" aria-label="Primary Color" style={styles.grid}>
          {primaryHues.map((hue) => {
            const active = hue === primaryHue
            return (
              <button
                key={hue}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPrimary(hue)}
                style={styles.optionBtn(active)}
              >
                <span
                  aria-hidden
                  style={styles.swatch(getPrimarySwatch(category, hue))}
                />
                <span>{getHueLabel(category, hue)}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.h3}>Accent Color</h3>
        <div role="radiogroup" aria-label="Accent Color" style={styles.grid}>
          {accentHues.map((hue) => {
            const active = hue === accentHue
            return (
              <button
                key={hue}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setAccent(hue)}
                style={styles.optionBtn(active)}
              >
                <span
                  aria-hidden
                  style={styles.swatch(getAccentSwatch(category, hue))}
                />
                <span>{getHueLabel(category, hue)}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.h3}>Share Theme</h3>
        <div style={styles.shareBlock}>
          <span style={styles.shareLabel}>
            Copy this URL to share your theme selection:
          </span>
          <code style={styles.shareUrl}>{shareUrl}</code>
          <button type="button" onClick={copy} style={styles.copyBtn}>
            {copied ? 'Copied' : 'Copy URL'}
          </button>
        </div>
      </section>
    </div>
  )
}

const matchStoryOrDocs = ({
  viewMode,
  tabId,
}: {
  viewMode?: string
  tabId?: string
}) => !!(viewMode && /^(story|docs)$/.test(viewMode)) && !tabId

addons.register(ADDON_ID, () => {
  addons.add(CATEGORY_TOOL_ID, {
    title: 'Theme category',
    type: types.TOOL,
    match: matchStoryOrDocs,
    render: CategoryTool,
  })
  addons.add(PRIMARY_TOOL_ID, {
    title: 'Primary',
    type: types.TOOL,
    match: matchStoryOrDocs,
    render: PrimaryTool,
  })
  addons.add(ACCENT_TOOL_ID, {
    title: 'Accent',
    type: types.TOOL,
    match: matchStoryOrDocs,
    render: AccentTool,
  })
  addons.add(PANEL_ID, {
    title: 'Theme',
    type: types.PANEL,
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => (active ? <ThemePanel /> : null),
  })
})
