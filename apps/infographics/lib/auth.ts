import { createAuth } from '@workspace/auth/server'

/**
 * The path this app is served under: the `/infographics` zone of the shared domain (next.config.mjs). Next prefixes the route handler's path with it, so the endpoints are at `/infographics/api/auth`.
 * The pages hand it to the forms so the browser client calls `/infographics/api/auth`;
 * the server matches the request without it, because Next strips its `basePath`
 * before the route handler runs (`nextBasePath`).
 */
export const basePath = '/infographics'

/**
 * The Better Auth server instance for this app — shared by the route handler,
 * the proxy and any server-side session read. One database and one secret
 * serve every app in this repo, so a session signed in here is valid across
 * the domain.
 */
export const auth = createAuth({ basePath, nextBasePath: true })
