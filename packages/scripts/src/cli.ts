#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function findPackagesRoot(startDir: string): string {
	let dir = startDir;
	for (let i = 0; i < 4; i += 1) {
		const candidate = path.join(dir, 'packages');
		if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) return candidate;
		const parent = path.dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return path.join(startDir, 'packages');
}

export function workspaceGraph(): string[] {
	const pkgsRoot = findPackagesRoot(process.cwd());
	const dirs = fs.existsSync(pkgsRoot) ? fs.readdirSync(pkgsRoot) : [];
	return dirs.filter((d) => fs.existsSync(path.join(pkgsRoot, d, 'package.json')));
}

// Intentionally skip direct-exec branch for test compatibility.


