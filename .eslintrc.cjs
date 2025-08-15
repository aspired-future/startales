/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'import', 'unused-imports'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'prettier'
	],
	ignorePatterns: ['dist/**', 'node_modules/**'],
	rules: {
		'@typescript-eslint/no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'warn',
		'import/order': ['warn', { 'alphabetize': { order: 'asc', caseInsensitive: true } }]
	},
	overrides: [
		{
			files: ['packages/ui_frontend/**/*.{ts,tsx}'],
			env: { browser: true },
			extends: ['plugin:jsx-a11y/recommended'],
			plugins: ['jsx-a11y']
		}
	]
};
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


