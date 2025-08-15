#!/usr/bin/env node
import { spawn } from 'node:child_process';
import http from 'node:http';

function run(cmd, args, env, cwd) {
    const p = spawn(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env }, cwd: cwd || process.cwd() });
	p.on('exit', (code) => {
		if (code !== 0) process.exitCode = code ?? 1;
	});
	return p;
}

function waitFor(url, timeoutMs = 30000) {
	const start = Date.now();
	return new Promise((resolve, reject) => {
		(function probe() {
			const req = http.get(url, (res) => {
				res.resume();
				resolve(true);
			});
			req.on('error', () => {
				if (Date.now() - start > timeoutMs) return reject(new Error('timeout'));
				setTimeout(probe, 500);
			});
		})();
	});
}

// Start server and UI
const server = run('npx', ['tsx', 'packages/server/src/index.ts'], { START_SERVER: '1', PORT: '4000' });
const ui = run('npx', ['vite', '--port', '5173', '--strictPort'], {}, 'packages/ui_frontend');

await Promise.all([
	waitFor('http://localhost:4000/health').catch(() => process.exit(1)),
	waitFor('http://localhost:5173').catch(() => process.exit(1))
]);

console.log('dev-serve ready on http://localhost:4000 and http://localhost:5173');

// Keep running until one process exits
await new Promise((resolve) => {
	server.on('exit', resolve);
	ui.on('exit', resolve);
});

