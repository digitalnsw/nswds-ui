'use client'

/**
 * The whole icon set, re-exported as CLIENT references.
 *
 * **The problem this solves.** `Button`, `ButtonLink` and `FooterSocialLink`
 * take their icon as a component (`leadingVisual`, `trailingVisual`, `icon`) —
 * a PROP, not a rendered element. The generated modules in this directory carry
 * no `'use client'`, so in a React Server Components app they are plain server
 * modules and their exports are ordinary functions. Functions cannot cross the
 * server/client boundary as props, so a server component doing this:
 *
 * ```tsx
 * import { IconDownload } from '@nswds/ui/icons'
 * <ButtonLink href={url} leadingVisual={IconDownload}>Download</ButtonLink>
 * ```
 *
 * fails at runtime with *"Functions cannot be passed directly to Client
 * Components"* — an error that names neither the icon nor the boundary.
 * Importing from here instead makes each export a client reference, which
 * serialises:
 *
 * ```tsx
 * import { IconDownload } from '@nswds/ui/icons/client'
 * ```
 *
 * **Prefer the element form where you can.** Every icon slot also accepts an
 * element, and that is the better answer for a server component:
 *
 * ```tsx
 * import { IconDownload } from '@nswds/ui/icons'
 * <ButtonLink href={url} leadingVisual={<IconDownload />}>Download</ButtonLink>
 * ```
 *
 * The icon modules are deliberately NOT client components, so an element
 * rendered on a server page ships no JavaScript at all. Marking them as client
 * references — which is exactly what this entry point does — gives that up: the
 * icon's module is sent to the browser. It is a real trade, and it is why this
 * is a separate subpath rather than the default.
 *
 * So reach for this when the component form is what you actually need — an
 * icon selected from a lookup table, a prop typed as `ElementType`, a config
 * object shared between server and client code — and use the element form
 * everywhere else. A component that is already client-side (`'use client'`)
 * needs neither, and should import from `@nswds/ui/icons`.
 *
 * **On bundle size.** This re-exports the barrel, so it inherits the barrel's
 * tree-shaking: a bundler drops what is not referenced. Where a build cannot
 * tree-shake, import the single icon's own module (`@nswds/ui/icons/download`)
 * and re-export it from your own `'use client'` module instead.
 */
export * from './index.js'
