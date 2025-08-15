import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

describe('TC002: Workspace graph contains expected packages', () => {
  test('pnpm workspace list shows expected packages', () => {
    const output = execSync('pnpm -r list --depth=0', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    // Check that expected workspace packages are listed
    const expectedPackages = ['server', 'shared', 'ui_frontend', 'scripts', 'content'];
    expectedPackages.forEach(pkg => {
      expect(output).toContain(pkg);
    });
  });

  test('Each workspace has correct package.json structure', () => {
    const workspaces = [
      { name: 'server', expectedName: '@app/server' },
      { name: 'shared', expectedName: '@app/shared' },
      { name: 'ui_frontend', expectedName: '@app/ui_frontend' },
      { name: 'scripts', expectedName: '@app/scripts' },
      { name: 'content', expectedName: '@app/content' }
    ];

    workspaces.forEach(({ name, expectedName }) => {
      const packageJsonPath = path.join(process.cwd(), 'packages', name, 'package.json');
      
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        
        expect(packageJson.name).toBe(expectedName);
        expect(packageJson.private).toBe(true);
        expect(packageJson.scripts).toBeDefined();
        expect(packageJson.scripts.build).toBeDefined();
      }
    });
  });

  test('Root package.json has correct workspace configuration', () => {
    const rootPackageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(rootPackageJsonPath, 'utf8'));
    
    expect(packageJson.private).toBe(true);
    expect(packageJson.workspaces).toBeDefined();
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts.dev).toBeDefined();
    expect(packageJson.scripts.test).toBeDefined();
  });

  test('pnpm-workspace.yaml exists and is configured correctly', () => {
    const workspaceConfigPath = path.join(process.cwd(), 'pnpm-workspace.yaml');
    expect(existsSync(workspaceConfigPath)).toBe(true);
    
    const workspaceConfig = readFileSync(workspaceConfigPath, 'utf8');
    expect(workspaceConfig).toContain('packages/*');
  });
});

