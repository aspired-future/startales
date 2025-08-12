module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  settings: { react: { version: 'detect' } },
  env: { node: true, browser: true, es2021: true, jest: true },
  ignorePatterns: ['dist/', 'node_modules/'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
}


