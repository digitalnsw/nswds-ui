/**
 * Sign-up is restricted to an explicit allowlist of email addresses. The list
 * is deployment config rather than code: it is read from the
 * `SIGNUP_ALLOWED_EMAILS` environment variable (comma- or whitespace-separated)
 * so the permitted set can differ per environment without a code change. See
 * the root `.env.example`, and `databaseHooks.user.create.before` in
 * `./auth` for where the gate is enforced.
 *
 * The check is deliberately fail-closed: an empty or unset allowlist permits
 * nobody, so a missing/blank env var can never silently re-open the public
 * self-registration that this gate exists to close.
 */

/** Parse the raw env value into a normalised set of allowed email addresses. */
export function parseAllowedEmails(raw: string | undefined): Set<string> {
  if (!raw) return new Set()

  return new Set(
    raw
      .split(/[\s,]+/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )
}

/** Whether `email` may register, given a normalised allowlist. */
export function isEmailAllowed(email: string, allowlist: Set<string>): boolean {
  return allowlist.has(email.trim().toLowerCase())
}
