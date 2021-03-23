import mergeDeep from './mergeDeep';

describe('mergeDeep', () => {
  it('merges simple values deep', () => {
    const target = {
      a: {
        b: 1,
      },
    };
    const source = {
      a: {
        c: 2,
      },
    };
    mergeDeep(target, source);

    expect(target.a.b).toEqual(1);
    expect(target.a.c).toEqual(2);
  });
  it('merges flat object', () => {
    const target = {
      a: 1,
    };
    const source = {
      b: 2,
    };
    mergeDeep(target, source);

    expect(target.a).toEqual(1);
    expect(target.b).toEqual(2);
  });
  it('overrides arrays', () => {
    const target = {
      a: {
        array: [1, 1, 1],
      },
    };
    const source = {
      a: {
        array: [2, 2],
      },
    };
    mergeDeep(target, source);

    expect(target.a.array.length).toEqual(2);
  });
  it('merges multiple sources', () => {
    const target = {
      a: {
        b: 1,
      },
    };
    const source1 = {
      a: {
        c: 2,
      },
    };
    const source2 = {
      a: {
        d: 3,
      },
    };
    mergeDeep(target, source1, source2);

    expect(target.a.b).toEqual(1);
    expect(target.a.c).toEqual(2);
    expect(target.a.d).toEqual(3);
  });

  it('merges multiple sources', () => {
    const target = {
      a: {
        b: 1,
      },
    };
    const source1 = {
      a: {
        c: 2,
      },
    };
    const source2 = {
      x: {
        y: 3,
      },
    };
    mergeDeep(target, source1, source2);

    expect(target.a.b).toEqual(1);
    expect(target.a.c).toEqual(2);
    expect(target.x.y).toEqual(3);
  });

  it('skips not valid sources', () => {
    const target = {
      a: {
        b: 1,
      },
    };
    const source1 = {
      a: {
        c: 2,
      },
    };
    const source2 = null;
    mergeDeep(target, source1, source2);

    expect(target.a.b).toEqual(1);
    expect(target.a.c).toEqual(2);
  });
});
