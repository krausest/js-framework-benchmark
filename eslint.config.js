import globals from "globals";
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    ignores: ["**/dist", "**/results", "**/node_modules", "css", "**/csv_export.js"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "@typescript-eslint": ts },
    languageOptions: { parser: tsParser },
    rules: { ...ts.configs["recommended"].rules },
  },
  /**
   * Root
   */
  {
    files: ["*.js", "utils/**/*", "cli/**/*.js"],
    languageOptions: { globals: { ...globals.node } },
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
    languageOptions: {
      parserOptions: { project: ["./webdriver-ts/tsconfig.eslint.json"] },
      globals: { ...globals.node },
    },
    rules: {
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "off",
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
