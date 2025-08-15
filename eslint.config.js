// ESLint flat config (v9+)
import js from '@eslint/js';
import ts from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unused from 'eslint-plugin-unused-imports';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist/**', 'node_modules/**'],
    plugins: {
      import: importPlugin,
      'unused-imports': unused,
      'jsx-a11y': jsxA11y
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'import/order': ['warn', { alphabetize: { order: 'asc', caseInsensitive: true } }]
    }
  },
  {
    files: ['packages/ui_frontend/**/*.{ts,tsx}'],
    languageOptions: { globals: { document: 'readonly', window: 'readonly' } },
  }
];

