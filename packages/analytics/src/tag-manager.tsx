'use client'

import { GoogleTagManager } from '@next/third-parties/google'
import { useSyncExternalStore } from 'react'

import { isProductionHost, tagManagerId } from './paths'
import { isCleanLocation } from './redact'

// The address never changes while the page is open, so there is nothing to subscribe to.
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
 */
export function TagManager({ containerId }: { containerId: string | undefined }) {
  const id = tagManagerId(containerId)
  const allowed = useSyncExternalStore(subscribe, allowedHere, onServer)
  return id && allowed ? <GoogleTagManager gtmId={id} /> : null
}
