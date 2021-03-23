import arrayMove from './arrayMove';

describe('arrayMove', () => {
  it('properly moved to the front of array when new index is less than 0', () => {
    expect(arrayMove([1, 2, 3], 1, -2)).toEqual([2, 1, 3]);
  });

  it('properly move forward', () => {
    expect(arrayMove([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
  });

  it('properly moved to the end of array when new index is bigger than array length', () => {
    expect(arrayMove([1, 2, 3], 0, 3)).toEqual([2, 3, 1]);
  });

  it('properly move backwards', () => {
    expect(arrayMove([1, 2, 3], 2, 0)).toEqual([3, 1, 2]);
  });

  it('do not change anything when old index is undefined', () => {
    expect(arrayMove([1, 2, 3], 3, 1)).toEqual([1, 2, 3]);
  });
});
