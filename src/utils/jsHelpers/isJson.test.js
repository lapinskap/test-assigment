import isJson from './isJson';

describe('isJson', () => {
  it('properly return true for valid json', () => {
    expect(isJson('{"from":1,"to":2}')).toBeTruthy();
  });
  it('properly return false for invalid json', () => {
    expect(isJson('{"from":1 "to":2}')).toBeFalsy();
  });
  it('properly return false for plain string', () => {
    expect(isJson('test')).toBeFalsy();
  });
});
