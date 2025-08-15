/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }] },
	extensionsToTreatAsEsm: ['.ts'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	collectCoverage: true,
	coverageDirectory: '<rootDir>/coverage',
	coverageReporters: ['text', 'lcov']
};

