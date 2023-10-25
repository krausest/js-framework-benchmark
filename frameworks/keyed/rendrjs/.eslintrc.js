module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'semi': 2,
    'no-useless-escape': 2,
    'no-return-assign': 2,
    'no-param-reassign': 2,
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
  },
};
