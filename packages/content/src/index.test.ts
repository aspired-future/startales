import { listPacks } from './index';

test('lists at least one content pack', () => {
  const packs = listPacks();
  expect(Array.isArray(packs)).toBe(true);
  expect(packs.length).toBeGreaterThanOrEqual(1);
});


