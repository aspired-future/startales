#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Quick action themes mapping
const QUICK_ACTION_THEMES = {
  'SystemStatusScreen': 'technology-theme',
  'CrisisResponseScreen': 'security-theme', 
  'DailyBriefingScreen': 'government-theme',
  'AddressNationScreen': 'social-theme',
  'EmergencyPowersScreen': 'government-theme'
};

// Standard design conversions
const CONVERSIONS = [
  // Add StandardDesign import
  {
    pattern: /import React.*from 'react';\s*import { QuickActionBase, QuickActionProps } from '\.\/QuickActionBase';/g,
    replacement: `import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';
import '../shared/StandardDesign.css';`
  },
  
  // Convert old metric grids to standard design
  {
    pattern: /className="metrics-grid"/g,
    replacement: 'className="standard-metric-grid"'
  },
  
  // Convert metric items to standard metrics
  {
    pattern: /<div className="metric-item">\s*<div className="metric-value"([^>]*)>([^<]*)<\/div>\s*<div className="metric-label">([^<]*)<\/div>\s*<\/div>/g,
    replacement: `<div className="standard-metric">
            <span>$3</span>
            <span className="standard-metric-value"$1>$2</span>
          </div>`
  },
  
  // Convert section headers to standard cards
  {
    pattern: /<div style=\{\{ marginBottom: '[^']*' \}\}>\s*<h3 style=\{\{ color: '[^']*', marginBottom: '[^']*' \}\}>([^<]*)<\/h3>/g,
    replacement: `<div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">$1</h3>`
  },
  
  // Convert old colors to new theme colors
  {
    pattern: /#4ecdc4/g,
    replacement: 'var(--accent-color)'
  },
  {
    pattern: /#28a745/g,
    replacement: '#10b981'
  },
  {
    pattern: /#dc3545/g,
    replacement: '#ef4444'
  },
  {
    pattern: /#ffc107/g,
    replacement: '#f59e0b'
  }
];

function convertQuickActionFile(filePath) {
  console.log(`Converting ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.tsx');
  
  // Get theme for this quick action
  const theme = QUICK_ACTION_THEMES[fileName] || 'government-theme';
  
  // Apply all conversions
  CONVERSIONS.forEach(conversion => {
    content = content.replace(conversion.pattern, conversion.replacement);
  });
  
  // Update QuickActionBase className to use theme
  content = content.replace(
    /className="[^"]*"/g, 
    `className="${theme}"`
  );
  
  // Ensure proper card structure
  if (!content.includes('standard-card')) {
    // Wrap main content in standard card if not already done
    content = content.replace(
      /(<QuickActionBase[^>]*>)\s*([\s\S]*?)\s*(<\/QuickActionBase>)/,
      `$1
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        $2
      </div>
      $3`
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Converted ${fileName}`);
}

function main() {
  const quickActionsDir = 'src/ui_frontend/components/GameHUD/screens/quickactions';
  
  if (!fs.existsSync(quickActionsDir)) {
    console.error('Quick actions directory not found!');
    process.exit(1);
  }
  
  const files = fs.readdirSync(quickActionsDir)
    .filter(file => file.endsWith('.tsx') && file !== 'QuickActionBase.tsx')
    .map(file => path.join(quickActionsDir, file));
  
  console.log(`Found ${files.length} quick action files to convert:`);
  files.forEach(file => console.log(`  - ${path.basename(file)}`));
  
  files.forEach(convertQuickActionFile);
  
  console.log('\n🎉 All quick actions converted to new design system!');
}

if (require.main === module) {
  main();
}

module.exports = { convertQuickActionFile, QUICK_ACTION_THEMES, CONVERSIONS };
