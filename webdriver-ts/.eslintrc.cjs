module.exports = {
  env: { node: true, es2024: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json"],
  },
  root: true,
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "require-await": "error",
    "@typescript-eslint/no-floating-promises": "error",
  },
};
