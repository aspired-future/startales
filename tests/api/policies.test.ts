import request from 'supertest';
import app from '../../src/demo/index';

describe('Policies and Advisors API (MVP)', () => {
  it('creates a policy and returns suggestions', async () => {
    const res = await request(app)
      .post('/api/policies')
      .send({ title: 'Boost Research', body: 'Increase research funding by 10%', scope: 'campaign' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('suggestions');
  });

  it('activates modifiers from suggestions', async () => {
    const created = await request(app)
      .post('/api/policies')
      .send({ title: 'Production Push', body: 'Increase production output', scope: 'campaign' });
    const suggestions = created.body.suggestions || {};
    const mods = Object.keys(suggestions).map(k => ({ key: k, value: Number(suggestions[k]) }));
    const res = await request(app).post('/api/policies/activate').send({ modifiers: mods });
    expect(res.status).toBe(200);
    const active = await request(app).get('/api/policies/active');
    expect(active.body.modifiers.length).toBeGreaterThan(0);
  });

  it('advisor query returns recommendations', async () => {
    const res = await request(app).post('/api/advisors/economy/query').send({ question: 'How to grow GDP?' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.recommendations)).toBe(true);
  });
});

