'use client'

import { GoogleTagManager } from '@next/third-parties/google'
import { useSyncExternalStore } from 'react'

import { isProductionHost, tagManagerId } from './paths'

// The address never changes while the page is open, so there is nothing to subscribe to.
const subscribe = () => () => {}
const onProductionHost = () => isProductionHost(window.location.hostname)
// The server cannot know which address the page will be shown on, so it renders no tag.
const onServer = () => false

/**
 * The Google Tag Manager container the NSW Design sites share (its GA4 tag fires inside it), or
 * nothing when the ID is unset or the page is not on a production address (`isProductionHost`): the
 * ID is set on production builds only, but a zone's production build also serves a host app's
 * preview. Place it in `<html>`, before `<body>`. The app passes `process.env.NEXT_PUBLIC_GTM_ID`,
 * read where Next inlines it; setting it in Vercel changes nothing until the next deployment.
 */
export function TagManager({ containerId }: { containerId: string | undefined }) {
  const id = tagManagerId(containerId)
  const allowed = useSyncExternalStore(subscribe, onProductionHost, onServer)
  return id && allowed ? <GoogleTagManager gtmId={id} /> : null
}
