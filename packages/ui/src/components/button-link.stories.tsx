/**
 * ButtonLink — button-styled navigation.
 *
 * Lives under the Button family in the sidebar. These stories exist to
 * exercise the behaviour that is unique to the anchor rendering path —
 * disabled semantics (anchors have no `disabled` attribute), aria-busy
 * while loading, and LinkProvider integration — none of which the Button
 * stories can cover since the v2 Button/ButtonLink split.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'
import { expect, fn } from 'storybook/test'

import { IconArrowForward } from '../icons/index.js'
import { ButtonLink } from './button.js'
import { LinkProvider } from './link.js'

const variants = [
  'solid',
  'soft',
  'surface',
  'outline',
  'ghost',
  'link',
] as const

const meta = {
  title: 'Components/Button/ButtonLink',
  component: ButtonLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Button-styled anchor for navigation that should look like an action. Renders through `Link`, so a framework link injected via `LinkProvider` (e.g. next/link) applies. Disabled and loading states are conveyed with `aria-disabled` + a click guard, because anchors have no `disabled` attribute.',
      },
    },
  },
  args: {
    href: '#',
    children: 'View documentation',
  },
} satisfies Meta<typeof ButtonLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const anchor = canvasElement.querySelector('a')
    if (!anchor) throw new Error('ButtonLink did not render an <a> element.')
    await expect(anchor).toHaveAttribute('href', '#')
    // Focusable and exposed as a link, not a button.
    await expect(anchor).not.toHaveAttribute('role')
    await expect(anchor.tabIndex).toBe(0)
  },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((variant) => (
        <ButtonLink key={variant} {...args} variant={variant}>
          {variant}
        </ButtonLink>
      ))}
    </div>
  ),
}

export const WithTrailingIcon: Story = {
  args: {
    trailingVisual: IconArrowForward,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    onClick: fn(),
  },
  play: async ({ canvasElement }) => {
    const anchor = canvasElement.querySelector('a')
    if (!anchor) throw new Error('ButtonLink did not render an <a> element.')

    // Anchors can't be disabled natively — assert the full a11y contract.
    await expect(anchor).toHaveAttribute('aria-disabled', 'true')
    await expect(anchor).toHaveAttribute('data-disabled')
    // Removed from the tab order so keyboard users can't reach a dead link.
    await expect(anchor.tabIndex).toBe(-1)

    // Pointer interaction is blocked outright by `pointer-events: none` —
    // userEvent.click would (correctly) refuse, which is itself the
    // assertion for mouse users.
    await expect(getComputedStyle(anchor).pointerEvents).toBe('none')

    // Programmatic/AT-initiated activation still reaches the element, so the
    // click guard must swallow it: preventDefault stops navigation. (The
    // consumer's own onClick firing on aria-disabled elements matches native
    // anchor behaviour — the guard's job is the navigation.)
    const hashBefore = window.location.hash
    anchor.click()
    await expect(window.location.hash).toBe(hashBefore)
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const anchor = canvasElement.querySelector('a')
    if (!anchor) throw new Error('ButtonLink did not render an <a> element.')

    await expect(anchor).toHaveAttribute('aria-busy', 'true')
    // Loading implies the disabled contract too.
    await expect(anchor).toHaveAttribute('aria-disabled', 'true')

    // Spinner is decorative here: hidden from AT with no competing label.
    const spinner = anchor.querySelector('svg')
    if (!spinner)
      throw new Error('Loading ButtonLink did not render a spinner.')
    await expect(anchor.textContent).not.toContain('Loading')
  },
}

export const WithLinkProvider: Story = {
  render: (args) => (
    <LinkProvider
      component={(props: React.ComponentPropsWithoutRef<'a'>) => (
        <a data-framework-link="true" {...props} />
      )}
    >
      <ButtonLink {...args}>Provider-routed link</ButtonLink>
    </LinkProvider>
  ),
  play: async ({ canvasElement }) => {
    const anchor = canvasElement.querySelector('a')
    if (!anchor) throw new Error('ButtonLink did not render an <a> element.')
    // The injected framework component must be the rendered element.
    await expect(anchor).toHaveAttribute('data-framework-link', 'true')
    await expect(anchor).toHaveAttribute('href', '#')
  },
}
