import express from 'express';
import cors from 'cors';
import { campaignsRouter } from './routes/campaigns';
import { schedulesRouter } from './routes/schedules';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/campaigns', campaignsRouter);
app.use('/api/schedules', schedulesRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));


