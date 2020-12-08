module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.babelrc.js',
        'webpack.config.js',
      ],
      env: {
        es6: true,
        node: true,
      },
    },
    // source Js
    {
      files: ['**/src/**/*.js', '**/test/**/*.js'],
      env: {
        es2020: true,
        browser: true,
      },
      parserOptions: {
        sourceType: 'module',
      },
    },
    // TypeScript source
    {
      files: ['**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

        // disabling this one because of DEBUG APIs, if we ever find a better
        // way to suport those we should re-enable it
        '@typescript-eslint/no-non-null-assertion': 'off',

        '@typescript-eslint/no-use-before-define': 'off',
      }
    },
  ],
};
