#!/usr/bin/env node
// Minimal secret scan: flags common key-like patterns in staged files.
import { execSync } from 'node:child_process';
import fs from 'node:fs';

function getStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return out.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

const patterns = [
  /(?i)api[_-]?key\s*[:=]\s*['\"][A-Za-z0-9_\-]{16,}['\"]/,
  /(?i)secret\s*[:=]\s*['\"][A-Za-z0-9_\-]{16,}['\"]/,
  /(?:sk|rk)_[A-Za-z0-9]{20,}/,
];

const flagged = [];
for (const file of getStagedFiles()) {
  if (!fs.existsSync(file)) continue;
  if (/^(dist|coverage|playwright-report|node_modules)\//.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const re of patterns) {
    if (re.test(text)) {
      flagged.push({ file, pattern: re.toString() });
      break;
    }
  }
}

if (flagged.length) {
  console.warn('[secret-scan] Potential secrets detected in staged files:');
  for (const f of flagged) console.warn(` - ${f.file} (${f.pattern})`);
  process.exitCode = 1;
}


