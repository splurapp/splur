/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-refresh", "jsx-a11y"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/consistent-type-imports": "error",
  },
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["*dist", "tailwind.config.js", "vite.config.ts", ".eslintrc.cjs"],
};
