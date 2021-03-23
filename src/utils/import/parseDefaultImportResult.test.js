import parseDefaultImportResult from './parseDefaultImportResult';

describe('parseDefaultImportResult', () => {
  test('return proper data', async () => {
    const input = {
      'execute:errorLines': ['error', 'error2'],
      'execute:processed': 1,
      'execute:totalLines': 3,
    };

    const {
      totalLines, processed, errors,
    } = parseDefaultImportResult(input);

    expect(totalLines).toBe(3);
    expect(processed).toBe(1);
    expect(errors.length).toBe(2);
  });
  test('return success flag with true value correctly', async () => {
    const input = {
      'execute:errorLines': [],
      'execute:processed': 1,
      'execute:totalLines': 3,
    };
    const { success } = parseDefaultImportResult(input);
    expect(success).toBe(true);
  });
  test('return success flag with true value correctly', async () => {
    const input = {
      'execute:errorLines': ['error', 'error2'],
      'execute:processed': 1,
      'execute:totalLines': 3,
    };
    const { success } = parseDefaultImportResult(input);
    expect(success).toBe(false);
  });
  test('return default values', async () => {
    const input = {};

    const {
      totalLines, processed, errors, success,
    } = parseDefaultImportResult(input);

    expect(totalLines).toBe(0);
    expect(processed).toBe(0);
    expect(success).toBe(true);
    expect(errors.length).toBe(0);
  });
});
