'use client'

import { GoogleTagManager } from '@next/third-parties/google'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useSyncExternalStore } from 'react'

import { tagManagerId } from './paths'
import { type PageAddress, tagManagerAllowed } from './tag-manager-rule'

/**
 * The address this document was first loaded at, read when this module first runs in the browser,
 * which is the first page's hydration: the layout renders the tag on every page. Within one
 * document the browser's Back button can return to it, and GTM's history trigger reports that
 * before React renders again, so a first address with anything to redact rules the container out
 * for the life of the document. The apps never push an address with anything to redact, so the
 * first address is the only one Back can bring back that a check here has not seen.
 */
const firstLocation: PageAddress | null =
  typeof window === 'undefined'
    ? null
    : {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      }

// Nothing to subscribe to: client-side navigation fires no event a store could listen for.
// Instead the component reads the route below, so each navigation re-renders it, and React
// takes the snapshot again on every render.
const subscribe = () => () => {}
const allowedHere = () =>
  tagManagerAllowed({
    hostname: window.location.hostname,
    current: window.location,
    first: firstLocation,
    referrer: document.referrer,
  })
// The server cannot know which address the page will be shown on, so it renders no tag.
const onServer = () => false

/**
 * The Google Tag Manager container the NSW Design sites share (its GA4 tag fires inside it), or
 * nothing when the ID is unset or `tagManagerAllowed` says no: when the page is not on a production
 * address (`isProductionHost`: a zone's production build also serves a host app's preview), or when
 * the address carries anything `redactUrl` would remove (`isCleanPath`, `isCleanLocation`). GA4 reads the address itself and cannot be handed a
 * redacted one, so a sign-in page the gate sent a visitor to (it carries `from`), a link with any
 * other parameter, or one with a fragment, even an in-page anchor, loads no container at all. Place
 * it in `<html>`, before `<body>`. The app passes `process.env.NEXT_PUBLIC_GTM_ID`, read where Next
 * inlines it.
 *
 * The check runs again on every client-side navigation, so a visitor who signs in from a clean
 * sign-in page gets the container on the page the form sends them to. One the gate sent to sign in
 * (its address carries `from`) is moved on by a full document load that replaces the sign-in page
 * (`replacementAddress` in @workspace/auth), so the page they wanted starts a clean document. Once loaded it stays loaded,
 * so the check also requires the document's first address to be clean (`firstLocation`), and the
 * referrer GA4 will report (`isCleanReferrer`).
 *
 * What it cannot cover is an address that changes after the container has loaded without a
 * navigation through Next, such as an in-page link that adds a fragment: no script can be unloaded.
 * Keeping the fragment out from then on is the container's job, in the `page_location` it gives the
 * GA4 tag.
 */
export function TagManager({ containerId }: { containerId: string | undefined }) {
  // `useSearchParams` needs a Suspense boundary, or the page it renders in would opt out of static
  // rendering; with one, only this tag waits for the browser.
  return (
    <Suspense fallback={null}>
      <TagManagerOnRoute containerId={containerId} />
    </Suspense>
  )
}

function TagManagerOnRoute({ containerId }: { containerId: string | undefined }) {
  usePathname()
  useSearchParams()
  const id = tagManagerId(containerId)
  const allowed = useSyncExternalStore(subscribe, allowedHere, onServer)
  return id && allowed ? <GoogleTagManager gtmId={id} /> : null
}
