# Add a component to the design system

You'll add a new component to NSWDS UI and get it through every CI gate. By the end you'll have a
component shipping on **both** distribution channels — the npm package and the shadcn registry —
with a story, tests, and green checks.

This is the contributor path. To _use_ the system, see
[Build your first NSW page](tutorial-build-your-first-page.md) instead.

We'll build `Notice` — a small dismissible banner. It's deliberately simple, so the interesting
part is the pipeline, not the component.

## What you'll need

- The repo cloned, on the Node version in `.nvmrc` (24.16.0) — `nvm use`
- `npm install` run at the root
- A branch. **Never commit to `main`.**

```bash
git checkout -b feat/notice-component
```

---

## Step 1: See the gates before you write anything

Run the drift check now, while the tree is clean:

```bash
npm run check:drift -w @nswds/ui
```

It passes. Remember it — you're about to break it deliberately, twice, and each failure teaches you
one half of the two-channel rule.

## Step 2: Create the component

```bash
touch packages/ui/src/components/notice.tsx
```

```tsx
'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils.js'
import { IconClose } from '../icons/close.js'

const noticeVariants = cva('flex items-start gap-3 rounded-md border p-4', {
  variants: {
    tone: {
      neutral: 'border-border bg-muted text-foreground',
      info: 'border-(--info-border) bg-(--info-surface) text-(--info-text)',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

type NoticeProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof noticeVariants> & {
    onDismiss?: () => void
    dismissLabel?: string
  }

function Notice({
  className,
  tone,
  onDismiss,
  dismissLabel = 'Dismiss',
  children,
  ...props
}: NoticeProps) {
  return (
    <div data-slot='notice' className={cn(noticeVariants({ tone, className }))} {...props}>
      <div className='flex-1'>{children}</div>
      {onDismiss ? (
        <button type='button' onClick={onDismiss} aria-label={dismissLabel} className='shrink-0'>
          <IconClose data-slot='icon' className='size-5' />
        </button>
      ) : null}
    </div>
  )
}

export { Notice, noticeVariants, type NoticeProps }
```

Four rules are already at work here, and each has a CI check behind it:

1. **Relative imports** (`../lib/utils.js`, `../icons/close.js`) — never `@/…`, never `@nswds/ui/…`.
   `apps/web` consumes our source via `transpilePackages`, and its own `@/*` alias would misresolve
   ours; `@nswds/ui/…` self-imports leak into registry JSON. ESLint enforces this.
2. **Per-icon import** — `../icons/close.js`, never the barrel. The barrel is ~3,900 modules the
   registry's icons item can never ship. (Stories may use `../icons/index.js` freely — they are
   never shipped in a registry item. The rule binds component source only.)
3. **Semantic tokens only** — `bg-muted`, `border-(--info-border)`. Never `bg-blue-600`, never
   `bg-[#0055a4]`.
4. **`cva` for variants, both exported** — consumers extend styling through `noticeVariants`.

> **Interactive components must wrap a Base UI primitive.** `Notice` gets away with a bare
> `<button>` because a click handler and an `aria-label` are the whole interaction. Anything with
> focus management, keyboard navigation or ARIA state — a dialog, a menu, a select — must use
> [Base UI](https://base-ui.com/). Never hand-roll those.

## Step 3: Watch the drift check fail

```bash
npm run check:drift -w @nswds/ui
```

It now fails: the file exists but is neither exported from the barrel nor registered. That is the
two-channel rule — a component that reaches only one channel is a bug.

Fix the first half. Add to `packages/ui/src/index.ts`, in alphabetical position:

```ts
export * from './components/notice.js'
```

You don't need to touch `tsup.config.ts` — it auto-discovers new files, so
`dist/components/notice.js` appears on the next build.

Re-run the check. Still failing, now on the registry half.

## Step 4: Register it

Add an entry to `packages/ui/registry.json`:

```json
{
  "name": "notice",
  "type": "registry:ui",
  "title": "Notice",
  "description": "A dismissible banner for transient page-level messages.",
  "dependencies": ["class-variance-authority", "clsx", "tailwind-merge"],
  "registryDependencies": ["icons"],
  "files": [
    {
      "path": "src/components/notice.tsx",
      "type": "registry:ui",
      "target": "components/notice.tsx"
    },
    { "path": "src/lib/utils.ts", "type": "registry:lib", "target": "lib/utils.ts" }
  ]
}
```

Two completeness rules, both enforced by `check:registry-resolves`:

- **List every npm dependency the component actually imports**, even one a sibling already
  installs. Relying on a sibling breaks silently the day that sibling drops it. (`Notice` uses no
  Base UI primitive, so `@base-ui/react` is correctly absent here.)
- **Everything the component imports must be delivered** by this item or its
  `registryDependencies`. `IconClose` is why `icons` is listed — and `close` must be in the icons
  item's own `files` list.

Now:

```bash
npm run check:drift -w @nswds/ui
```

Green. Both channels know about the component.

## Step 5: Build the registry output

```bash
npm run registry:build
```

This validates `registry.json`, runs `shadcn build`, rewrites aliases, and re-runs the resolution
check. It writes `apps/registry/public/r/notice.json` — **commit that file.** CI rebuilds and fails
if the committed output differs.

## Step 6: Write a story

```bash
touch packages/ui/src/components/notice.stories.tsx
```

Three stories are the minimum. Follow `button.stories.tsx` as the canonical example:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Notice } from './notice.js'

