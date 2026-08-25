# How to theme and re-brand

This guide covers changing what the components look like: switching a component's built-in colour
variant, re-branding the whole system to an agency palette, re-branding one subtree, and
overriding a single component at the call site.

## Prerequisites

- A working install — see [the tutorial](tutorial-build-your-first-page.md) or the
  [registry guide](installing-from-the-registry.md)
- Somewhere to put CSS that loads **after** `@nswds/ui/styles.css`
- A skim of [the token reference](reference-tokens.md#the-four-layers) — the four layers matter here

---

## The rule that governs all of this

Read this before anything else, because it explains why the obvious approach sometimes silently
does nothing.

**A `var()` resolves where the property is _declared_, not where it is _used_.**

The system declares each token layer on `:root`:

```css
:root {
  --primary: var(--action-default); /* layer 3 reads layer 2, AT :root */
}
```

By the time `--primary` inherits down to your component, it is already a concrete colour. So
overriding `--action-default` on a _descendant_ changes nothing — the substitution already
happened, higher up.

Two consequences, both verified against a built consumer app:

- **Re-branding globally**: override at `:root`, at whichever layer you like. It works.
- **Re-branding a subtree**: override the _exact_ variable the component reads. Going one layer
  deeper is a no-op.

And which variable a component reads varies by component:

| Component reads                          | Example                                               | Scoped override target |
| ---------------------------------------- | ----------------------------------------------------- | ---------------------- |
| The Tailwind `@theme` bridge             | `Button color='primary'` → `var(--color-primary-800)` | `--color-primary-800`  |
| A layer-2 role token, on its own element | `Callout status='info'` → `var(--info-surface)`       | `--info-surface`       |
| A layer-3 shadcn token                   | anything using `bg-primary`                           | `--primary`            |

> **`Button` is the trap.** Its `primary` colour resolves to `var(--color-primary-800)` — the
> masterbrand _ramp_ — not the `--primary` shadcn token. Overriding `--primary` in a scoped
> selector re-brands most of the system and leaves every primary Button untouched.

---

## Use a component's built-in colour first

Before overriding anything, check whether the component already offers the colour. The page chrome
is extensively themeable out of the box, and every pair is contrast-checked.

```tsx
<Masthead color='dark' />
<Header color='grey' />
<MainNav color='primary-800' />
<Footer color='accent-800' />
```

- `Masthead`, `Header`, `SkipLink` share a four-name vocabulary: `dark`, `light`, `white`, `grey`.
  All are WCAG 2.2 AAA (7:1).
- `Footer`, `MainNav`, `ExpandableSearch` share a 13-colour vocabulary: `primary-800|600|400|200`,
  `grey-*`, `accent-*`, and `white`.

Pick one word for the whole chrome — the three top-of-page components are designed to stack.

---

## Re-brand the whole system

Override the masterbrand ramps at `:root`, after the stylesheet. Everything follows: buttons,
links, focus rings, charts, the lot.

```css
@import '@nswds/ui/styles.css';
@import 'tailwindcss';

:root {
  /* Agency brand green replaces NSW blue across all 19 steps. */
  --primary-50: oklch(0.98 0.02 150);
  --primary-400: oklch(0.86 0.09 150);
  --primary-500: oklch(0.72 0.16 150);
  --primary-600: oklch(0.58 0.23 150);
  --primary-800: oklch(0.29 0.12 150);
  /* …and the remaining steps */
}
```

Supply the whole ramp, not one step. Components draw on different steps for fills, borders, hover
states and charts, so a partial override leaves you with a green button and blue focus ring.

Each step has an intended job: **50–250** subtle backgrounds, **300–450** interactive components,
**500** base, **550–700** borders and icons, **750–950** text and high emphasis. Keep the lightness
progression monotonic or contrast pairings break.

To re-tone _semantics_ rather than brand — a softer danger red, a different link ink — override the
role tokens instead, and do it for both modes:

```css
:root {
  --danger-solid: oklch(0.55 0.2 25);
}
[data-theme='dark'],
.dark {
  --danger-solid: oklch(0.7 0.16 25);
}
```

Match that `[data-theme='dark'], .dark` selector exactly. Use only `.dark` and you break anyone
toggling the attribute form.

### Verify it took

```bash
npm run build
```

Then, in the browser console:

```js
getComputedStyle(document.querySelector('[data-slot=button]')).backgroundColor
```

If it still reports NSW blue, your CSS is loading before `@nswds/ui/styles.css`, or you overrode a
layer that had already resolved.

---

## Re-brand one subtree

For a sub-brand on part of a page, override the variable the component actually reads — see the
table above — in a scoped class:

```css
.agency-health {
  /* Button and anything else on the masterbrand ramp */
  --color-primary-800: oklch(0.45 0.15 150);
  --color-primary-600: oklch(0.58 0.2 150);
  /* Components reading role tokens directly */
  --action-default: oklch(0.45 0.15 150);
  --info-surface: oklch(0.85 0.12 120);
  /* Components reading shadcn tokens */
  --primary: oklch(0.45 0.15 150);
}
```

```tsx
<div className='agency-health'>
  <Button>Health green</Button>
</div>
```

It is more verbose than the global route, and deliberately so — you are working against the grain
of a system that resolves its tokens at the root. **If you can re-brand at `:root`, do that
instead.**

---

## Override a single component

For one-off adjustments, skip tokens and use `className`. Your utilities are emitted after ours,
so they win.

```tsx
<Button className='rounded-none'>Square</Button>
```

To reach inside a composite component, target its `data-slot`:

```tsx
<Footer className='[&_[data-slot=footer-legal-links]]:lg:justify-start' />
```

Every component exposes a `data-slot`, and a call-site override outranks both stylesheets.

To restyle a component wholesale while keeping its behaviour, compose from its exported `cva`
function rather than fighting the class string:

```tsx
import { buttonVariants, cn } from '@nswds/ui'

;<a className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full')} href='/apply'>
  Apply
</a>
```

Every component exports one: `buttonVariants`, `calloutVariants`, `footerVariants`,
`headerVariants`, `linkVariants`, and so on — the full list is in the
[component reference](reference-components.md).

---

## Add a named theme

To ship several brands and switch between them, define each as a class that overrides the ramp,
then toggle it on the root element. The same subtree caveat applies, so put the class on `<html>`:

```css
.theme-health {
  --primary-800: oklch(0.29 0.12 150); /* …full ramp… */
}
.theme-education {
  --primary-800: oklch(0.3 0.14 300); /* …full ramp… */
}
```

```tsx
<html className='theme-health dark'>
```

Theme and dark mode are independent — the theme class sets the brand, `.dark` flips the mode, and
they compose.

`@nswds/tokens` also ships additional brand themes under `dist/css/colors/themes/`; importing one
of those replaces the masterbrand mapping wholesale, which is cleaner than hand-writing a ramp.

---

## Troubleshooting

**Nothing changed.** You overrode a layer that had already resolved. Re-read
[the rule](#the-rule-that-governs-all-of-this) and override the variable the component actually
reads, or move the override to `:root`.

**Buttons stayed NSW blue while everything else re-branded.** You overrode `--primary`.
`Button color='primary'` reads `--color-primary-800`.

**Backgrounds go dark but text stays dark.** A `@nswds/tokens` Tailwind bridge is imported _after_
`@nswds/ui/styles.css`. Ours must come last of the two — it is the only one carrying dark values.
See [the import-order trap](reference-tokens.md#the-import-order-trap).

**Dark mode broke after adding a cascade layer.** Remove `layer(...)` from the
`@nswds/ui/styles.css` import. Layering it also layers its token blocks, and layered custom
properties lose to any unlayered `:root`. No import order recovers this.

**Colours look right in light mode, wrong in dark.** You overrode a `:root` value without a
`[data-theme='dark'], .dark` counterpart.

**A responsive override of ours stopped working after your own Tailwind build.**
`@import 'tailwindcss'` must come last. See
[Using it with your own Tailwind build](https://github.com/digitalnsw/nswds-ui/blob/main/packages/ui/README.md#using-it-with-your-own-tailwind-build).

---

## Related

- [Design token reference](reference-tokens.md) — every token and what it resolves to
- [Component reference](reference-components.md) — built-in colour variants per component
- [Architecture](explanation-architecture.md) — why tokens are layered this way
