#!/usr/bin/env node

/**
 * APT System Validation Test
 * 
 * This script validates that our 100 APT system is properly structured
 * by analyzing the TypeScript source files directly.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateAPTSystem() {
  console.log('🤖 APT System Validation Test');
  console.log('=============================');
  console.log('');

  const projectRoot = path.resolve(__dirname, '..');
  const apiDir = path.join(projectRoot, 'src', 'simulation', 'engine', 'orchestration', 'apis');

  try {
    // Check if API directory exists
    if (!fs.existsSync(apiDir)) {
      throw new Error(`API directory not found: ${apiDir}`);
    }

    console.log('📁 Scanning API files...');
    
    // Get all API files
    const apiFiles = fs.readdirSync(apiDir)
      .filter(file => file.endsWith('API.ts'))
      .filter(file => !file.includes('test') && !file.includes('spec'));

    console.log(`Found ${apiFiles.length} API files:`);
    apiFiles.forEach(file => console.log(`  - ${file}`));
    console.log('');

    // Analyze each API file for APT registrations
    let totalAPTs = 0;
    const aptBreakdown = {};

    for (const apiFile of apiFiles) {
      const filePath = path.join(apiDir, apiFile);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Count APT registrations in the file
      const aptMatches = content.match(/this\.registerAPT\(/g) || [];
      const aptCount = aptMatches.length;
      
      totalAPTs += aptCount;
      aptBreakdown[apiFile] = aptCount;
      
      console.log(`📊 ${apiFile}: ${aptCount} APTs`);
    }

    console.log('');
    console.log('🎯 APT System Summary:');
    console.log('======================');
    console.log(`Total APTs Found: ${totalAPTs}`);
    console.log(`Target APTs: 100`);
    console.log(`Achievement: ${Math.round((totalAPTs / 100) * 100)}%`);
    console.log('');

    // Detailed breakdown
    console.log('📈 Detailed APT Breakdown:');
    Object.entries(aptBreakdown).forEach(([file, count]) => {
      const percentage = Math.round((count / totalAPTs) * 100);
      console.log(`  ${file.replace('.ts', '')}: ${count} APTs (${percentage}%)`);
    });

    console.log('');

    // Validate milestone achievement
    if (totalAPTs >= 100) {
      console.log('🏆 100 APT MILESTONE ACHIEVED!');
      console.log(`✨ Exceeded target by ${totalAPTs - 100} APTs`);
    } else {
      console.log(`⚠️  APT target not met: ${100 - totalAPTs} APTs remaining`);
    }

    // Check for APT structure quality
    console.log('');
    console.log('🔍 APT Structure Analysis:');
    
    let structureIssues = 0;
    
    for (const apiFile of apiFiles) {
      const filePath = path.join(apiDir, apiFile);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for required APT fields
      const hasPromptTemplate = content.includes('promptTemplate:');
      const hasCategory = content.includes('category:');
      const hasRequiredVariables = content.includes('requiredVariables:');
      const hasPreferredModel = content.includes('preferredModel:');
      
      if (!hasPromptTemplate || !hasCategory || !hasRequiredVariables || !hasPreferredModel) {
        console.log(`  ⚠️  ${apiFile}: Missing required APT fields`);
        structureIssues++;
      } else {
        console.log(`  ✅ ${apiFile}: APT structure valid`);
      }
    }

    console.log('');
    
    if (structureIssues === 0) {
      console.log('🎉 All APT structures are valid!');
    } else {
      console.log(`⚠️  ${structureIssues} files have APT structure issues`);
    }

    // Check orchestration integration
    console.log('');
    console.log('🔗 Orchestration Integration Check:');
    
    const indexFile = path.join(apiDir, 'index.ts');
    if (fs.existsSync(indexFile)) {
      const indexContent = fs.readFileSync(indexFile, 'utf8');
      const exportedAPIs = apiFiles.filter(file => {
        const apiName = file.replace('.ts', '');
        return indexContent.includes(`export { ${apiName} }`);
      });
      
      console.log(`  📤 Exported APIs: ${exportedAPIs.length}/${apiFiles.length}`);
      
      if (exportedAPIs.length === apiFiles.length) {
        console.log('  ✅ All APIs properly exported');
      } else {
        console.log('  ⚠️  Some APIs not exported in index');
      }
    } else {
      console.log('  ⚠️  No index.ts file found');
    }

    // Final validation
    console.log('');
    console.log('🏁 Final Validation:');
    console.log('===================');
    
    const validationResults = {
      aptCount: totalAPTs >= 100,
      structureValid: structureIssues === 0,
      filesFound: apiFiles.length >= 8,
      integrationReady: fs.existsSync(indexFile)
    };

    const passedValidations = Object.values(validationResults).filter(Boolean).length;
    const totalValidations = Object.keys(validationResults).length;
    
    console.log(`Validations Passed: ${passedValidations}/${totalValidations}`);
    
    Object.entries(validationResults).forEach(([test, passed]) => {
      const status = passed ? '✅' : '❌';
      console.log(`  ${status} ${test.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    });

    console.log('');
    
    if (passedValidations === totalValidations) {
      console.log('🎊 APT SYSTEM VALIDATION SUCCESSFUL!');
      console.log('🚀 System ready for production deployment');
    } else {
      console.log('⚠️  APT system validation incomplete');
      console.log('🔧 Address issues before deployment');
    }

  } catch (error) {
    console.error('❌ APT System Validation Failed:', error.message);
    process.exit(1);
  }
}

// Run the validation
validateAPTSystem().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
