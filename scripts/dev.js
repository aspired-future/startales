#!/usr/bin/env node
import { spawn } from 'node:child_process';

function run(cmd, args, opts = {}){
	const p = spawn(cmd, args, { stdio: 'inherit', shell: false, ...opts });
	p.on('exit', (code) => process.exitCode = code ?? 0);
	return p;
}

// Placeholder: in future will run server and UI concurrently
run('npx', ['tsx', 'src/demo/index.ts'], { env: { ...process.env, DEMO_START: '1', PORT: process.env.PORT || '4011' } });

