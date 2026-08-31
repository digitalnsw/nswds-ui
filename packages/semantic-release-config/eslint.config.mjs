import { config } from '@workspace/eslint-config/base'

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    // release-scope.mjs decides whether a release happens at all, and index.cjs
    // is the plugin chain around it — the most consequential logic in the repo
    // outside packages/ui, and until now the only such logic outside the lint
    // gate (`turbo lint` ran in 3 of 9 workspaces).
    //
    // Named `.mjs`, not `.js`: this package has no `"type": "module"` (it must
    // not — `index.cjs` is the semantic-release entry point and `release-scope.mjs`
    // is explicitly ESM, so the field would be a lie either way), and an ESM
    // `.js` config in a CJS package makes Node reparse it with a warning on
    // every lint run.
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
  {
    // index.cjs is genuinely CommonJS — semantic-release requires it — so it
    // needs the CJS globals rather than the module ones.
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
]
