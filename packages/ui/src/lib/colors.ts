import * as culori from 'culori'
import { camelCase, kebabCase } from '../lib/utils.js'
import {
  ColorData,
  // DesignTokensTheme,
  ColorProperty,
  ColorThemes,
  DesignTokensShades,
  Format,
  Output,
  Variant,
} from '../types/types.js'

export const shades = [
  'lightest',
  'lighter',
  'light',
  'DEFAULT',
  'dark',
  'darker',
  'darkest',
]

export const darkenColor = (color: string, factor = 0.3) => {
  const parsed = culori.parse(color) // Parse input color
  if (!parsed || parsed.mode !== 'oklch') return color // Ensure it's OKLCH

  // Reduce lightness
  parsed.l = Math.max(0, parsed.l * factor)

  // Reduce chroma slightly
  parsed.c = Math.max(0, parsed.c * 0.4)

  return culori.formatCss(parsed)
}

export const lightenColor = (color: string, factor = 2) => {
  const parsed = culori.parse(color) // Parse input color
  if (!parsed || parsed.mode !== 'oklch') return color // Ensure it's OKLCH

  // Increase lightness, but ensure it doesn't exceed 1
  parsed.l = Math.min(1, parsed.l * factor)

  // Reduce chroma slightly to avoid color distortion
  parsed.c = parsed.c * 0.1

  return culori.formatCss(parsed)
}

export const addStartStopToColorArray = (colorArray: string[]): string[] => {
  const darkColor = (color: string) => darkenColor(color, 0.3)
  const lightColor = (color: string) => lightenColor(color, 2)

  const colors = [...colorArray]
  colors.unshift(darkColor(colorArray[0]!))
  colors.push(lightColor(colorArray[colorArray.length - 1]!))
  return colors
}

export const interpolateColors = (
  color1: string,
  color2: string,
  steps: number
): ColorData[] => {
  const results: ColorData[] = []

  const interpolator = culori.interpolate([color1, color2], 'oklch')

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)
    const color = interpolator(t)
    results.push({
      oklch: culori.formatCss(color),
      hex: culori.formatHex(color),
      rgb: culori.formatRgb(color),
      hsl: culori.formatHsl(color),
    })
  }

  return results
}

export const generateInterpolatedColors = (
  colorArray: string[]
): ColorData[] => {
  const newColorArray = addStartStopToColorArray(colorArray)

  let fullPalette: ColorData[] = []

  // Interpolate between pairs of colors
  for (let i = 0; i < newColorArray.length - 1; i++) {
    const color1 = newColorArray[i]!
    const color2 = newColorArray[i + 1]!
    const steps = 5

    const interpolated = interpolateColors(color1, color2, steps)
    // Remove the last color to avoid duplication, except for the last set
    if (i < newColorArray.length - 2) {
      fullPalette = [...fullPalette, ...interpolated.slice(0, -1)]
    } else {
      fullPalette = [...fullPalette, ...interpolated]
    }
  }

  const finalPaletteColours = fullPalette.slice(1, -1).reverse()

  return finalPaletteColours
}

export const generateDataVisColors = (
  colorArray: string[],
  steps = 6
): ColorData[] => {
  const fullPalette: ColorData[] = []

  for (let i = 0; i < colorArray.length - 1; i++) {
    const segment = interpolateColors(colorArray[i]!, colorArray[i + 1]!, steps)
    // For segments after the first, drop the first color to avoid duplicates at the join
    fullPalette.push(...(i === 0 ? segment : segment.slice(1)))
  }

  return fullPalette
}

export const getSurroundingColors = (
  colors: ColorData[],
  themeColor: string
) => {
  const index = colors.findIndex((color) => color.oklch === themeColor)

  if (index === -1) return []

  const start = Math.max(0, index - 3)
  const end = Math.min(colors.length, index + 4)

  const surroundingColors = colors.slice(start, end)

  return surroundingColors
}

export const colorDataArray = (
  colorsToUse: ColorData[],
  paletteName: string,
  format: Format,
  output: Output,
  variant: Variant
) => {
  return colorsToUse.map((color, index) => {
    const shade = (index + 1) * 50
    const value = color[format]
    const key = variant === 'shades' ? shade : shades[index]

    const fullKey =
      variant === 'shades'
        ? `${paletteName}-${shade}`
        : shades[index]!.includes('DEFAULT')
          ? `${paletteName}`
          : `${paletteName}-${shades[index]!}`

    switch (output) {
      case 'js':
      case 'ts':
        return `'${key}': '${value}'`

      case 'css':
        return `--${fullKey}: ${value};`

      case 'scss':
        return `$${fullKey}: ${value};`

      case 'less':
        return `@${fullKey}: ${value};`

      case 'tailwind':
        return `--color-${fullKey}: ${value};`

      case 'json':
        return `"${fullKey}": "${value}"`

      default:
        return ''
    }
  })
}

export function createColorArray(
  colorArray: ColorData[],
  name: string,
  type: string
) {
  const colorCategories = []
  const kebab = kebabCase(name)

  colorCategories.push({
    name: name,
    colors: colorArray.map((color, index) => {
      const value = 50 + index * 50
      const colorName =
        type === 'shades'
          ? `${kebab}-${value}`
          : shades[index]!.includes('DEFAULT')
            ? `${kebab}`
            : `${kebab}-${shades[index]!}`

      return {
        token: colorName,
        ...color,
        ...(value === 200 ? { name: `${name} 04` } : {}),
        ...(value === 400 ? { name: `${name} 03` } : {}),
        ...(value === 600 ? { name: `${name} 02` } : {}),
        ...(value === 800 ? { name: `${name} 01` } : {}),
      }
    }),
  })

  return colorCategories
}

