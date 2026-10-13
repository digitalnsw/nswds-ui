/**
 * Where Better Auth's endpoints sit for an app served under `basePath`. Shared
 * by the server factory (`createAuth`) and the browser client
 * (`getAuthClient`), which must agree on it; kept dependency-free so the
 * client bundle does not pull in the server module.
 *
 * Trailing slashes are trimmed with a loop rather than a regular expression:
 * CodeQL flags `/\/+$/` as polynomial on a run of slashes, and though the value
 * is app config rather than user input, the loop is as clear and ends the finding.
 */
export function authBasePath(basePath = ''): string {
  let end = basePath.length
  while (end > 0 && basePath[end - 1] === '/') end--
  return `${basePath.slice(0, end)}/api/auth`
}
