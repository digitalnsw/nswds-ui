'use client'

import { GoogleTagManager } from '@next/third-parties/google'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useSyncExternalStore } from 'react'

import { isProductionHost, tagManagerId } from './paths'
import { isCleanLocation, isCleanReferrer } from './redact'

/**
 * The address this document was first loaded at, read when this module first runs in the browser,
 * which is the first page's hydration: the layout renders the tag on every page. Within one
 * document the browser's Back button can return to it, and GTM's history trigger reports that
 * before React renders again, so a first address with anything to redact rules the container out
 * for the life of the document. The apps never push an address with anything to redact, so the
 * first address is the only one Back can bring back that a check here has not seen.
 */
const firstLocation =
  typeof window === 'undefined'
    ? null
    : { search: window.location.search, hash: window.location.hash }

// Nothing to subscribe to: client-side navigation fires no event a store could listen for.
// Instead the component reads the route below, so each navigation re-renders it, and React
// takes the snapshot again on every render.
const subscribe = () => () => {}
const allowedHere = () =>
  isProductionHost(window.location.hostname) &&
  isCleanLocation(window.location.search, window.location.hash) &&
  (!firstLocation || isCleanLocation(firstLocation.search, firstLocation.hash)) &&
  isCleanReferrer(document.referrer)
// The server cannot know which address the page will be shown on, so it renders no tag.
const onServer = () => false

/**
 * The Google Tag Manager container the NSW Design sites share (its GA4 tag fires inside it), or
 * nothing when the ID is unset, when the page is not on a production address (`isProductionHost`:
 * a zone's production build also serves a host app's preview), or when the address carries anything
 * `redactUrl` would remove (`isCleanLocation`). GA4 reads the address itself and cannot be handed a
 * redacted one, so a sign-in page the gate sent a visitor to (it carries `from`), or a link with
 * any other parameter, loads no container at all. Place it in `<html>`, before `<body>`. The app passes
 * `process.env.NEXT_PUBLIC_GTM_ID`, read where Next inlines it.
 *
 * The check runs again on every client-side navigation, so a visitor who signs in from a clean
 * sign-in page gets the container on the page the form sends them to. Once loaded it stays loaded,
 * so the check also requires the document's first address to be clean (`firstLocation`), and the
 * referrer GA4 will report (`isCleanReferrer`).
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
