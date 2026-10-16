'use client'

import { GoogleTagManager } from '@next/third-parties/google'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useSyncExternalStore } from 'react'

import { isProductionHost, tagManagerId } from './paths'
import { isCleanLocation } from './redact'

// Nothing to subscribe to: client-side navigation fires no event a store could listen for.
// Instead the component reads the route below, so each navigation re-renders it, and React
// takes the snapshot again on every render.
const subscribe = () => () => {}
const allowedHere = () =>
  isProductionHost(window.location.hostname) &&
  isCleanLocation(window.location.search, window.location.hash)
// The server cannot know which address the page will be shown on, so it renders no tag.
const onServer = () => false

/**
 * The Google Tag Manager container the NSW Design sites share (its GA4 tag fires inside it), or
 * nothing when the ID is unset, when the page is not on a production address (`isProductionHost`:
 * a zone's production build also serves a host app's preview), or when the address carries anything
 * `redactUrl` would remove (`isCleanLocation`). GA4 reads the address itself and cannot be handed a
 * redacted one, so a sign-in page whose `from` carries a query, or a link with any other parameter,
 * loads no container at all. Place it in `<html>`, before `<body>`. The app passes
 * `process.env.NEXT_PUBLIC_GTM_ID`, read where Next inlines it.
 *
 * The check runs again on every client-side navigation, so a visitor who signs in from a
 * suppressed sign-in page gets the container on the clean page the sign-in form sends them to.
 * Once loaded it stays loaded: the apps never navigate client-side to an address with anything to
 * redact, since the only one, the gate's sign-in redirect, is a full page load.
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
