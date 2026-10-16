/**
 * The sign-in return path: written by the gate (`createProxy`) as `from` on the
 * sign-in URL, read by the forms after sign-in. Dependency-free on purpose —
 * the forms are client components, and this is the one thing they share with
 * the proxy, which imports `next/server`.
 */

/** The query parameter the gate uses to carry the page a visitor was after. */
export const RETURN_PARAM = 'from'

/**
 * `value` if it is a path of this app the forms may send a visitor to after
 * sign-in, else `null`: an absolute path, so never another origin
 * (`https://…`, `//evil`, or anything the URL parser would resolve off this
 * origin) or a scheme; `basePath`-relative, which `router.push` prefixes. Read
 * on both ends — the gate writes it, the forms read it.
 */
export function safeReturnPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return null
  }
  // No control characters anywhere: a newline or NUL has no place in a path
  // and is how a value tries to smuggle a header or a second URL.
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if (code < 0x20 || code === 0x7f) return null
  }
  // And what a browser would make of it stays on this origin: the URL parser
  // drops some characters (a tab, say) before it looks for `//`, so the text
  // checks above are not the last word.
  let resolved: URL
  try {
    resolved = new URL(value, SAME_ORIGIN)
  } catch {
    return null
  }
  if (resolved.origin !== SAME_ORIGIN || !resolved.pathname.startsWith('/')) return null
  // And the parser changed nothing: the gate writes the path in the parser's
  // own form, so a value it would rewrite was not written by the gate. That
  // refuses dot segments, raw (`/../builder`) or encoded (`/%2e%2e/builder`),
  // which under a zone's basePath would resolve to another app on the shared
  // domain once the prefix is put in front of them.
  if (`${resolved.pathname}${resolved.search}` !== value) return null
  return value
}

/** A stand-in origin to resolve a return path against; only equality matters. */
const SAME_ORIGIN = 'https://same-origin.invalid'

/** The pathname of a return path that has passed `safeReturnPath`. */
export function pathnameOf(returnPath: string): string {
  return new URL(returnPath, SAME_ORIGIN).pathname
}

/**
 * `path` under the app's `basePath`, without the `/infographics/` a plain join
 * would produce for the root: Next 308s that to `/infographics`, and a zone's
 * rewrite on the shared domain only matches the slash-less form directly.
 */
export function underBasePath(basePath: string, path: string): string {
  return basePath && path === '/' ? basePath : `${basePath}${path}`
}

/**
 * The address to load in place of an auth page once the visitor is in, or
 * `null` to move on with a client-side push. A page whose own address carries a
 * query or a fragment (the gate's `from`) is replaced by a full document load:
 * Back can no longer return to it, and the analytics (@workspace/analytics),
 * which stay off for the life of a document that began at such an address,
 * start afresh on the clean one.
 */
export function replacementAddress(
  current: { search: string; hash: string },
  basePath: string,
  destination: string,
): string | null {
  return current.search || current.hash ? underBasePath(basePath, destination) : null
}
