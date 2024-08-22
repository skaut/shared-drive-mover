import eslintPluginSvelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';
import svelteParser from "svelte-eslint-parser";
import js from "@eslint/js";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...eslintPluginSvelte.configs['flat/recommended'],
  ...eslintPluginSvelte.configs['flat/prettier'],
  {
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        projectService: {
          allowDefaultProject: ["*.js"],
          defaultProject: "tsconfig.json",
        },
      },
    },
    rules: {
      "@typescript-eslint/array-type": ["error", { "default": "generic" }],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
      "array-callback-return": "error",
      "arrow-body-style": ["error", "as-needed"],
      "block-scoped-var": "error",
      "consistent-return": "error",
      "default-case": "error",
      "default-case-last": "error",
      "eqeqeq": "error",
      "guard-for-in": "error",
      "logical-assignment-operators": "error",
      "new-cap": "error",
      "no-alert": "error",
      "no-await-in-loop": "error",
      "no-console": "error",
      "no-constructor-return": "error",
      "no-duplicate-imports": "error",
      "no-else-return": "error",
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-inner-declarations": "error",
      "no-invalid-this": "error",
      "no-iterator": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-multi-assign": "error",
      "no-new-func": "error",
      "no-object-constructor": "error",
      "no-param-reassign": "error",
      "no-promise-executor-return": "error",
      "no-return-assign": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-template-curly-in-string": "error",
      "no-unreachable-loop": "error",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "no-warning-comments": "warn",
      "object-shorthand": "error",
      "operator-assignment": "error",
      "prefer-exponentiation-operator": "error",
      "prefer-object-spread": "error",
      "prefer-regex-literals": "error",
      "prefer-template": "error",
      "radix": "error",
      "require-atomic-updates": "error",
      "require-unicode-regexp": "error",
      "sort-keys": "error",
      "strict": ["error", "never"],
    }
  },
  {
    files: ["**/*.svelte", "*.svelte"],
    languageOptions: {
      globals: {
        google: "readonly",
      },
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
    }
  }
);
