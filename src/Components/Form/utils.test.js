import { getActualValidation } from './utils';

describe('getActualValidation', () => {
  it('returns correct validation data', () => {
    const result = getActualValidation(['required'], 'text');
    expect(result).toEqual(['required', { args: [255], method: 'maxLength' }]);
  });

  it('returns empty array', () => {
    const result = getActualValidation([], 'wysiwyg');
    expect(result).toEqual([]);
  });
});
