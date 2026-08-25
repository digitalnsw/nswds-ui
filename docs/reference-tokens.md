# Design token reference

Every visual property in the system traces back to a CSS custom property. This page lists the
tokens, what they resolve to, and which ones you are meant to touch.

If you consume the **npm package**, all of this is already inlined into `@nswds/ui/styles.css` —
you need nothing else. If you consume the **registry**, you import these layers yourself; see the
[registry installation guide](installing-from-the-registry.md).

The values live in [`@nswds/tokens`](https://www.npmjs.com/package/@nswds/tokens) (v5). The
mapping lives in `packages/ui/src/styles/theme.css`.

---

## The four layers

Tokens stack in four layers. Each one resolves into the one above it.

```
Layer 4  Tailwind bridges        bg-primary, text-foreground, rounded-lg, fill-nsw-blue-800
             ↑ @theme
Layer 3  Shadcn semantic         --primary, --background, --border, --ring, --radius
             ↑ var()
Layer 2  NSW role tokens         --action-default, --text-default, --surface-raised, --danger-solid
             ↑ var()
Layer 1  NSW primitive palette   --nsw-blue-800, --primary-800, --grey-100, --danger-600
```

Read it bottom-up: a raw NSW blue becomes "the default action colour", which becomes "the primary
token", which becomes the `bg-primary` class a component writes.

**Layer 2 is the one that makes dark mode work.** The role tokens are mode-aware: the light values
come from `semantic/oklch.css` on `:root`, the dark values from `semantic/oklch.dark.css` scoped
`[data-theme='dark'], .dark`. Because layer 3 is defined purely in terms of layer 2, there is **no
`.dark` override block anywhere in this design system** — the whole palette flips one layer down.
That is worth knowing before you go looking for a dark block to edit; there isn't one.

---

## Layer 1 — the NSW palette

Eleven colour families, each on a 19-step ramp (`50, 100, 150, … 900, 950`):

`nsw-blue` · `nsw-red` · `nsw-grey` · `nsw-green` · `nsw-teal` · `nsw-purple` · `nsw-orange`
· `nsw-yellow` · `nsw-brown` · `nsw-fuchsia` · `nsw-aboriginal`

Four status ramps on the same 19 steps: `--danger-*`, `--success-*`, `--warning-*`, `--info-*`.

The **masterbrand theme** aliases three families to role names on the same ramp:

| Theme ramp         | Resolves to    | Used for                            |
| ------------------ | -------------- | ----------------------------------- |
| `--primary-50…950` | `--nsw-blue-*` | Primary actions, links, key accents |
| `--accent-50…950`  | `--nsw-red-*`  | The waratah accent                  |
| `--grey-50…950`    | `--nsw-grey-*` | Neutrals                            |

Each step carries an intended job, which the token file documents inline: **50–250** subtle
backgrounds, **300–450** interactive components, **500** base colour, **550–700** borders and
icons, **750–950** text and high emphasis.

Utilities: `bg-primary-800`, `fill-nsw-blue-800`, `text-grey-600`, `border-accent-400`, and so on.

---

## Layer 2 — NSW role tokens

Mode-aware, brand-agnostic names. **These are the ones to override when re-branding** — change a
role and every component that uses it follows, in both light and dark.

### Surfaces and text

| Token                  | Role                                                                           |
| ---------------------- | ------------------------------------------------------------------------------ |
| `--surface-default`    | The page canvas (pure white in light mode)                                     |
| `--surface-raised`     | Cards, popovers, anything lifted off the canvas                                |
| `--surface-sunken`     | Wells, inset areas, secondary button fills                                     |
| `--background-default` | Off-white app background                                                       |
| `--background-subtle`  | Muted and accent fills                                                         |
| `--text-default`       | Body text                                                                      |
| `--text-muted`         | Secondary text — clears WCAG AA (≥4.5:1) in both modes                         |
| `--text-subtle`        | De-emphasised text. **Not for body copy**: 3.29:1 on white, below the AA floor |
| `--text-inverse`       | Text on a solid brand fill                                                     |
| `--text-link`          | Link ink                                                                       |

### Borders and actions

| Token                                                      | Role                     |
| ---------------------------------------------------------- | ------------------------ |
| `--border-subtle` / `--border-default` / `--border-strong` | Three border weights     |
| `--action-default` / `--action-hover` / `--action-subtle`  | Interactive brand colour |

### Status

Each of `danger`, `success`, `warning`, `info` has four roles:

| Token                | Role                       |
| -------------------- | -------------------------- |
| `--<status>-solid`   | Filled backgrounds, icons  |
| `--<status>-surface` | Tinted background          |
| `--<status>-border`  | Border                     |
| `--<status>-text`    | Text on the tinted surface |

`Callout` and `Field`'s invalid state are built entirely from these, which is why they re-brand
and dark-flip with no extra work.

---

## Layer 3 — shadcn semantic tokens

What components actually reference. Defined in `theme.css`, mapped onto layer 2.

| Token                                    | Maps to                                  | Notes                                                                                                                                  |
| ---------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `--background`                           | `--surface-default`                      | Deliberately **not** `--background-default`: component soft colours are tuned for a white canvas, and the off-white tips some below AA |
| `--foreground`                           | `--text-default`                         |                                                                                                                                        |
| `--card` / `--card-foreground`           | `--surface-raised` / `--text-default`    |                                                                                                                                        |
| `--popover` / `--popover-foreground`     | `--surface-raised` / `--text-default`    |                                                                                                                                        |
| `--primary`                              | `--action-default`                       |                                                                                                                                        |
| `--primary-foreground`                   | `--text-inverse`                         |                                                                                                                                        |
| `--secondary` / `--secondary-foreground` | `--surface-sunken` / `--text-default`    |                                                                                                                                        |
| `--muted` / `--muted-foreground`         | `--background-subtle` / `--text-muted`   |                                                                                                                                        |
| `--accent` / `--accent-foreground`       | `--background-subtle` / `--text-default` | Shadcn's "accent", not the NSW waratah accent                                                                                          |
| `--destructive`                          | `--danger-solid`                         |                                                                                                                                        |
| `--border` / `--input`                   | `--border-default`                       |                                                                                                                                        |
| `--ring`                                 | `--border-strong`                        | Focus ring                                                                                                                             |
| `--radius`                               | `--radius-md` (8px)                      |                                                                                                                                        |

### Form input tokens

`Input` references only these, which keeps its mode-awareness in one place:

`--input-border` · `--input-foreground` · `--input-placeholder` · `--input-surface` ·
`--input-surface-hover` · `--input-ring` · `--input-invalid-border` ·
`--input-invalid-surface-hover` · `--input-invalid-ring`

`--input-placeholder` is `--text-muted`, not `--text-subtle`, for the contrast reason above.

### Chart and sidebar tokens

`--chart-1…5` walk the primary ramp (`--primary-450` through `--primary-700`) and are
mode-agnostic. `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`,
`--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`,
`--sidebar-border`, `--sidebar-ring` mirror the main set.

---

## Non-colour scales

### Radius

| Token           | Value    | Utility                        |
| --------------- | -------- | ------------------------------ |
| `--radius-none` | `0px`    | `rounded-none`                 |
| `--radius-sm`   | `4px`    | `rounded-sm`                   |
| `--radius-md`   | `8px`    | `rounded-md` — also `--radius` |
| `--radius-lg`   | `16px`   | `rounded-lg`                   |
| `--radius-pill` | `9999px` | `rounded-pill`                 |

Enforced by `npm run check:radius -w @nswds/ui` in CI — components may not invent radii.

### Typography

Sizes `--font-size-12` through `--font-size-64` (12, 14, 16, 18, 20, 22, 24, 30, 36, 48, 56, 64).
Tailwind's `text-xs … text-3xl` are routed onto them, at identical values — the scale follows
`@nswds/tokens` rather than Tailwind's hardcoded defaults.

Weights: `light` · `regular` · `medium` · `semibold` · `bold` · `extrabold`.
Line heights: `none` · `tight` · `snug` · `base` · `relaxed` · `loose`.

### Motion

Durations `--duration-none | instant | fast | base | slow | slower`.
Easings `--easing-linear | standard | accelerate | decelerate`.
Composed `--transition-hover | enter | exit | overlay`.

Tailwind's default transition duration and timing function are routed through `--duration-fast`
and `--easing-standard`, so every `transition-*` utility follows the tokens — including their
`prefers-reduced-motion` collapse.

Two things that collapse cannot reach, so `theme.css` handles them with one unlayered rule:
keyframe animations (their duration is baked into `tw-animate-css`) and `duration-300`-style
utilities (they write `--tw-duration`). Under `prefers-reduced-motion: reduce`, animation and
transition durations are forced to `0.01ms !important` — not `0`, so `animationend` still fires
and Base UI's accordion and select state machines still settle.

### Spacing, shadow, z-index

Spacing `--spacing-0…16`. Shadows `--shadow-sm | md | lg | xl` plus
`--shadow-color-5 | 10 | 25`. Layering `--z-index-base | dropdown | sticky | overlay | modal |
popover | tooltip | toast`.

---

## Dark mode

Toggle **either** `class="dark"` or `data-theme="dark"` on a root element:

```tsx
<html lang='en' className='dark'>
```

Both markers work. The `dark:` variant is defined as:

```css
@custom-variant dark (&:is(.dark, .dark *, [data-theme='dark'], [data-theme='dark'] *));
```

Both halves of each pair are load-bearing. `.dark` matches the element **carrying** the class —
normally `<html>`, exactly where `next-themes` puts it — while `.dark *` matches its
**descendants**. Drop the first and `dark:` utilities on the root element silently do nothing;
drop the second and nothing inside it responds. The `[data-theme='dark']` pair does the same job
for the attribute form.

> **Scoped dark is partial.** A nested `.dark` flips `dark:` utilities, but `:root`-anchored token
> values do not re-resolve for a subtree. For a genuinely dark page, put the marker on the root.

### The import-order trap

`@nswds/ui/styles.css` must come **after** any `@nswds/tokens` Tailwind colour bridge:

```css
@import '@nswds/tokens/tailwind/colors/global/oklch.css';
@import '@nswds/tokens/tailwind/colors/semantic/oklch.css';
@import '@nswds/ui/styles.css'; /* after — it is the only one carrying dark */
@import 'tailwindcss'; /* your own build last */
```

Both emit an unlayered `:root` of light values; only ours also ships the
`[data-theme='dark'], .dark` block. `:root` and `.dark` have identical specificity `(0,1,0)`, so
whichever lands last wins. Import a bridge afterwards and its light values win: every `bg-*`
utility still flips (those are compiled classes) while the role tokens stay light — backgrounds go
dark, text stays dark on top of them. Nothing errors. It just looks broken.

> **Do not reach for `layer(nswds)` to pin the order.** Layering the import also layers the token
> blocks it carries, and layered custom properties lose to _any_ unlayered `:root` — the same
> failure, with no import order that recovers it.

---

## Related

- [Theme and re-brand](howto-theme-and-rebrand.md) — the task-oriented version of this page
- [Component reference](reference-components.md) — which components use which tokens
- [Architecture](explanation-architecture.md) — why the layering is built this way
- [Installing from the registry](installing-from-the-registry.md) — wiring these layers by hand