const meta = { title: 'Components/Notice', component: Notice } satisfies Meta<typeof Notice>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Your return is due 30 September.', onDismiss: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }))
    await expect(args.onDismiss).toHaveBeenCalled()
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <Notice tone='neutral'>Neutral</Notice>
      <Notice tone='info'>Info</Notice>
    </div>
  ),
}

export const CssCheck: Story = {
  args: { children: 'Token check' },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot=notice]')!
    await expect(getComputedStyle(el).padding).not.toBe('0px')
  },
}
```

`Default` proves it mounts and is interactive. `Variants` renders every meaningful combination.
`CssCheck` asserts a computed style, which proves the stylesheet loaded — without it a
token-resolution failure looks like a passing test.

Stories live in `src/` but are excluded from the tsup build. Don't add an explicit entry for them.

Run them:

```bash
npm run test -w @workspace/storybook
```

This renders every story in real Chromium **and** runs axe at WCAG 2.x AA as an error. Takes
80–170s.

> If you hit a roaming `Cannot connect to the iframe` failure, don't assume it's your component —
> re-run the failing files in isolation and compare against an unmodified tree first.

## Step 7: Did you add a new dependency?

`Notice` didn't. If yours does, add it to `optimizeDeps.include` in
`apps/storybook/vitest.config.ts`:

```bash
npm run check:optimize-deps -w @workspace/storybook
```

Skip this and the Storybook job starts failing intermittently on an unrelated file.

## Step 8: Run the gates

`lint` + `typecheck` + `build` is not the merge gate. Run the real sequence:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run check:drift -w @nswds/ui
npm run check:radius -w @nswds/ui
npm run check:icons -w @nswds/ui
npm run build -w @nswds/ui
npm test -w @nswds/ui
npm run check:package -w @nswds/ui
./scripts/test-consumer-fixture.sh
npm run check:registry-resolves -w @nswds/ui
npm run check:optimize-deps -w @workspace/storybook
npm run test -w @workspace/storybook
```

Two that catch people out:

- **`format:check`** covers the **whole repo**, not just your files.
- **`./scripts/test-consumer-fixture.sh`** has **no npm script** — run it by path. Build first.

`check:cascade` runs inside `build`. If it fires, you paired a bare utility with a conditional
override of the same property — rewrite as mutually exclusive variants
(`max-lg:justify-center lg:justify-start`). [Why](explanation-architecture.md#surviving-someone-elses-build).

The full gate list with failure meanings is in the [CI gates reference](reference-ci-gates.md).

## Step 9: Commit and open a PR

Conventional Commits — the release pipeline depends on the type:

```bash
git add packages/ui/src/components/notice.tsx \
        packages/ui/src/components/notice.stories.tsx \
        packages/ui/src/index.ts \
        packages/ui/registry.json \
        apps/registry/public/r/notice.json \
        apps/registry/public/r/registry.json
git commit -m "feat(ui): add Notice component"
```

Stage files by name. Never `git add -A`.

`feat:` cuts a minor release; `fix:`/`perf:`/`revert:` a patch; a `BREAKING CHANGE` footer a major.
`docs:`/`chore:`/`refactor:` ship nothing — which is correct for a doc change and wrong for a
component.

A release also requires the commit to touch `packages/ui/`. Yours does.

---

## What you built

A component on both distribution channels, with interaction and accessibility coverage, that a
consumer can `npm install` **or** `npx shadcn add @nswds/notice`.

The pipeline you just walked is really one invariant enforced from several angles: **anything that
reaches one channel must reach the other, completely.** `check:drift` proves it's registered;
`check:registry-resolves` proves it would compile once copied; the consumer fixture proves the
tarball works as received.

### Where to go next

- **[CI gates reference](reference-ci-gates.md)** — every check and what its failure means
- **[Architecture](explanation-architecture.md)** — why the two-channel rule exists
- **Adding a pattern instead?** Files go in `src/patterns/`, register as `registry:block`, and must
  **never** be exported from the npm barrel. `check:drift` enforces the inverse rule there.
- **Scaffolding from shadcn?** `npx shadcn@latest add <component>` inside `packages/ui`, then do the
  NSWDS cleanup: convert `@/…` imports to relative, swap Radix primitives for Base UI, replace raw
  palette colours with semantic tokens.
- **[AGENTS.md](../AGENTS.md)** — the canonical contributor reference
