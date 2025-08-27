import request from 'supertest';
// TODO: Update to use main server once trade APIs are integrated
// import app from '../../src/server/index';

describe.skip('Trade & Economy API (MVP) - DISABLED: Demo server removed', () => {
  it('returns prices and updates after adding tariff', async () => {
    const before = await request(app).get('/api/trade/prices').query({ system: 'Vezara' });
    const pAlloy = before.body.alloy;
    await request(app).post('/api/trade/routes').send({ system: 'Vezara', resource: 'alloy', rate: 0.1 });
    const after = await request(app).get('/api/trade/prices').query({ system: 'Vezara' });
    expect(after.body.alloy).toBeGreaterThanOrEqual(pAlloy);
  });

  it('creates a contract and lists it', async () => {
    await request(app).post('/api/trade/contracts').send({ type: 'spot', resource: 'fuel', qty: 5, system: 'Vezara' });
    const list = await request(app).get('/api/trade/contracts');
    expect(Array.isArray(list.body.contracts)).toBe(true);
    expect(list.body.contracts.length).toBeGreaterThan(0);
  });

  it('returns indices', async () => {
    const idx = await request(app).get('/api/trade/indices');
    expect(idx.status).toBe(200);
    expect(idx.body).toHaveProperty('priceIndex');
  });
});

