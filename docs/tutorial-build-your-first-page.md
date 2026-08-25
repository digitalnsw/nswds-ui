# Build your first NSW page

You'll build a working NSW Government page — masthead, header, skip links, a content section
with a callout, and a footer — from an empty directory, in about ten minutes. By the end you'll
have a real page in your browser and you'll know how the pieces fit together.

You don't need to know Tailwind, and you don't need to configure design tokens. The package
ships a precompiled stylesheet with everything already wired.

## What you'll need

- **Node 22.14+ or 24.10+** (`node --version`)
- **React 19** — the package requires it, and the app you scaffold below uses it
- A terminal and a browser

No NSW-specific accounts or tooling. The package is public on npm.

---

## Step 1: Create an app

```bash
npm create vite@latest my-nsw-app -- --template react-ts
cd my-nsw-app
npm install
```

Vite's React + TypeScript template. Any React 19 setup works — Next.js, Remix, your own — but
Vite gets us to a running page fastest.

## Step 2: Install the design system

```bash
npm install @nswds/ui
npm install -D tailwindcss @tailwindcss/vite
```

`@nswds/ui` brings the components, the types, and the compiled stylesheet. You do **not** need to
install `@nswds/tokens` — its values are already baked into that stylesheet.

Tailwind is optional in principle, but you'll want it the moment you write your own layout, and
adding it now means step 3 shows you the correct import order.

Wire the Tailwind plugin into `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## Step 3: Import the stylesheet and render a button

Replace `src/index.css` entirely:

```css
@import '@nswds/ui/styles.css';
@import 'tailwindcss';
```

**That order is load-bearing.** Ours first, yours second. Both emit utilities into the same
cascade layer, and a media query carries no extra specificity — so whichever comes last wins any
tie. Yours going last means a class _you_ wrote beats one you didn't, which is what you want.
[The token reference](reference-tokens.md#the-import-order-trap) explains what breaks if you flip it.

Now replace `src/App.tsx`:

```tsx
import { Button } from '@nswds/ui'

export default function App() {
  return <Button>NSW button</Button>
}
```

Run it:

```bash
npm run dev
```

Open the URL Vite prints. **You should see a solid NSW-blue button.** If it's there, your tokens
are wired and everything else in this tutorial is composition.

If the button renders but is unstyled or transparent, the stylesheet import didn't land — check
that `src/index.css` is the file your app actually imports (Vite's template imports it from
`src/main.tsx`).

## Step 4: Add the page chrome

Every NSW Government site opens with the same three bands: the masthead strip, the header, and
skip links ahead of both for keyboard users.

Replace `src/App.tsx`:

```tsx
import {
  Header,
  HeaderActions,
  HeaderBrand,
  Masthead,
  SkipLink,
  SkipLinks,
  ThemeSwitcher,
} from '@nswds/ui'

export default function App() {
  return (
    <>
      <SkipLinks>
        <SkipLink href='#main-content'>Skip to main content</SkipLink>
      </SkipLinks>

      <Masthead />

      <Header>
        <HeaderBrand sitename='Waste Levy Portal' />
        <HeaderActions>
          <ThemeSwitcher />
        </HeaderActions>
      </Header>

      <main id='main-content'>
        <p>Content goes here.</p>
      </main>
    </>
  )
}
```

Three things just happened that you didn't have to ask for:

- `Masthead` renders the "A NSW Government website" strip.
- `Header` is a real `banner` landmark, sticky by default, with the NSW waratah and your service
  name linked to `/`.
- `SkipLinks` are invisible until focused. **Press Tab.** The skip link appears — that's the
  bypass mechanism WCAG 2.4.1 requires, and you got it by rendering one component.

`ThemeSwitcher` renders but doesn't do anything yet; it holds no theme itself. Step 6 wires it.

## Step 5: Add content and a footer

Now the page body. Add these imports and replace `<main>`:

```tsx
import { Button, Callout, Container, Footer, Section } from '@nswds/ui'
import { IconDownload } from '@nswds/ui/icons'
```

```tsx
<main id='main-content'>
  <Container>
    <Section labelledBy='report-heading'>
      <h1 id='report-heading'>Report your waste levy</h1>
      <p>Submit your quarterly return before 30 September.</p>

      <Callout status='info' title='Before you start'>
        You will need your licence number and this quarter's tonnage records.
      </Callout>

      <Button leadingVisual={IconDownload}>Download the return form</Button>
    </Section>
  </Container>
