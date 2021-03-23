import { fileToBase64 } from './fileToBase64';

describe('fileToBase64', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('filters with fileToBase64', async () => {
    const blob = new Blob(['testing'], { type: 'application/pdf' });
    const result = await fileToBase64(blob);
    expect(result.length).toBe(40);
    expect(result).not.toBe(['testing'], { type: 'application/pdf' });
  });
});
