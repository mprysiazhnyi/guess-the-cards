module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended", // Enables Prettier as an ESLint rule
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "jsx-a11y", "prettier"],
    rules: {
        "prettier/prettier": "error", // Highlight Prettier formatting issues as ESLint errors
        "react/react-in-jsx-scope": "off", // Not needed with React 17+
        "@typescript-eslint/no-unused-vars": ["warn"], // Warn for unused variables
        "react/prop-types": "off", // Disable PropTypes validation (use TypeScript instead)
    },
    settings: {
        react: {
            version: "detect", // Automatically detect the React version
        },
    },
};