export const isLightColor = (hexColor: string) => {
  const hex = hexColor.replace('#', '')
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128
}

export const renderColorOutput = (
  colorsToUse: ColorData[],
  paletteName: string,
  format: Format,
  output: Output,
  variant: Variant
) => {
  const lines = colorDataArray(
    colorsToUse,
    paletteName,
    format,
    output,
    variant
  )

  const indent = (str: string, level = 1) => '  '.repeat(level) + str

  switch (output) {
    case 'js':
    case 'ts':
      return `export const ${camelCase(paletteName)} = {\n${lines
        .map((line) => indent(line + ','))
        .join('\n')}\n}`

    case 'json':
      return `{\n  "${paletteName}": {\n${lines
        .map((line) => indent(line + ',', 2))
        .join('\n')}\n  }\n}`

    case 'scss':
    case 'less':
    case 'css':
    case 'tailwind':
      return lines.join('\n')

    default:
      return lines.join('\n')
  }
}

export const renderColorOutputToDTFM = (
  colorsToUse: ColorData[],
  paletteName: string,
  format: Format,
  variant: Variant
): string => {
  const isStructured = format !== 'hex'

  const parseToStructuredColor = (str: string) => {
    const regex = /([a-z]+)\(([^)]+)\)/i
    const match = str.match(regex)
    if (!match) return str

    const colorSpace = match[1]!
    const channelValues = match[2]!
      .split(/[\s,]+/)
      .map((val) => parseFloat(val))

    return {
      colorSpace,
      channels: channelValues,
      alpha: 1,
    }
  }

  if (variant === 'shades') {
    const tokens: DesignTokensShades = {
      [paletteName]: {},
    }

    colorsToUse.forEach((color, index) => {
      const shade = `${(index + 1) * 50}`
      const raw = color[format]
      const value = {
        $type: 'color' as const,
        $value: isStructured ? parseToStructuredColor(raw) : raw,
      }

      tokens[paletteName]![shade] = value
    })

    return JSON.stringify(tokens, null, 2)
  } else {
    const tokens: Record<string, ColorProperty> = {}

    colorsToUse.forEach((color, index) => {
      const shade =
        shades[index] === 'DEFAULT'
          ? `${paletteName}`
          : `${paletteName}-${shades[index]}`
      const raw = color[format]
      const value = isStructured ? parseToStructuredColor(raw) : raw

      tokens[shade] = {
        value,
        type: 'color',
      }
    })

    return JSON.stringify(tokens, null, 2)
  }

  /* if (variant === 'shades') {
    const tokens: DesignTokensShades = {
      [paletteName]: {},
    }

    colorsToUse.forEach((color, index) => {
      const shade = `${(index + 1) * 50}`
      const raw = color[format]
      const value = {
        $type: 'color' as const,
        $value: isStructured ? parseToStructuredColor(raw) : raw,
      }

      tokens[paletteName]![shade] = value
    })

    return JSON.stringify(tokens, null, 2)
  } else {
    const tokens: DesignTokensTheme = {
      [paletteName]: {
        value: '',
        type: 'color' as const,
        variants: {},
      },
    }

    colorsToUse.forEach((color, index) => {
      const shade = shades[index]
      const raw = color[format]
      const value = isStructured ? parseToStructuredColor(raw) : raw

      if (shade === 'DEFAULT') {
        tokens[paletteName].value = value
      } else {
        tokens[paletteName].variants[shade] = {
          value,
          type: 'color',
        }
      }
    })

    return JSON.stringify(tokens, null, 2)
  } */
}

export const themeIndices = [3, 7, 11, 15]
export const themeTokens = [200, 400, 600, 800]

export const generateColorThemes = (colors: ColorThemes) => {
  const colorThemes: ColorThemes = {}

  for (const category in colors) {
    colorThemes[category] = {}

    for (const shade in colors[category]) {
      const base = colors[category]![shade]!
      colorThemes[category][shade] = {
        name: base.name,
        colors: themeIndices.map((idx) => {
          const c = base.colors[idx]!
          return {
            token: c.token,
            oklch: c.oklch,
            hex: c.hex,
            rgb: c.rgb,
            hsl: c.hsl,
            name: c.name,
          }
        }),
      }
    }
  }

  return colorThemes
}

export function oklchConverter(hex: string): string {
  const converted = culori.oklch(hex)
  if (!converted) {
    throw new Error(`Invalid hex color: ${hex}`)
  }
  return culori.formatCss(converted)
}

export const getColorValue = (
  color: { oklch: string; hex: string; rgb: string; hsl: string },
  colorFormat: 'oklch' | 'rgb' | 'hsl' | 'hex'
): string => {
  switch (colorFormat) {
    case 'oklch':
      return color.oklch
    case 'rgb':
      return color.rgb
    case 'hsl':
      return color.hsl
    case 'hex':
    default:
      return color.hex
  }
}

export const createColorData = (baseColors: string[], format: Format) => {
  return baseColors.map((color) => {
    if (!culori.parse(color)) {
      console.warn(`Invalid color: ${color}`)
      return null
    }

    const colorData = {
      oklch: culori.formatCss(color) || '',
      hex: culori.formatHex(color) || '',
      rgb: culori.formatRgb(color) || '',
      hsl: culori.formatHsl(color) || '',
    }

    return getColorValue(colorData, format)
  })
}
