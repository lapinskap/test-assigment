import hashInputId from './hashInputId';

describe('hashInputId', () => {
  it('returns null string', () => {
    const id = 'test';
    const output = hashInputId(id);
    expect(output).toBe(id);
  });
  it('returns string', () => {
    const id = 'test';
    const output = hashInputId(id, false);
    expect(output).not.toBe(id);
  });
});
