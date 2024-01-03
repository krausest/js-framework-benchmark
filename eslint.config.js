import globals from "globals";
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import reactHooks from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";

export default [
  js.configs.recommended,
  {
    ignores: ["**/dist", "**/results", "**/node_modules", "css", "**/csv_export.js"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "@typescript-eslint": ts },
    languageOptions: { parser: tsParser },
    rules: ts.configs["recommended"].rules,
  },
  /**
   * Root
   */
  {
    files: ["*.js", "utils/**/*", "cli/**/*.js"],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  /**
   * Server
   */
  {
    files: ["server/**/*"],
    languageOptions: { globals: { ...globals.node } },
  },
  /**
   * Webdriver
   */
  {
    files: ["webdriver-ts/**/*.ts"],
    plugins: { unicorn },
    languageOptions: {
      parserOptions: { project: ["./webdriver-ts/tsconfig.eslint.json"] },
      globals: { ...globals.node },
    },
    rules: {
      ...unicorn.configs.recommended.rules,
      // no:
      "unicorn/filename-case": "off",
      "unicorn/no-for-loop": "off",
      "unicorn/no-process-exit": "off",
      "unicorn/numeric-separators-style": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/prefer-spread": "off",
      "unicorn/prefer-ternary": "off",
      "unicorn/require-number-to-fixed-digits-argument": "off",
      "unicorn/prefer-set-has": "off",
      "unicorn/unicorn/no-array-reduce": "off",
      // maybe not:
      "unicorn/consistent-function-scoping": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-await-expression-member": "off",
      "unicorn/no-zero-fractions": "off",
      "unicorn/prefer-top-level-await": "off",
      "unicorn/prefer-module": "off",
      // maybe add later:
      "unicorn/no-null": "off",
      "unicorn/switch-case-braces": "off",
      "unicorn/prefer-dom-node-text-content": "off",
      "unicorn/prefer-optional-catch-binding": "off",
      "unicorn/prefer-logical-operator-over-ternary": "off",

      "@typescript-eslint/no-explicit-any": "off",
      "require-await": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  /**
   * Web
   */
  {
    files: ["webdriver-ts-results/**/*.tsx"],
    plugins: {
      react,
      "react-refresh": reactRefresh,
      "react-hooks": reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,

      "react/jsx-no-useless-fragment": "warn",
      "react-refresh/only-export-components": "warn",
    },
    settings: { react: { version: "detect" } },
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: ["webdriver-ts-results/**/*"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "@typescript-eslint/no-loss-of-precision": "off",
      "no-debugger": "off",
    },
  },
];
