import sortAlphabetically from './sortAlphabetically';
import '../../tests/setupTests';

describe('sortAlphabetically', () => {
  it('returns unique array', () => {
    const input = ['BItem', 'aItem', 'CItem', 'AItem'];
    const output = input.sort(sortAlphabetically);
    expect(output[0]).toBe('aItem');
    expect(output[1]).toBe('AItem');
    expect(output[2]).toBe('BItem');
    expect(output[3]).toBe('CItem');
  });
});
