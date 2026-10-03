// Entry-level ESLint, mirroring the shape of the repository's own root
// eslint.config.js (flat config, @eslint/js recommended + typescript-eslint
// recommended) scoped to this entry's browser sources.
import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    ignores: ["dist/", "node_modules/"],
  }
);
