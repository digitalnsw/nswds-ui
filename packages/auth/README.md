# @workspace/auth

Sign-in for this repo's Next.js apps, consumed as TypeScript source (each app lists it in
`transpilePackages`). One Neon database and one `BETTER_AUTH_SECRET` serve every app, so a session
signed in on one app of the shared domain is valid on all of them.

What an app adds, each a few lines over this package:

| File                                        | Does                                                                                                                                                                                                                             |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/auth.ts`                               | `createAuth({ basePath, nextBasePath, trustedOrigins })` — the server instance, with the app's path so the endpoints sit under it; `nextBasePath` when the path is Next's `basePath`, which Next strips before the handler runs. |
| `app/<basePath>/api/auth/[...all]/route.ts` | `toNextJsHandler(auth)` — every client call is an HTTP request to a path under `<basePath>/api/auth`.                                                                                                                            |
| `proxy.ts`                                  | `createProxy(auth, …)` plus a literal `config.matcher` — the whole app behind sign-in.                                                                                                                                           |
| `app/sign-in`, `app/sign-up`, `app/account` | The pages, over `SignInPanel`, `SignUpPanel` and `AccountPanel`; the forms and the sign-out take the same `basePath` and build the browser client from it.                                                                       |

Environment (the repo-root `.env`, which every app's `next.config` loads; see `.env.example`):
`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the app's origin, no path) and
`SIGNUP_ALLOWED_EMAILS` (fail-closed: unset means nobody can register).

The Drizzle schema and its migrations live here (`src/db/schema.ts`, `drizzle/`). Apply them once per
database with `npm run db:migrate -w @workspace/auth`; `db:generate` after a schema change.

The browser suites run a built app with no database: `NSWDS_AUTH_GATE=off` lifts the gate, and
only on localhost, so the switch cannot open a deployment. Each `playwright.config.ts` passes it to
`next start`.

A preview deployment is trusted through the addresses Vercel sets for it (`VERCEL_URL`,
`VERCEL_BRANCH_URL`); a zone lists its own domain in `trustedOrigins` so its sign-in page works there
too. `@workspace/auth/env` holds `loadRootEnv`, which a `next.config.ts` can call to read the root
`.env`.
