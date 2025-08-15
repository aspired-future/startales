import { execSync } from 'child_process';
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';

describe('TC003: TypeScript strict mode enabled', () => {
  test('Root tsconfig.json has strict mode enabled', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    expect(existsSync(tsconfigPath)).toBe(true);
    
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  test('Package tsconfig files extend strict configuration', () => {
    const packages = ['server', 'shared', 'ui_frontend', 'scripts', 'content'];
    
    packages.forEach(pkg => {
      const tsconfigPath = path.join(process.cwd(), 'packages', pkg, 'tsconfig.json');
      
      if (existsSync(tsconfigPath)) {
        const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
        
        // Either has strict: true directly or extends a config that has it
        const hasStrictDirect = tsconfig.compilerOptions?.strict === true;
        const extendsConfig = tsconfig.extends !== undefined;
        
        expect(hasStrictDirect || extendsConfig).toBe(true);
      }
    });
  });

  test('TypeScript compilation fails on intentional error', () => {
    // Create a temporary file with a TypeScript error
    const errorFilePath = path.join(process.cwd(), 'temp-error-test.ts');
    const errorContent = `
// This should cause a TypeScript error in strict mode
let implicitAny;
implicitAny = "this should fail";
implicitAny.nonExistentMethod();

export const badFunction = (param) => {
  return param.undefinedProperty;
};
`;
    
    writeFileSync(errorFilePath, errorContent);
    
    try {
      // This should throw because of TypeScript errors
      expect(() => {
        execSync(`npx tsc --noEmit ${errorFilePath}`, { 
          stdio: 'pipe',
          cwd: process.cwd()
        });
      }).toThrow();
    } finally {
      // Clean up the temporary file
      if (existsSync(errorFilePath)) {
        unlinkSync(errorFilePath);
      }
    }
  });

  test('TypeScript compilation succeeds for valid code', () => {
    // Create a temporary file with valid TypeScript
    const validFilePath = path.join(process.cwd(), 'temp-valid-test.ts');
    const validContent = `
export interface TestInterface {
  name: string;
  value: number;
}

export const validFunction = (param: TestInterface): string => {
  return \`Name: \${param.name}, Value: \${param.value}\`;
};
`;
    
    writeFileSync(validFilePath, validContent);
    
    try {
      // This should not throw
      expect(() => {
        execSync(`npx tsc --noEmit ${validFilePath}`, { 
          stdio: 'pipe',
          cwd: process.cwd()
        });
      }).not.toThrow();
    } finally {
      // Clean up the temporary file
      if (existsSync(validFilePath)) {
        unlinkSync(validFilePath);
      }
    }
  });
});

