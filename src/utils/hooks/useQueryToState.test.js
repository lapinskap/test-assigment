import { paramsToObject } from './useQueryToState';

describe('useQueryToState', () => {
  test('paramsToObject correctly prepare params', async () => {
    const inputData = [
      ['test1', 'value1'],
      ['test2', 'value2'],
    ];
    const result = paramsToObject(inputData);
    expect(result.test1).toBe('value1');
    expect(result.test2).toBe('value2');
  });
  test('paramsToObject correctly prepare date params', async () => {
    const inputData = [
      ['test3[before]', '2020-12-17T13:18:52.893Z'],
      ['test3[after]', '2020-12-17T13:18:52.893Z'],
    ];
    const result = paramsToObject(inputData);
    expect(result.test3.from).toBeInstanceOf(Date);
    expect(result.test3.to).toBeInstanceOf(Date);
  });
  test('paramsToObject correctly prepare date params when only one value is provided', async () => {
    const inputData = [
      ['test3[after]', '2020-12-17T13:18:52.893Z'],
    ];
    const result = paramsToObject(inputData);
    expect(result.test3.from).toBeInstanceOf(Date);
    expect(result.test3.to).toBeUndefined();
  });
});
