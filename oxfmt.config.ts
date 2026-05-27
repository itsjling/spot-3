import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ".agents/**",
    ".claude/**",
    ".expo/**",
    ".turbo/**",
    "**/.turbo/**",
    "convex/_generated/**",
    "node_modules/**",
    "packages/backend/convex/_generated/**",
  ],
});
