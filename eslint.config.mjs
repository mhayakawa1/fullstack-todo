import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,ts,tsx}"] },
  {
    files: ["**/*.{.js,mjs,ts,tsx}"],
    languageOptions: { sourceType: "commonjs" }
   
  },
  {
     rules: {
      "no-unused-vars": "error",
      "no-console": "error",
      "prefer-const": "error",
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-extra-semi": "error",
      camelcase: "error",
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