</main>

<Footer
  department='Department of Climate Change, Energy, the Environment and Water'
  legalLinks={[
    { name: 'Privacy', href: '/privacy' },
    { name: 'Accessibility', href: '/accessibility' },
  ]}
/>
```

Worth noticing:

- `Container` applies the same lateral rhythm the masthead, header and footer already use, so your
  content lines up with the chrome instead of drifting.
- `labelledBy` on `Section` points at the heading's `id`. That turns the section into a **named
  `region` landmark** — a screen-reader user can jump straight to "Report your waste levy". Leave
  it off and you get a plain `<section>`.
- `Callout` takes `status='info' | 'success' | 'warning' | 'danger'` and is built from the NSW role
  tokens, so it re-brands and dark-mode-flips with no extra work.
- `Footer` renders acknowledgement of Country by default. That's deliberate: it's the NSW default,
  and turning it off should be a decision you make, not one you forget.
- `IconDownload` is one of 3,921 icon modules. Only the ones you import reach your bundle.

## Step 6: Turn on dark mode

`ThemeSwitcher` is deliberately framework-free — it reports a change and lets you decide what to
do with it. The smallest thing that works is putting the marker on the document element:

```tsx
import { useEffect, useState } from 'react'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <>
      {/* ...everything from steps 4 and 5, with: */}
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
    </>
  )
}
```

Click it. The page background, body text, callout and chrome all move to their dark values.

**The marker has to go on the root element — `<html>` — not a wrapper `<div>`.** This is the one
place the token architecture leaks, and it is worth understanding rather than memorising.

The shadcn tokens are declared on `:root`, in terms of NSW role tokens:

```css
:root {
  --primary: var(--action-default);
}
```

That `var()` is substituted **where it is declared**, so by the time `--primary` inherits down the
tree it is already a fixed colour. The dark values are scoped `[data-theme='dark'], .dark`. Put
that class on `<html>` and it lands on the _same element_ where `--primary` is declared, so the
dark value wins and everything downstream follows. Put it on a wrapper `<div>` and you change
`--action-default` for the subtree — too late, `--primary` resolved higher up.

The visible symptom of getting it wrong is a **partial** dark mode: `dark:` utilities flip (they
are compiled classes, not tokens) while the semantic colours stay light. Nothing errors.

In a real app use [`next-themes`](https://github.com/pacocoursey/next-themes) or your own store
rather than a `useEffect` — they handle the pre-hydration flash. `class="dark"` and
`data-theme="dark"` both work.

There is no dark colour block for you to write. Every token maps to a mode-aware NSW role token
that flips one layer down — see [the token reference](reference-tokens.md#the-four-layers).

> Not everything changes, by design. A solid primary `Button` keeps its NSW-blue fill in both
> modes; it is the brand action colour, and it already clears contrast on a dark surface.

## Step 7: Check it builds

```bash
npm run build
```

If `tsc` and `vite build` both pass, what you have is shippable.

---

## What you built

A NSW Government page with the correct masthead, a `banner` landmark, working skip links, a named
content region, an accessible callout, acknowledgement of Country, and dark mode — using nine
components and no custom CSS.

More usefully, you now know the three things that trip people up:

1. **Import order** — `@nswds/ui/styles.css` before `tailwindcss`.
2. **Landmarks are opt-in where they should be** — `labelledBy` makes a section a region;
   `HeaderActions` is deliberately not a `nav`.
3. **Dark mode lives in the tokens**, not in a stylesheet you maintain.

### Where to go next

- **Client-side routing** — wrap your app in `LinkProvider` once and every link in every component
  routes through your framework. See [Links and routing](reference-components.md#links-and-routing).
- **Navigation** — `MainNav` for a mega-menu bar, `SideNav` for section nav, `PushMenu` inside a
  `Sheet` for mobile. Start from the `mobile-nav` block.
- **Forms** — `Field` and its slots handle label, description and error wiring; `login-form` and
  `sign-up-form` are worked examples.
- **[Component reference](reference-components.md)** — all 62 components and 12 blocks.
- **[Theme and re-brand](howto-theme-and-rebrand.md)** — making it your agency's colours.
- **Storybook** — every component with live controls and interaction tests.

Prefer to own the source rather than import a package? The same components install as editable
files — see [installing from the registry](installing-from-the-registry.md).
