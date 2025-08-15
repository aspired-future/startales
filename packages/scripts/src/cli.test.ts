import { workspaceGraph } from './cli';

test('workspaceGraph lists workspaces', () => {
  const list = workspaceGraph();
  expect(Array.isArray(list)).toBe(true);
});


