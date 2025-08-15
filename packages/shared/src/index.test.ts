import { describe, it, expect } from '@jest/globals';
import { createCrdtDoc } from './index';
import type { MessageEnvelope } from './index';

describe('shared types', () => {
  it('MessageEnvelope shape compiles', () => {
    const msg: MessageEnvelope = { id: '1', channel: 'demo', createdAt: Date.now(), payload: {} };
    expect(msg.channel).toBe('demo');
  });
  it('CRDT stub applies patch', () => {
    const doc = createCrdtDoc({ a: 1, b: 2 });
    expect(doc.get().a).toBe(1);
    doc.apply({ a: 5 });
    expect(doc.get().a).toBe(5);
  });
});

