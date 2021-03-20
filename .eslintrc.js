module.exports = {
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
    sourceType: "script"
  },
  env: {
    browser: true,
    node: false
  },
  plugins: [
    "svelte3",
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended"
  ],
  rules: {
    "no-warning-comments": "warn",
    "@typescript-eslint/array-type": ["error", {default: "generic"}],
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/no-extraneous-class": "error",
    "@typescript-eslint/no-namespace": ["error", {allowDeclarations: true}],
    "@typescript-eslint/no-non-null-assertion": "off"
  },
  settings: {
    "svelte3/typescript": require("typescript")
  },
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3"
    },
    {
      files: ["gulpfile.js", "frontend.webpack.config.js"],
      rules: {
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  globals: {
    google: "readonly",
    MoveError: "readonly",
    MoveResponse: "readonly",
    NamedRecord: "readonly"
  }
}
