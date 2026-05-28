/**
 * Link — Features
 *
 * Built-in colour variants, prose composition, external-link helper,
 * polymorphic rendering, framework integration via LinkProvider, and
 * forced interaction states.
 *
 * Stories assume Link's built-in styling (underline, hover halo, focus
 * ring, variant text colour) is applied automatically by `linkVariants()`.
 * Most stories use the default `primary` variant; the Variants matrix
 * exercises all three (`primary`, `secondary`, `white`) on light and dark
 * surfaces. ExternalLink wraps Link with the standard NSW-external-link
 * recipe (target="_blank", rel, trailing icon, sr-only suffix). These
 * stories are intended for design QA and CSS refactor regression review.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { forwardRef, type ReactNode } from 'react'

import { ExternalLink, Link, LinkProvider, type LinkProps } from './link.js'
import { docsTemplate } from './story-helpers.js'

// ─── Constants ────────────────────────────────────────────────────────────────

type LinkVariant = NonNullable<LinkProps['variant']>

const linkVariantList = [
  'primary',
  'secondary',
  'white',
] as const satisfies ReadonlyArray<LinkVariant>

const lowContrastVariants = ['secondary', 'white'] as const
const lowContrastSet = new Set<LinkVariant>(lowContrastVariants)

function needsDarkSurface(variant: LinkVariant): boolean {
  return lowContrastSet.has(variant)
}

function surfaceClasses(variant: LinkVariant): string {
  return needsDarkSurface(variant)
    ? 'rounded-sm border border-grey-700 bg-grey-800 p-4'
    : 'rounded-sm border border-border bg-background p-4'
}

function titleClasses(variant: LinkVariant): string {
  return needsDarkSurface(variant) ? 'text-grey-50' : 'text-foreground'
}

function VariantSurface({
  variant,
  children,
}: {
  variant: LinkVariant
  children: ReactNode
}) {
  return <div className={surfaceClasses(variant)}>{children}</div>
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Link/Features',
  component: Link,
  parameters: {
    layout: 'padded',
  },
  args: {
    href: '/about',
    children: 'About NSW Government',
  },
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

// A stand-in for a framework Link (e.g. next/link). Forwards props through to
// a plain <a> and tags itself with data-framework-link so the WithProvider
// story can visually distinguish provider-routed links from the default <a>.
const MockNextLink = forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'>
>(function MockNextLink(props, ref) {
  return <a ref={ref} data-framework-link="" {...props} />
})

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Variants: Story = {
  name: 'Variants',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Matrix of the three built-in colour variants (`primary` default, `secondary`, `white`) against four interaction states (default, hover, focus, active). Each row is a variant; each column is a state forced at rest so the indicator can be reviewed without pointer events.',
          why: 'Matches the Button "By Variant" review flow and quickly reveals per-variant state drift across the brand palette in a single visual diff.',
          how: "Scan each row horizontally and confirm the variant's colour, underline, hover overlay, focus ring, and pressed state all read correctly. Toggle the dark-mode addon and repeat.",
          caveat:
            '`secondary` and `white` are intended for dark surfaces and are rendered on a `grey-800` panel here. Hover, focus, and active columns pre-apply the styling those pseudo-classes would produce — they are not real pointer/keyboard events.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-7xl space-y-3">
      <div className="grid grid-cols-[9rem_repeat(4,minmax(0,1fr))] items-center gap-2 px-3 text-xs font-semibold text-muted-foreground">
        <span>Variant</span>
        <span className="text-center">Default</span>
        <span className="text-center">Hover</span>
        <span className="text-center">Focus</span>
        <span className="text-center">Active</span>
      </div>

      {linkVariantList.map((variant) => (
        <VariantSurface key={`variant-row-${variant}`} variant={variant}>
          <div className="grid grid-cols-[9rem_repeat(4,minmax(0,1fr))] items-center gap-2">
            <span
              className={`text-sm font-semibold capitalize ${titleClasses(variant)}`}
            >
              {variant}
            </span>
            <div className="text-center">
              <Link href={`/${variant}/default`} variant={variant}>
                About NSW Government
              </Link>
            </div>
            <div className="text-center">
              <Link
                href={`/${variant}/hover`}
                variant={variant}
                className="bg-(--link-halo) decoration-2 shadow-[0_-2px_0_var(--link-halo),0_4px_0_var(--link-halo)]"
              >
                About NSW Government
              </Link>
            </div>
            <div className="text-center">
              <Link
                href={`/${variant}/focus`}
                variant={variant}
                className="outline outline-2 outline-offset-2 outline-(--link-color)"
              >
                About NSW Government
              </Link>
            </div>
            <div className="text-center">
              <Link
                href={`/${variant}/active`}
                variant={variant}
                className="bg-(--link-halo-active) decoration-2 shadow-[0_-2px_0_var(--link-halo-active),0_4px_0_var(--link-halo-active)]"
              >
                About NSW Government
              </Link>
            </div>
          </div>
        </VariantSurface>
      ))}
    </div>
  ),
}

export const InParagraph: Story = {
  name: 'In Paragraph',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Each variant rendered inline inside a paragraph of body copy, including a paragraph with two links, an external link, and the `white` variant on a dark surface.',
          why: 'Body copy is the most common place links appear. This story catches regressions in line-height, vertical alignment, and the box-shadow hover halo — the latter is rendered without padding (matching the GOV.UK Design System pattern) so inline links sit flush against surrounding text.',
          how: 'Read each paragraph at normal zoom, then hover each link. The halo should paint 2px above and 4px below the line box without shifting neighbouring words. Force a long-wrapping link to fold onto a second line and confirm each segment gets its own halo (`box-decoration-break: clone`).',
          caveat:
            'Because the halo extends 4px below the line box, tight line-heights (`leading-tight` and below) can cause the halo to touch the line above. Stick to `leading-normal` (1.5) or greater in body copy where the link variant is `comfortable`-density.',
        }),
      },
    },
  },
  render: () => (
    <div className="max-w-2xl space-y-4 text-base/7 text-foreground">
      <p>
        The{' '}
        <Link href="/about" variant="primary">
          About NSW Government
        </Link>{' '}
        page explains how the state government is structured, who the ministers
        are, and how to engage with each agency.
      </p>

      <p>
        Find your nearest <Link href="/services">service centre</Link> or browse
        the full <Link href="/a-z">A–Z of services</Link> — both pages are kept
        up to date by the relevant agency.
      </p>

      <p>
        For more information visit{' '}
        <ExternalLink href="https://www.nsw.gov.au">nsw.gov.au</ExternalLink> or
        contact Service NSW.
      </p>

      <p className="rounded-sm bg-primary-800 p-4 text-grey-50">
        Looking for the{' '}
        <Link href="/contact" variant="white">
          contact directory
        </Link>
        ? It lists phone, email, and postal details for every NSW Government
        agency.
      </p>
    </div>
  ),
}

export const External: Story = {
  name: 'External',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: '`<ExternalLink>` — a thin wrapper around `Link` that defaults `target="_blank"`, `rel="noopener noreferrer"`, renders a trailing open-in-new icon, and appends a visually-hidden "(opens in a new tab)" suffix for screen readers.',
          why: 'Encapsulates the standard NSW-external-link recipe in one component so consumers never compose `Link + Icon + sr-only` by hand (and never forget the `rel` attribute or the screen-reader suffix).',
          how: 'Click the link to confirm it opens in a new tab. Inspect the anchor: `target` should be `_blank`, `rel` should include `noopener noreferrer`. With a screen reader, confirm the announcement includes "opens in a new tab".',
          caveat:
            'Pass `icon={null}` to hide the trailing icon, or `icon={<MyIcon />}` to override it. Pass `newTabLabel=""` to suppress the screen-reader suffix (e.g. when the link text itself already says "opens in a new tab"). All `Link` props — `variant`, `as`, `className`, etc. — pass through.',
        }),
      },
    },
  },
  render: () => (
    <ExternalLink href="https://www.nsw.gov.au">nsw.gov.au</ExternalLink>
  ),
}

export const AsButton: Story = {
  name: 'As Button',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Link rendered as a `<button>` element via the polymorphic `as` prop. The underlying element changes but the styling pipeline is unchanged.',
          why: 'Some patterns (e.g. opening an in-page modal) read like a link visually but need button semantics. Polymorphism lets consumers swap the rendered element without forking the component.',
          how: 'Inspect the rendered element — it should be `<button>`, not `<a>`. Keyboard activation should fire Space and Enter (button semantics), not Enter-only (link semantics).',
          caveat:
            'When rendered as a button the `href` prop has no behaviour — consumers must attach an `onClick` handler to drive the action.',
        }),
      },
    },
  },
  render: () => (
    <Link as="button" href="/contact">
      Contact us
    </Link>
  ),
}

export const WithProvider: Story = {
  name: 'With LinkProvider',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Two Link instances rendered side by side: one inside a `LinkProvider` that injects a framework Link, and one outside that falls back to the default `<a>`.',
          why: 'Apps built on Next.js or React Router need client-side navigation. `LinkProvider` lets the framework integration happen at the app root without rewriting every Link call site.',
          how: 'Inspect the provider-wrapped link — it should carry `data-framework-link=""`. The unwrapped link should be a plain `<a>` with no such attribute.',
          caveat:
            'The provider only affects descendants. Passing `as` to a specific Link still overrides the provider for that one instance.',
        }),
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <LinkProvider component={MockNextLink}>
        <Link href="/services">Services (via LinkProvider)</Link>
      </LinkProvider>
      <Link href="/news">News (default &lt;a&gt;)</Link>
    </div>
  ),
}

export const States: Story = {
  name: 'States',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Default, hover, focus, and active rows for the default `primary` variant, each forced at rest. Uses the same `--link-halo` / `--link-color` driven classes as the real interaction states so the preview matches production.',
          why: 'State styling regressions are easy to miss when the `--link-color` token or the derived `--link-halo` values change. Showing every state at rest enables a single-pass visual diff that tracks the variant system rather than hardcoded palette values.',
          how: 'Compare each row visually. Hover row should show the box-shadow halo + thicker underline; focus row should show the `--link-color` outline ring; active row should show the deeper `--link-halo-active` halo.',
          caveat:
            'The `:visited` state cannot be reliably forced in stories — browsers restrict access for privacy reasons, so a visited row is intentionally omitted. Hover/focus/active rows pre-apply the same variable-based classes those pseudo-classes produce, rather than triggering real pointer events; they therefore track non-primary variants and dark mode automatically.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <span className="w-24 text-xs font-semibold text-muted-foreground">
          Default
        </span>
        <Link href="/default-state">About NSW Government</Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="w-24 text-xs font-semibold text-muted-foreground">
          Hover
        </span>
        <Link
          href="/hover-state"
          className="bg-(--link-halo) decoration-2 shadow-[0_-2px_0_var(--link-halo),0_4px_0_var(--link-halo)]"
        >
          About NSW Government
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="w-24 text-xs font-semibold text-muted-foreground">
          Focus
        </span>
        <Link
          href="/focus-state"
          className="outline outline-2 outline-offset-2 outline-(--link-color)"
        >
          About NSW Government
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="w-24 text-xs font-semibold text-muted-foreground">
          Active
        </span>
        <Link
          href="/active-state"
          className="bg-(--link-halo-active) decoration-2 shadow-[0_-2px_0_var(--link-halo-active),0_4px_0_var(--link-halo-active)]"
        >
          About NSW Government
        </Link>
      </div>
    </div>
  ),
}
