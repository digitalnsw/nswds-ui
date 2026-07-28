import { colorTokens, jsonTokens } from '@nswds/tokens'

// The colour palettes consumed by the Storybook theme picker are derived
// entirely from `@nswds/tokens` — the single source of truth. Nothing in this
// file hardcodes a colour value:
//   • `jsonTokens.global.{oklch,hex}` — canonical CSS strings, keyed by group
//     then token (e.g. `oklch['nsw-green']['nsw-green-50']`). Used for the
//     `--color-*` overrides and swatches.
//   • `colorTokens.global.oklch[group][step].$description` — carries the
//     bespoke palette names (e.g. "Galah Pink") used for picker labels.

type ColorEntry = {
  token: string
  oklch: string
  hex: string
  name?: string
}

type HueScale = {
  name: string
  colors: ColorEntry[]
}

type Category = 'brand' | 'aboriginal'

export type ColorPalette = Record<Category, Record<string, HueScale>>

// Hues to surface per category. `grey` is included so `buildThemeVars` can
// always write a grey ramp, even though the picker never offers it as a hue.
const CATEGORY_HUES: Record<Category, readonly string[]> = {
  brand: ['green', 'teal', 'blue', 'purple', 'fuchsia', 'red', 'orange', 'yellow', 'brown', 'grey'],
  aboriginal: ['red', 'orange', 'brown', 'yellow', 'green', 'blue', 'purple', 'grey'],
}

// The four steps that anchor each ramp — they carry a display name and are the
// only steps surfaced in the reduced `colorThemes` map. 200/400/600/800 map to
// the NSW "04/03/02/01" anchors respectively.
const ANCHOR_NAME_SUFFIX: Record<number, string> = {
  200: '04',
  400: '03',
  600: '02',
  800: '01',
}

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const tokenGroup = (category: Category, hue: string) =>
  category === 'aboriginal' ? `nsw-aboriginal-${hue}` : `nsw-${hue}`

const hueLabel = (category: Category, hue: string) =>
  category === 'aboriginal' ? `NSW Aboriginal ${capitalise(hue)}` : `NSW ${capitalise(hue)}`

/** Pull the bespoke palette name out of a token's `$description`. */
const bespokeName = (description: unknown): string | undefined => {
  if (typeof description !== 'string') return undefined
  return description.match(/palette\s+(.+?)\.\s*Step/i)?.[1]
}

/** Display name for an anchor step, or `undefined` for non-anchor steps. */
const anchorName = (
  category: Category,
  hue: string,
  step: number,
  description: unknown,
): string | undefined => {
  const suffix = ANCHOR_NAME_SUFFIX[step]
  if (!suffix) return undefined
  return category === 'aboriginal' ? bespokeName(description) : `NSW ${capitalise(hue)} ${suffix}`
}

const buildHue = (category: Category, hue: string): HueScale => {
  const group = tokenGroup(category, hue)
  const oklchByToken = jsonTokens.global.oklch[group] as Record<string, string>
  const hexByToken = jsonTokens.global.hex[group] as Record<string, string>
  const meta = colorTokens.global.oklch[group] as Record<string, { $description?: string }>

  const colors = Object.keys(meta).map((step): ColorEntry => {
    const token = `${group}-${step}`
    const name = anchorName(category, hue, Number(step), meta[step]?.$description)
    return {
      token,
      oklch: oklchByToken[token]!,
      hex: hexByToken[token]!,
      ...(name ? { name } : {}),
    }
  })

  return { name: hueLabel(category, hue), colors }
}

const buildCategory = (category: Category): Record<string, HueScale> =>
  Object.fromEntries(CATEGORY_HUES[category].map((hue) => [hue, buildHue(category, hue)]))

/** Full 19-step ramps for every hue, keyed by category. */
export const colors: ColorPalette = {
  brand: buildCategory('brand'),
  aboriginal: buildCategory('aboriginal'),
}

/** Reduce a ramp to just its named anchor steps (200/400/600/800). */
const toAnchors = (scale: HueScale): HueScale => ({
  name: scale.name,
  colors: scale.colors.filter((entry) => {
    const step = Number(entry.token.match(/-(\d+)$/)?.[1])
    return step in ANCHOR_NAME_SUFFIX
  }),
})

const reduceCategory = (category: Record<string, HueScale>): Record<string, HueScale> =>
  Object.fromEntries(Object.entries(category).map(([hue, scale]) => [hue, toAnchors(scale)]))

/** Four-anchor view of `colors`, used for swatches and picker labels. */
export const colorThemes: ColorPalette = {
  brand: reduceCategory(colors.brand),
  aboriginal: reduceCategory(colors.aboriginal),
}

/** Neutral fallback hex for swatch lookups that miss — the NSW black token. */
export const FALLBACK_SWATCH = jsonTokens.global.hex.black as string
