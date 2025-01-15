import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";
import commentsConfig from "@eslint-community/eslint-plugin-eslint-comments/configs";
import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import jest from "eslint-plugin-jest";
import perfectionist from "eslint-plugin-perfectionist";
import playwright from "eslint-plugin-playwright";
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  prettierRecommended,
  commentsConfig.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...svelte.configs["flat/recommended"],
  ...svelte.configs["flat/prettier"],
  perfectionist.configs["recommended-natural"],
  {
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".svelte"],
        projectService: {
          allowDefaultProject: ["*.js"],
          defaultProject: "tsconfig.json",
        },
      },
    },
    plugins: {
      "eslint-comments": eslintComments,
      jest,
      "prefer-arrow-functions": preferArrowFunctions,
    },
    rules: {
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/class-methods-use-this": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/init-declarations": "error",
      "@typescript-eslint/method-signature-style": ["error", "method"],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unnecessary-parameter-property-assignment":
        "error",
      "@typescript-eslint/no-unnecessary-qualifier": "error",
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
      "@typescript-eslint/no-use-before-define": [
        "error",
        { functions: false },
      ],
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/parameter-properties": "error",
      "@typescript-eslint/prefer-enum-initializers": "error",
      "@typescript-eslint/prefer-includes": "off", // Requires newer ES
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/typedef": "error",
      "array-callback-return": "error",
      "arrow-body-style": ["error", "as-needed"],
      "block-scoped-var": "error",
      "consistent-return": "error",
      "default-case": "error",
      "default-case-last": "error",
      eqeqeq: "error",
      "eslint-comments/no-unused-disable": "error",
      "eslint-comments/require-description": [
        "error",
        {
          ignore: ["eslint-enable"],
        },
      ],
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
      "perfectionist/sort-svelte-attributes": "off",
      "perfectionist/sort-union-types": [
        "error",
        {
          groups: [
            "literal",
            "function",
            "import",
            "operator",
            "conditional",
            "object",
            "tuple",
            "intersection",
            "union",
            "named",
            "keyword",
            "nullish",
            "unknown",
          ],
        },
      ],
      "prefer-arrow-functions/prefer-arrow-functions": [
        "error",
        {
          allowNamedFunctions: true,
        },
      ],
      "prefer-exponentiation-operator": "error",
      "prefer-object-spread": "error",
      "prefer-regex-literals": "error",
      "prefer-template": "error",
      radix: "error",
      "require-atomic-updates": "error",
      "require-unicode-regexp": "error",
      strict: ["error", "never"],
      "svelte/block-lang": [
        "error",
        {
          enforceScriptPresent: true,
          script: "ts",
          style: "scss",
        },
      ],
      "svelte/button-has-type": "error",
      "svelte/derived-has-same-inputs-outputs": "error",
      "svelte/experimental-require-slot-types": "error",
      "svelte/experimental-require-strict-events": "error",
      "svelte/infinite-reactive-loop": "error",
      "svelte/no-dom-manipulating": "error",
      "svelte/no-dupe-on-directives": "error",
      "svelte/no-dupe-use-directives": "error",
      "svelte/no-extra-reactive-curlies": "error",
      "svelte/no-ignored-unsubscribe": "error",
      "svelte/no-immutable-reactive-statements": "error",
      "svelte/no-inline-styles": "error",
      "svelte/no-reactive-functions": "error",
      "svelte/no-reactive-literals": "error",
      "svelte/no-reactive-reassign": "error",
      "svelte/no-store-async": "error",
      "svelte/no-target-blank": "error",
      "svelte/no-unused-class-name": [
        "error",
        {
          allowedClassNames: ["mdc-typography--subtitle2"],
        },
      ],
      "svelte/no-useless-mustaches": "error",
      "svelte/prefer-class-directive": "error",
      "svelte/prefer-destructured-store-props": "error",
      "svelte/prefer-style-directive": "error",
      "svelte/require-each-key": "error",
      "svelte/require-event-dispatcher-types": "error",
      "svelte/require-optimized-style-attribute": "error",
      "svelte/require-store-callbacks-use-set-param": "error",
      "svelte/require-store-reactive-access": "error",
      "svelte/require-stores-init": "error",
      "svelte/shorthand-attribute": "error",
      "svelte/shorthand-directive": "error",
      "svelte/sort-attributes": "error",
      "svelte/spaced-html-comment": "error",
      "svelte/valid-each-key": "error",
    },
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
    rules: {
      "@typescript-eslint/init-declarations": "off",
    },
    settings: {
      svelte: {
        ignoreWarnings: ["@typescript-eslint/explicit-function-return-type"],
      },
    },
  },
  {
    files: ["tests/backend/**/*.ts"],
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      "@typescript-eslint/unbound-method": "off",
      "vitest/consistent-test-it": ["error", { withinDescribe: "test" }],
      "vitest/no-alias-methods": "error",
      "vitest/no-conditional-expect": "error",
      "vitest/no-conditional-in-test": "error",
      "vitest/no-conditional-tests": "error",
      "vitest/no-disabled-tests": "error",
      "vitest/no-duplicate-hooks": "error",
      "vitest/no-focused-tests": "error",
      "vitest/no-interpolation-in-snapshots": "error",
      "vitest/no-large-snapshots": "error",
      "vitest/no-mocks-import": "error",
      "vitest/no-standalone-expect": "error",
      "vitest/no-test-prefixes": "error",
      "vitest/no-test-return-statement": "error",
      "vitest/padding-around-all": "error",
      "vitest/prefer-called-with": "error",
      "vitest/prefer-comparison-matcher": "error",
      "vitest/prefer-each": "error",
      "vitest/prefer-equality-matcher": "error",
      "vitest/prefer-expect-assertions": [
        "error",
        {
          onlyFunctionsWithAsyncKeyword: true,
          onlyFunctionsWithExpectInCallback: true,
          onlyFunctionsWithExpectInLoop: true,
        },
      ],
      "vitest/prefer-expect-resolves": "error",
      "vitest/prefer-hooks-in-order": "error",
      "vitest/prefer-hooks-on-top": "error",
      "vitest/prefer-mock-promise-shorthand": "error",
      "vitest/prefer-snapshot-hint": "error",
      "vitest/prefer-spy-on": "error",
      "vitest/prefer-strict-equal": "error",
      "vitest/prefer-to-be": "error",
      "vitest/prefer-to-be-object": "error",
      "vitest/prefer-to-contain": "error",
      "vitest/prefer-to-have-length": "error",
      "vitest/prefer-todo": "error",
      "vitest/prefer-vi-mocked": "error",
      "vitest/require-hook": "error",
      "vitest/require-to-throw-message": "error",
      "vitest/valid-expect-in-promise": "error",
    },
  },
  {
    ...jest.configs["flat/recommended"],
    ...jest.configs["flat/style"],
    files: ["__tests__/**/*.test.ts", "__tests__/test-utils/gas-stubs.ts"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      ...jest.configs["flat/style"].rules,
      "jest/consistent-test-it": ["error", { withinDescribe: "test" }],
      "jest/no-conditional-in-test": "error",
      "jest/no-confusing-set-timeout": "error",
      "jest/no-duplicate-hooks": "error",
      "jest/no-test-return-statement": "error",
      "jest/no-untyped-mock-factory": "error",
      "jest/padding-around-all": "error",
      "jest/prefer-called-with": "error",
      "jest/prefer-comparison-matcher": "error",
      "jest/prefer-each": "error",
      "jest/prefer-equality-matcher": "error",
      "jest/prefer-expect-assertions": [
        "error",
        {
          onlyFunctionsWithAsyncKeyword: true,
          onlyFunctionsWithExpectInCallback: true,
          onlyFunctionsWithExpectInLoop: true,
        },
      ],
      "jest/prefer-expect-resolves": "error",
      "jest/prefer-hooks-in-order": "error",
      "jest/prefer-hooks-on-top": "error",
      "jest/prefer-jest-mocked": "error",
      "jest/prefer-mock-promise-shorthand": "error",
      "jest/prefer-spy-on": "error",
      "jest/prefer-strict-equal": "error",
      "jest/require-hook": "error",
      "jest/require-to-throw-message": "error",
      "jest/unbound-method": "error",
    },
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/frontend/**/*.ts"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-commented-out-tests": "error",
      "playwright/no-duplicate-hooks": "error",
      "playwright/no-get-by-title": "error",
      "playwright/no-nth-methods": "error",
      "playwright/no-raw-locators": "error",
      "playwright/prefer-comparison-matcher": "error",
      "playwright/prefer-equality-matcher": "error",
      "playwright/prefer-hooks-in-order": "error",
      "playwright/prefer-hooks-on-top": "error",
      "playwright/prefer-strict-equal": "error",
      "playwright/prefer-to-be": "error",
      "playwright/prefer-to-contain": "error",
      "playwright/prefer-to-have-count": "error",
      "playwright/prefer-to-have-length": "error",
      "playwright/require-hook": "error",
      "playwright/require-to-throw-message": "error",
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
    },
  },
);
