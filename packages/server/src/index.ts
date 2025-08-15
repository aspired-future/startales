import express from 'express';
import { config as loadEnv } from 'dotenv-safe';

try {
	loadEnv({ allowEmptyValues: true });
} catch {}

const app = express();
const OFFLINE = String(process.env.OFFLINE || 'false').toLowerCase() === 'true';
if (OFFLINE) {
	app.use((_req, _res, next) => {
		// Placeholder: enforce deny-by-default policy in future tasks
		next();
	});
}
app.get('/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
if (process.env.START_SERVER === '1') {
	app.listen(port, () => console.log(`@app/server on http://localhost:${port}`));
}

export default app;

