import ApiResponseError from './ApiResponseError';

describe('ApiResponseError', () => {
  it('returns a class stte', async () => {
    const ApiResponseErrorMock = new ApiResponseError('some', 'test', 'value', 'message');

    expect(ApiResponseErrorMock.status).toBe('some');
    expect(ApiResponseErrorMock.url).toBe(undefined);
    expect(ApiResponseErrorMock.error).toBe('value');
    expect(ApiResponseErrorMock.message).toBe('message');
  });
});
