import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

describe('TC004: ESLint + Prettier configured with hooks', () => {
  test('ESLint configuration exists and is valid', () => {
    const eslintConfigs = [
      '.eslintrc.js',
      '.eslintrc.cjs', 
      '.eslintrc.json',
      'eslint.config.js',
      'eslint.config.cjs'
    ];
    
    const hasEslintConfig = eslintConfigs.some(config => 
      existsSync(path.join(process.cwd(), config))
    );
    
    expect(hasEslintConfig).toBe(true);
    
    // Test that ESLint can run without errors on its config
    expect(() => {
      execSync('npx eslint --print-config package.json', { 
        stdio: 'pipe',
        cwd: process.cwd()
      });
    }).not.toThrow();
  });

  test('Prettier configuration exists', () => {
    const prettierConfigs = [
      '.prettierrc',
      '.prettierrc.json',
      '.prettierrc.js',
      '.prettierrc.cjs',
      'prettier.config.js'
    ];
    
    const hasPrettierConfig = prettierConfigs.some(config => 
      existsSync(path.join(process.cwd(), config))
    );
    
    expect(hasPrettierConfig).toBe(true);
  });

  test('lint-staged configuration exists', () => {
    const lintStagedConfigs = [
      '.lintstagedrc',
      '.lintstagedrc.json',
      '.lintstagedrc.js'
    ];
    
    const hasLintStagedConfig = lintStagedConfigs.some(config => 
      existsSync(path.join(process.cwd(), config))
    );
    
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    let hasLintStagedInPackageJson = false;
    
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      hasLintStagedInPackageJson = !!packageJson['lint-staged'];
    }
    
    expect(hasLintStagedConfig || hasLintStagedInPackageJson).toBe(true);
  });

  test('commitlint configuration exists', () => {
    const commitlintConfigs = [
      'commitlint.config.js',
      'commitlint.config.cjs',
      '.commitlintrc.js',
      '.commitlintrc.json'
    ];
    
    const hasCommitlintConfig = commitlintConfigs.some(config => 
      existsSync(path.join(process.cwd(), config))
    );
    
    expect(hasCommitlintConfig).toBe(true);
  });

  test('Husky pre-commit hook exists', () => {
    const preCommitHookPath = path.join(process.cwd(), '.husky', 'pre-commit');
    expect(existsSync(preCommitHookPath)).toBe(true);
    
    if (existsSync(preCommitHookPath)) {
      const hookContent = readFileSync(preCommitHookPath, 'utf8');
      expect(hookContent).toContain('lint-staged');
    }
  });

  test('Package.json has required scripts', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts.lint).toBeDefined();
    expect(packageJson.scripts.format).toBeDefined();
    expect(packageJson.scripts.prepare).toBeDefined();
  });

  test('Lint command runs successfully on existing code', () => {
    expect(() => {
      execSync('npm run lint', { 
        stdio: 'pipe',
        cwd: process.cwd(),
        timeout: 30000
      });
    }).not.toThrow();
  });
});

