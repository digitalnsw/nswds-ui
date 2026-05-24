import { colors } from './color-palette.js'

export type ThemeCategory = 'brand' | 'aboriginal'

export type PaletteOption = {
  id: string
  label: string
  /** Key into `colors[family]` — e.g. 'red', 'orange', 'green'. */
  hue: string
  /** OKLCH literal of the option's named anchor — used for swatch rendering. */
  value: string
  /** Same as `value`; kept for backwards compatibility with the panel UI. */
  swatch: string
}

export type ThemeVars = Record<string, string>

const STEPS = [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800,
  850, 900, 950,
] as const

/**
 * Look up the OKLCH value of a named anchor in the shared palette.
 * Throws at module load if a referenced anchor is renamed or removed in
 * color-palette.ts — that's intentional so the picker can't silently
 * fall back to wrong colours.
 */
function anchor(
  family: ThemeCategory,
  hue: string,
  anchorName: string,
): string {
  const set = colors[family]?.[hue]?.colors
  const entry = set?.find((c) => c.name === anchorName)
  if (!entry) {
    throw new Error(
      `theme-palette: anchor "${anchorName}" not found in colors.${family}.${hue}`,
    )
  }
  return entry.oklch
}

function brandPrimary(hue: string, label: string): PaletteOption {
  const value = anchor('brand', hue, `NSW ${label} 01`)
  return { id: hue, label, hue, value, swatch: value }
}

function brandAccent(hue: string, label: string): PaletteOption {
  const value = anchor('brand', hue, `NSW ${label} 02`)
  return { id: hue, label, hue, value, swatch: value }
}

function aboriginalOption(
  id: string,
  label: string,
  hue: string,
): PaletteOption {
  const value = anchor('aboriginal', hue, label)
  return { id, label, hue, value, swatch: value }
}

export const BRAND_PRIMARIES: PaletteOption[] = [
  brandPrimary('green', 'Green'),
  brandPrimary('teal', 'Teal'),
  brandPrimary('blue', 'Blue'),
  brandPrimary('purple', 'Purple'),
  brandPrimary('fuchsia', 'Fuchsia'),
  brandPrimary('red', 'Red'),
  brandPrimary('orange', 'Orange'),
  brandPrimary('yellow', 'Yellow'),
  brandPrimary('brown', 'Brown'),
]

export const BRAND_ACCENTS: PaletteOption[] = [
  brandAccent('green', 'Green'),
  brandAccent('teal', 'Teal'),
  brandAccent('blue', 'Blue'),
  brandAccent('purple', 'Purple'),
  brandAccent('red', 'Red'),
  brandAccent('orange', 'Orange'),
  brandAccent('yellow', 'Yellow'),
  brandAccent('brown', 'Brown'),
]

export const ABORIGINAL_PRIMARIES: PaletteOption[] = [
  aboriginalOption('earth-red', 'Earth Red', 'red'),
  aboriginalOption('deep-orange', 'Deep Orange', 'orange'),
  aboriginalOption('riverbed-brown', 'Riverbed Brown', 'brown'),
  aboriginalOption('bush-honey-yellow', 'Bush Honey Yellow', 'yellow'),
  aboriginalOption('bushland-green', 'Bushland Green', 'green'),
  aboriginalOption('billabong-blue', 'Billabong Blue', 'blue'),
  aboriginalOption('bush-plum', 'Bush Plum', 'purple'),
]

export const ABORIGINAL_ACCENTS: PaletteOption[] = [
  aboriginalOption('orange-ochre', 'Orange Ochre', 'orange'),
  aboriginalOption('firewood-brown', 'Firewood Brown', 'brown'),
  aboriginalOption('sandstone-yellow', 'Sandstone Yellow', 'yellow'),
  aboriginalOption('marshland-lime', 'Marshland Lime', 'green'),
  aboriginalOption('saltwater-blue', 'Saltwater Blue', 'blue'),
  aboriginalOption('spirit-lilac', 'Spirit Lilac', 'purple'),
]

export function getPrimaries(category: ThemeCategory): PaletteOption[] {
  return category === 'aboriginal' ? ABORIGINAL_PRIMARIES : BRAND_PRIMARIES
}

export function getAccents(category: ThemeCategory): PaletteOption[] {
  return category === 'aboriginal' ? ABORIGINAL_ACCENTS : BRAND_ACCENTS
}

export const DEFAULT_THEME = {
  category: 'brand' as ThemeCategory,
  primaryId: 'blue',
  accentId: 'red',
} as const

/**
 * Write the 19-step scale of `colors[family][hue].colors` into `vars` under a
 * given semantic slot name. e.g. slot='primary' produces `--color-primary-50`
 * through `--color-primary-950`. Steps not present in the source are skipped.
 */
function writeScale(
  vars: ThemeVars,
  slot: 'primary' | 'accent' | 'grey',
  family: ThemeCategory,
  hue: string,
) {
  const scale = colors[family]?.[hue]?.colors
  if (!scale) return
  for (const entry of scale) {
    const m = entry.token.match(/-(\d+)$/)
    if (!m) continue
    vars[`--color-${slot}-${m[1]}`] = entry.oklch
  }
}

/**
 * Build a flat map of CSS custom properties to apply on `documentElement` for
 * the given selection. The override targets the Tailwind bridge scale vars
 * (`--color-primary-50`…`-950`, `--color-accent-*`, `--color-grey-*`) because
 * those are what NSW components actually consume.
 *
 * Pass the result through `setProperty(...)` per key. Keys not returned should
 * be cleared with `removeProperty(...)` to fall back to globals.css.
 */
export function buildThemeVars(
  category: ThemeCategory,
  primaryId: string,
  accentId: string,
): ThemeVars {
  const primary = getPrimaries(category).find((p) => p.id === primaryId)
  const accent = getAccents(category).find((a) => a.id === accentId)

  const vars: ThemeVars = {}
  if (primary) writeScale(vars, 'primary', category, primary.hue)
  if (accent) writeScale(vars, 'accent', category, accent.hue)
  // Grey is category-driven: brand grey under Brand, aboriginal grey under Aboriginal.
  writeScale(vars, 'grey', category, 'grey')
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
