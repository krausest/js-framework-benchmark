// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import importPlugin from 'eslint-plugin-import-x'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    semi: false,
    quoteProps: 'as-needed',
    commaDangle: 'always-multiline',
  }),
  {
    plugins: {
      '@stylistic': stylistic,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-tabs': 'error',
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/comma-style': ['error', 'last'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/type-generic-spacing': ['error'],
      '@stylistic/max-len': ['error', { code: 110 }],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
    },
  },
  globalIgnores(['dist/']),
)
