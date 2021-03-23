import capitalize from './capitalize';

describe('capitalize', () => {
  test('word', () => {
    expect(capitalize('mybenefit')).toBe('Mybenefit');
  });
  it('sentence', () => {
    expect(capitalize('mybenefit login')).toBe('Mybenefit login');
  });
  it('number', () => {
    expect(capitalize(0)).toBe('');
  });
  it('object', () => {
    expect(capitalize({})).toBe('');
  });
});
