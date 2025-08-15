import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

describe('TC005: Jest + ts-jest and Playwright configured', () => {
  test('Jest configuration exists and is valid', () => {
    const jestConfigs = [
      'jest.config.js',
      'jest.config.cjs',
      'jest.config.ts',
      'jest.config.json'
    ];
    
    const hasJestConfig = jestConfigs.some(config => 
      existsSync(path.join(process.cwd(), config))
    );
    
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    let hasJestInPackageJson = false;
    
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      hasJestInPackageJson = !!packageJson.jest;
    }
    
    expect(hasJestConfig || hasJestInPackageJson).toBe(true);
  });

  test('ts-jest is configured for TypeScript support', () => {
    let jestConfig: any = {};
    
    // Try to load Jest config
    const jestConfigPath = path.join(process.cwd(), 'jest.config.cjs');
    if (existsSync(jestConfigPath)) {
      // For CJS config, we need to require it
      delete require.cache[require.resolve(jestConfigPath)];
      jestConfig = require(jestConfigPath);
    }
    
    // Check that ts-jest is configured
    const hasTypeScriptTransform = 
      jestConfig.preset?.includes('ts-jest') ||
      jestConfig.transform?.['\\.(ts|tsx)$']?.includes('ts-jest') ||
      jestConfig.transform?.['^.+\\.(ts|tsx)$']?.includes('ts-jest');
    
    expect(hasTypeScriptTransform).toBe(true);
  });

  test('Unit tests can run in server and shared packages', () => {
    // Check that server package has test files
    const serverTestDir = path.join(process.cwd(), 'packages', 'server', 'src');
    const sharedTestDir = path.join(process.cwd(), 'packages', 'shared', 'src');
    
    let hasServerTests = false;
    let hasSharedTests = false;
    
    if (existsSync(serverTestDir)) {
      try {
        const output = execSync('find . -name "*.test.ts" -o -name "*.spec.ts"', {
          cwd: serverTestDir,
          encoding: 'utf8'
        });
        hasServerTests = output.trim().length > 0;
      } catch (e) {
        // If find command fails, check manually
        hasServerTests = existsSync(path.join(serverTestDir, 'index.test.ts'));
      }
    }
    
    if (existsSync(sharedTestDir)) {
      try {
        const output = execSync('find . -name "*.test.ts" -o -name "*.spec.ts"', {
          cwd: sharedTestDir,
          encoding: 'utf8'
        });
        hasSharedTests = output.trim().length > 0;
      } catch (e) {
        // If find command fails, check manually
        hasSharedTests = existsSync(path.join(sharedTestDir, 'index.test.ts'));
      }
    }
    
    expect(hasServerTests || hasSharedTests).toBe(true);
  });

  test('Playwright configuration exists', () => {
    const playwrightConfigs = [
      'playwright.config.ts',
      'playwright.config.js'
    ];
    
    const hasPlaywrightConfig = playwrightConfigs.some(config => 
      existsSync(path.join(process.cwd(), config))
    );
    
    expect(hasPlaywrightConfig).toBe(true);
  });

  test('E2E test directory exists with app smoke test', () => {
    const e2eTestDir = path.join(process.cwd(), 'tests', 'e2e');
    expect(existsSync(e2eTestDir)).toBe(true);
    
    // Check for app smoke test or similar
    const smokeTestPath = path.join(e2eTestDir, 'app-smoke.spec.ts');
    const hasE2ETests = existsSync(smokeTestPath) || 
      existsSync(path.join(e2eTestDir, 'app.spec.ts')) ||
      existsSync(path.join(e2eTestDir, 'smoke.spec.ts'));
    
    expect(hasE2ETests).toBe(true);
  });

  test('Package.json has test scripts', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts.test).toBeDefined();
    expect(packageJson.scripts.e2e || packageJson.scripts['test:e2e']).toBeDefined();
  });

  test('Jest can run successfully', () => {
    // Run Jest with a simple pattern to avoid long-running tests
    expect(() => {
      execSync('npm test -- --passWithNoTests --testTimeout=10000', { 
        stdio: 'pipe',
        cwd: process.cwd(),
        timeout: 30000
      });
    }).not.toThrow();
  });
});

