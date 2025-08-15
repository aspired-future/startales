import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

describe('TC001: Monorepo build succeeds across workspaces', () => {
  test('pnpm -r build succeeds for server, shared, ui_frontend', () => {
    // Run the build command
    expect(() => {
      execSync('pnpm -r build', { 
        stdio: 'pipe',
        cwd: process.cwd(),
        timeout: 60000 // 60 second timeout
      });
    }).not.toThrow();
  });

  test('Root build orchestrates per-package builds', () => {
    // Check that expected dist directories exist after build
    const expectedDists = [
      'packages/server/dist',
      'packages/shared/dist',
      'packages/ui_frontend/dist'
    ];

    expectedDists.forEach(distPath => {
      const fullPath = path.join(process.cwd(), distPath);
      expect(existsSync(fullPath)).toBe(true);
    });
  });

  test('Build produces expected output files', () => {
    // Check for specific output files that should exist after build
    const expectedFiles = [
      'packages/server/dist/index.js',
      'packages/shared/dist/index.js',
      'packages/shared/dist/index.d.ts'
    ];

    expectedFiles.forEach(filePath => {
      const fullPath = path.join(process.cwd(), filePath);
      expect(existsSync(fullPath)).toBe(true);
    });
  });
});

