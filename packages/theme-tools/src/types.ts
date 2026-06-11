// Types for colors and palettes
export type Format = 'hex' | 'oklch' | 'hsl' | 'rgb'
export type Variant = 'shades' | 'theme'
export type Output =
  | 'css'
  | 'ts'
  | 'scss'
  | 'less'
  | 'tailwind'
  | 'json'
  | 'json-DTFM'
  | 'js'
export type ViewMode = 'grid' | 'list'
export type DataType =
  | 'css'
  | 'scss'
  | 'less'
  | 'tailwind'
  | 'json'
  | 'json-DTFM'
  | 'js'
export type ThemeCategory = 'brand' | 'aboriginal'
export type ThemeOption = string

export type ColorProperty = {
  value: string | { colorSpace: string; channels: number[]; alpha: number }
  type: 'color'
}

export type Palette = {
  baseColors: string[]
  name: string
  themeColor?: string
  divergent?: boolean
}

export interface ColourScaleProps {
  colorsToUse: ColorData[]
}

export type ColorCategories = {
  name: string
  colors: {
    token: string
    oklch: string
    hex: string
    rgb: string
    hsl: string
    name?: string
  }[]
}

export type ColorThemes = {
  [key: string]: {
    [key: string]: ColorCategories
  }
}

export type ColorTheme = {
  [key: string]: {
    name: string
    colors: {
      token: string
      oklch: string
      hex: string
      rgb: string
      hsl: string
      name?: string
    }[]
  }
}

export interface ColorCardProps {
  name: string
  token: string
  hex: string
  rgb: string
  hsl: string
  oklch: string
  format: 'hex' | 'rgb' | 'hsl' | 'oklch'
  viewMode: 'grid' | 'list'
}

export interface ViewToggleProps {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

export interface Color {
  token: string
  oklch: string
  hex: string
  rgb: string
  hsl: string
  name?: string
}

export interface ColorData {
  oklch: string
  hex: string
  rgb: string
  hsl: string
  [key: string]: string
}

export interface ColorsDisplayProps {
  colorCategories?: ColorCategories[]
  baseColors?: string[]
  themeColor?: string | undefined
  colorsToUse: ColorData[]
  paletteName: string
  variant: Variant
  format: Format
  viewMode: ViewMode
}

export interface ColorSwatchesProps {
  theme: Color[]
  format: Format
  viewMode: ViewMode
}

export interface ColourOutputProps {
  colorCategories: ColorCategories[]
  colorsToUse: ColorData[]
  paletteName: string
  format: Format
  output: Output
  variant: Variant
}

export interface ThemeSelectorProps {
  themeCategory: ThemeCategory
  setThemeCategory: (category: ThemeCategory) => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
  accentColor: string
  setAccentColor: (color: string) => void
  greyColor: string
  setGreyColor: (color: string) => void
  availableAccentColors: string[]
  colorThemes: ColorThemes
}

export interface DesignTokensShades {
  [paletteName: string]: {
    [shade: string]: {
      $type: 'color'
      $value:
        | string
        | {
            colorSpace: string
            channels: number[]
            alpha: number
          }
    }
  }
}

export interface StructuredColor {
  colorSpace: string
  channels: number[]
  alpha: number
}

export interface DesignTokensTheme {
  [paletteName: string]: {
    value: string | StructuredColor
    type: 'color'
    variants: Record<string, { value: string | StructuredColor; type: 'color' }>
  }
}
