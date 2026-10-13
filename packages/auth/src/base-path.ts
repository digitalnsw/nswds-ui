/**
 * Where Better Auth's endpoints sit for an app served under `basePath`. Shared
 * by the server factory (`createAuth`) and the browser client
 * (`getAuthClient`), which must agree on it; kept dependency-free so the
 * client bundle does not pull in the server module.
 */
export function authBasePath(basePath = ''): string {
  return `${basePath.replace(/\/+$/, '')}/api/auth`
}
