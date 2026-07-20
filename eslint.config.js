import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
  },
  /**
   * Webdriver
   */
  {
    files: ["webdriver-ts/src/**/*.{js,cjs,ts}"],
    languageOptions: {
      parserOptions: { project: ["./webdriver-ts/tsconfig.eslint.json"] },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "require-await": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
    },
  },
  /**
   * Web
   */
  {
    files: ["webdriver-ts-results/**/*.{js,cjs,ts,jsx,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-refresh": reactRefreshPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/jsx-no-useless-fragment": "warn",
      "react-refresh/only-export-components": "warn",
    },
    settings: {
      react: {
        version: "18.2",
      },
    },
    languageOptions: {
      ...reactPlugin.configs.flat["jsx-runtime"].languageOptions,
      globals: { ...globals.browser },
    },
  },
  {
    ignores: ["**/node_modules/", "**/dist/", "**/results/", "css/", "**/csv_export.js", "**/py/"],
  },
  eslintConfigPrettier
);
