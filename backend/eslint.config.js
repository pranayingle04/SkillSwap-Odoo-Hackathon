// eslint.config.js
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Core ESLint rules
      'no-unused-vars': 'warn',
      'no-console': 'off',

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
  // Add Prettier config last to disable conflicting rules
  ...eslintConfigPrettier,
];
