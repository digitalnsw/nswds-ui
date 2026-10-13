# @workspace/auth

Sign-in for this repo's Next.js apps, consumed as TypeScript source (each app lists it in
`transpilePackages`). Every NSW Design site — design.nsw.gov.au, ui.design.nsw.gov.au and
email.design.nsw.gov.au — signs in against one Neon database (nswds-design's) with one
`BETTER_AUTH_SECRET`, and in production the session cookie is scoped to `design.nsw.gov.au`
(`sharedCookieDomain`), so one sign-in, and one sign-out, covers them all. Previews and localhost
keep a host-only cookie and sign in on their own.

What an app adds, each a few lines over this package:

| File                                                                                                                                          | Does                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/auth.ts`                                                                                                                                 | `createAuth({ basePath, nextBasePath, trustedOrigins })` — the server instance, with the app's path so the endpoints sit under it; `nextBasePath` when the path is Next's `basePath`, which Next strips before the handler runs. |
| `app/api/auth/[...all]/route.ts` (or `app/<folder>/api/auth/[...all]/route.ts` for an app whose routes live under a folder, like the builder) | `toNextJsHandler(auth)` — every client call is an HTTP request to a path under `<basePath>/api/auth`; Next adds its own `basePath` to the route, a folder prefix is part of the path.                                            |
| `proxy.ts`                                                                                                                                    | `createProxy(auth, …)` plus a literal `config.matcher` — the whole app behind sign-in.                                                                                                                                           |
| `app/sign-in`, `app/sign-up`, `app/account`                                                                                                   | The pages, over `SignInPanel`, `SignUpPanel` and `AccountPanel`; the forms and the sign-out take the same `basePath` and build the browser client from it.                                                                       |

Environment (the repo-root `.env`, which every app's `next.config` loads; see `.env.example`):
`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the app's origin, no path) and
`SIGNUP_ALLOWED_EMAILS` (fail-closed: unset means nobody can register).

The database is nswds-design's, and nswds-design owns its schema and migrations
(`src/db/schema.ts`, `drizzle/` and `npm run db:migrate` in that repo). `src/db/schema.ts` here is a
copy the Drizzle adapter needs and must match that file; a schema change is made in nswds-design,
migrated from there, and then copied here and into the other toolkit. There is deliberately no
migration tooling in this package, so no repo but nswds-design writes the database's migration
history.

The browser suites run a built app with no database: `NSWDS_AUTH_GATE=off` lifts the gate, and
only on localhost, so the switch cannot open a deployment. Each `playwright.config.ts` passes it to
`next start`.

A preview deployment is trusted through the addresses Vercel sets for it (`VERCEL_URL`,
`VERCEL_BRANCH_URL`); a zone lists its own domain in `trustedOrigins` so its sign-in page works there
too. `@workspace/auth/env` holds `loadRootEnv`, which a `next.config.ts` can call to read the root
`.env`.

Registration is one-shot per allowlisted address (no email verification): claim each address
before the site is shared. The gate remembers where a signed-out visitor was going (`from`) and the
forms return them there after sign-in, for a path of the app only.
