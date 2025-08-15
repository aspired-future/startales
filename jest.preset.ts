import type { Config } from 'jest';

const preset: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }] },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};

export default preset;

