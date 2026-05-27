import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import jest from "ultracite/oxlint/jest";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, react, jest],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    ".agents/**",
    ".claude/**",
    ".expo/**",
    ".turbo/**",
    "**/.turbo/**",
    "node_modules/**",
    "packages/backend/convex/_generated/**",
  ],
});
