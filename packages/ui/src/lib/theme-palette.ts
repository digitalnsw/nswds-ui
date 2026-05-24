import { colorThemes, colors } from './color-palette.js'

export type ThemeCategory = 'brand' | 'aboriginal'

export type ThemeVars = Record<string, string>

const STEPS = [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800,
  850, 900, 950,
] as const

const GREY_KEY = 'grey'

export const DEFAULT_THEME = {
  category: 'brand' as ThemeCategory,
  primaryHue: 'blue',
  accentHue: 'red',
} as const

/**
 * Explicit hue lists per category. Matches the keys in `colorThemes[category]`
 * (minus grey) but kept hardcoded so the picker can't accidentally surface a
 * new hue that hasn't been reviewed for accessibility/contrast.
 */
export const BRAND_HUES = [
  'green',
  'teal',
  'blue',
  'purple',
  'fuchsia',
  'red',
  'orange',
  'yellow',
  'brown',
] as const

export const ABORIGINAL_HUES = [
  'red',
  'orange',
  'brown',
  'yellow',
  'green',
  'blue',
  'purple',
] as const

export function getColorHues(category: ThemeCategory): readonly string[] {
  return category === 'aboriginal' ? ABORIGINAL_HUES : BRAND_HUES
}

/** Hues valid as an accent for the given primary — excludes grey and the primary itself. */
export function getAccentHues(
  category: ThemeCategory,
  primaryHue: string,
): string[] {
  return getColorHues(category).filter((h) => h !== primaryHue)
}

/**
 * Strip "NSW" and "01"/"02"/"03"/"04" markers from an anchor name so it
 * displays cleanly in the picker. "NSW Green 01" → "Green",
 * "Earth Red" → "Earth Red".
 */
function prettifyName(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback
  return (
    raw
      .replace(/\b(NSW|0[1-4])\b/g, '')
      .replace(/\s+/g, ' ')
      .trim() || fallback
  )
}

/** Display label for a hue, derived from the canonical "01" anchor name. */
export function getHueLabel(category: ThemeCategory, hue: string): string {
  return prettifyName(colorThemes[category]?.[hue]?.colors[3]?.name, hue)
}

/** Swatch hex for a primary option — uses the -800 step (NSW 01 anchor). */
export function getPrimarySwatch(category: ThemeCategory, hue: string): string {
  return colorThemes[category]?.[hue]?.colors[3]?.hex ?? '#000000'
}

/** Swatch hex for an accent option — uses the -600 step (NSW 02 anchor). */
export function getAccentSwatch(category: ThemeCategory, hue: string): string {
  return colorThemes[category]?.[hue]?.colors[2]?.hex ?? '#000000'
}

/**
 * Coerce a requested hue into one that exists for the given category.
 * Returns the requested hue if valid, otherwise the first available hue,
 * otherwise the default.
 */
export function resolvePrimaryHue(
  category: ThemeCategory,
  requested: string | undefined,
): string {
  const hues = getColorHues(category)
  if (requested && hues.includes(requested)) return requested
  return hues[0] ?? DEFAULT_THEME.primaryHue
}

/** Same as resolvePrimaryHue but also avoids colliding with the primary. */
export function resolveAccentHue(
  category: ThemeCategory,
  primaryHue: string,
  requested: string | undefined,
): string {
  const hues = getAccentHues(category, primaryHue)
  if (requested && hues.includes(requested)) return requested
  return hues[0] ?? DEFAULT_THEME.accentHue
}

/**
 * Write the 19-step scale of `colors[category][hue].colors` into `vars` under
 * a given semantic slot. e.g. slot='primary' produces `--color-primary-50`
 * through `--color-primary-950`. Steps not present in the source are skipped.
 */
function writeScale(
  vars: ThemeVars,
  slot: 'primary' | 'accent' | 'grey',
  category: ThemeCategory,
  hue: string,
) {
  const scale = colors[category]?.[hue]?.colors
  if (!scale) return
  for (const entry of scale) {
    const m = entry.token.match(/-(\d+)$/)
    if (!m) continue
    vars[`--color-${slot}-${m[1]}`] = entry.oklch
  }
}

/**
 * Build a flat map of CSS custom properties to apply on `documentElement` for
 * the chosen category + primary + accent hues. The override targets the
 * Tailwind bridge scale vars (`--color-primary-50`…`-950`, `--color-accent-*`,
 * `--color-grey-*`) because those are what NSW components actually consume.
 *
 * Pass the result through `setProperty(...)` per key. Keys not returned should
 * be cleared with `removeProperty(...)` to fall back to globals.css.
 */
export function buildThemeVars(
  category: ThemeCategory,
  primaryHue: string,
  accentHue: string,
): ThemeVars {
  const vars: ThemeVars = {}
  writeScale(vars, 'primary', category, primaryHue)
  writeScale(vars, 'accent', category, accentHue)
  writeScale(vars, 'grey', category, GREY_KEY)
  return vars
}

/**
 * The complete set of CSS custom-property names that `buildThemeVars` may
 * write. The decorator clears any name in this list that isn't returned by a
 * given call, so toggling between palettes never leaves stale overrides.
 */
export const THEME_VAR_NAMES: readonly string[] = [
  ...STEPS.map((s) => `--color-primary-${s}`),
  ...STEPS.map((s) => `--color-accent-${s}`),
  ...STEPS.map((s) => `--color-grey-${s}`),
]
