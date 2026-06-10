/** @type {import("prettier").Config} */
module.exports = {
  endOfLine: 'lf',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: 'packages/ui/src/styles/globals.css',
  tailwindFunctions: ['cn', 'cva'],
}
