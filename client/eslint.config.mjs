import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextConfig = require("eslint-config-next");

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/google-font-display": "off",
      "@next/next/no-page-custom-font": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/use-memo": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default config;
