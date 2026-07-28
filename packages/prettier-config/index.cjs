// Extends the fleet config, @nswds/prettier-config, rather than restating its
// values — so nswds-ui tracks the shared formatting automatically instead of
// drifting from it (it sat on printWidth 80 / trailingComma es5 while the rest
// of the fleet moved to 100 / all).
//
// The base deliberately omits the Tailwind block, because tailwindStylesheet is
// a repo-specific path. That, and the organize-imports plugin, stay local.
const base = require('@nswds/prettier-config')

/** @type {import("prettier").Config} */
module.exports = {
  ...base,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: 'packages/ui/src/styles/globals.css',
  tailwindFunctions: ['cn', 'cva'],
}
