import arrayUnique from './arrayUnique';
import '../../tests/setupTests';

describe('arrayUnique', () => {
  it('returns unique array', () => {
    const input = [1, 2, 'a', 3, 2, 1, 'a', 'b'];
    const output = input.filter(arrayUnique);
    expect(output.length).toBe(5);
  });
});
