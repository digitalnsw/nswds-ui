'use client'

import React from 'react'

import { IconDarkMode } from '../icons/dark-mode.js'
import { IconLightMode } from '../icons/light-mode.js'

import { Button, type ButtonProps } from '../components/button.js'

/** The two colour schemes the switcher toggles between. */
type ThemeSwitcherTheme = 'light' | 'dark'

type ThemeSwitcherProps = Omit<ButtonProps, 'children'> & {
  /**
   * Current theme (controlled). When set, the component never updates its own
   * state — wire `onThemeChange` back into whatever owns the theme (see the
   * next-themes snippet on the Storybook docs page). Pick one mode per
   * instance: don't switch between supplying and omitting `theme` across
   * renders.
   */
  theme?: ThemeSwitcherTheme
  /** Initial theme when uncontrolled. Defaults to `'light'`. */
  defaultTheme?: ThemeSwitcherTheme
  /**
   * Called with the NEXT theme (the one the user asked for) on every
   * activation, in both controlled and uncontrolled modes.
   */
  onThemeChange?: (theme: ThemeSwitcherTheme) => void
}

/**
 * Light/dark theme toggle button, ported from nswds-app's `ThemeSwitcher`
 * minus its `next-themes` dependency — a design system cannot depend on a
 * theming framework, so this is a plain controlled/uncontrolled input
 * (`theme` / `defaultTheme` / `onThemeChange`) and the app owns the plumbing.
 * All other props pass through to `Button` (defaults: `variant='surface'`,
 * `color='grey'`, `size='icon'` — the source's `color='light'` does not exist
 * on this Button; `grey` is its nearest ink).
 *
 * The icon depicts the DESTINATION: a moon (`IconDarkMode`) while the theme is
 * light, a sun (`IconLightMode`) while it is dark — matching the source and
 * the action-phrased label below.
 *
 * Accessibility contract:
 * - The `aria-label` announces the ACTION ("Switch to dark theme"), not the
 *   state, and flips after each activation so the control always names what
 *   pressing it will do (WCAG 2.2, 4.1.2 Name, Role, Value). The source
 *   duplicated the same words in an `sr-only` span AND the `aria-label`; the
 *   span is dropped here because a control with both gets its name announced
 *   twice by common screen readers (label, then descendant text).
 * - No `aria-pressed`. This is a mode switch between two peer states, each
 *   with its own action label — not a pressed/unpressed toggle of a single
 *   action. Combining `aria-pressed` with a flipping label is actively
 *   confusing ("Switch to dark theme, pressed" — pressed relative to what?);
 *   the flipping label alone is the established pattern for theme switchers.
 * - The icon is decorative (`aria-hidden`) and painted with `fill-current` so
 *   it follows the Button ink in every variant/colour and in dark mode — the
 *   source hardcoded `fill-grey-600 dark:fill-grey-100`, which broke on any
 *   non-grey button surface.
 *
 * Departures from the nswds-app source, beyond those above:
 * - No mounted-gate/hydration dance. The source rendered a disabled
 *   placeholder until after mount because next-themes' `resolvedTheme` is
 *   undefined during SSR. That is the theme framework's concern, not this
 *   component's: an SSR app passes `theme={resolvedTheme}` and gates its own
 *   render (or accepts the swap) itself. Wiring snippet on the docs page.
 * - The app's `ThemeProvider` (a next-themes re-export) intentionally has no
 *   design-system equivalent: theme plumbing is an app concern. Storybook
 *   toggles the `.dark` class via addon-themes, so clicking this component in
 *   a story does not restyle the canvas.
 */
function ThemeSwitcher({
  theme: themeProp,
  defaultTheme = 'light',
  onThemeChange,
  variant = 'surface',
  color = 'grey',
  size = 'icon',
  onClick,
  'aria-label': ariaLabel,
  ...props
}: ThemeSwitcherProps) {
  const [uncontrolledTheme, setUncontrolledTheme] = React.useState<ThemeSwitcherTheme>(defaultTheme)
  const isControlled = themeProp !== undefined
  const theme = isControlled ? themeProp : uncontrolledTheme
  const nextTheme: ThemeSwitcherTheme = theme === 'dark' ? 'light' : 'dark'
  // While light, show the moon (the action is "go dark"), and vice versa.
  const Icon = theme === 'dark' ? IconLightMode : IconDarkMode

  // Typed from the prop: Base UI augments the native event with its
  // BaseUIEvent extras, so a hand-written React.MouseEvent would not assign.
  const handleClick: ButtonProps['onClick'] = (event) => {
    onClick?.(event)
    // A consumer handler that prevented default has vetoed the switch —
    // same chaining contract as ExpandableSearch's onSubmit.
    if (event.defaultPrevented) {
      return
    }
    if (!isControlled) {
      setUncontrolledTheme(nextTheme)
    }
    onThemeChange?.(nextTheme)
  }

  return (
    <Button
      data-slot='theme-switcher'
      // Value-carrying, like Header's data-color: styling/tests can key off
      // the CURRENT theme without parsing the action-phrased label. NOT named
      // data-theme — @nswds/tokens scopes its dark role tokens to the
      // unqualified selector [data-theme='dark'], so that attribute on the
      // button would flip semantic tokens for its own subtree.
      data-mode={theme}
      variant={variant}
      color={color}
      size={size}
      aria-label={ariaLabel ?? `Switch to ${nextTheme} theme`}
      {...props}
      onClick={handleClick}
    >
      {/* Generated icons bake in data-slot='icon', which Button's icon sizing
          selector keys off; fill-current keeps the glyph on the Button ink. */}
      <Icon aria-hidden='true' className='fill-current' />
    </Button>
  )
}

export { ThemeSwitcher }
export type { ThemeSwitcherProps, ThemeSwitcherTheme }
