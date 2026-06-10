/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', 'fix', 'refactor', 'perf', 'style', 'test',
        'build', 'ops', 'docs', 'chore', 'merge', 'revert',
      ],
    ],
  },
};

export default config;
