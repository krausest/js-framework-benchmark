import globals from "globals";
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
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
      "unicorn/no-console-spaces": "error",
      // "unicorn/filename-case": "error",
      // "unicorn/better-regex": "error",
      // "unicorn/catch-error-name": "error",
      // "unicorn/consistent-destructuring": "error",
      // "unicorn/consistent-function-scoping": "error",
      // "unicorn/custom-error-definition": "off",
      // "unicorn/empty-brace-spaces": "error",
      // "unicorn/error-message": "error",
      // "unicorn/escape-case": "error",
      // "unicorn/expiring-todo-comments": "error",
      // "unicorn/explicit-length-check": "error",
      // "unicorn/import-style": "error",
      // "unicorn/new-for-builtins": "error",
      // "unicorn/no-abusive-eslint-disable": "error",
      // "unicorn/no-array-callback-reference": "error",
      // "unicorn/no-array-for-each": "error",
      // "unicorn/no-array-method-this-argument": "error",
      // "unicorn/no-array-push-push": "error",
      // "unicorn/no-array-reduce": "error",
      // "unicorn/no-await-expression-member": "error",
      // "unicorn/no-console-spaces": "error",
      // "unicorn/no-document-cookie": "error",
      // "unicorn/no-empty-file": "error",
      // "unicorn/no-for-loop": "error",
      // "unicorn/no-hex-escape": "error",
      // "unicorn/no-instanceof-array": "error",
      // "unicorn/no-invalid-remove-event-listener": "error",
      // "unicorn/no-keyword-prefix": "off",
      // "unicorn/no-lonely-if": "error",
      // "no-negated-condition": "off",
      // "unicorn/no-negated-condition": "error",
      // "no-nested-ternary": "off",
      // "unicorn/no-nested-ternary": "error",
      // "unicorn/no-new-array": "error",
      // "unicorn/no-new-buffer": "error",
      // "unicorn/no-null": "error",
      // "unicorn/no-object-as-default-parameter": "error",
      // "unicorn/no-process-exit": "error",
      // "unicorn/no-static-only-class": "error",
      // "unicorn/no-thenable": "error",
      // "unicorn/no-this-assignment": "error",
      // "unicorn/no-typeof-undefined": "error",
      // "unicorn/no-unnecessary-await": "error",
      // "unicorn/no-unreadable-array-destructuring": "error",
      // "unicorn/no-unreadable-iife": "error",
      // "unicorn/no-unused-properties": "off",
      // "unicorn/no-useless-fallback-in-spread": "error",
      // "unicorn/no-useless-length-check": "error",
      // "unicorn/no-useless-promise-resolve-reject": "error",
      // "unicorn/no-useless-spread": "error",
      // "unicorn/no-useless-switch-case": "error",
      // "unicorn/no-useless-undefined": "error",
      // "unicorn/no-zero-fractions": "error",
      // "unicorn/number-literal-case": "error",
      // "unicorn/numeric-separators-style": "error",

      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "require-await": "error",
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
  /**
   * Web
   */
  {
    files: ["webdriver-ts-results/**/*.tsx"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
    },
    settings: { react: { version: "detect" } },
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: ["webdriver-ts-results/**/*"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "@typescript-eslint/no-loss-of-precision": "off",
    },
  },
];
