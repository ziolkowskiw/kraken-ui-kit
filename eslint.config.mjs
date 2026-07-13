import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "storybook-static/**",
      "coverage/**",
      "mcp/dist/**",
      "mcp/manifests/**",
      "public/**",
      "docs/components/**",
      "manifests/**",
      "src/styles/tokens.css",
      "**/*.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  // Relaxations to match current style (documented; extend during the lint loop).
  {
    rules: {
      // The kit uses `any` deliberately in a few generic wrappers.
      "@typescript-eslint/no-explicit-any": "off",
      // Unused vars: warn (not error), allow underscore-prefixed args.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Node scripts are not browser code: declare Node globals (console/process/fetch/etc.)
  // so no-undef reflects real bugs instead of flagging every script.
  {
    files: ["scripts/**/*.mjs", "*.config.{ts,mjs}", "mcp/scripts/**/*.mjs"],
    languageOptions: { globals: globals.node },
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  prettier, // MUST be last: disables formatting rules that fight Prettier.
);
