import { act } from 'react-test-renderer';
import {
  isMockView, setIsMockView, restApiRequest, downloadFile, uploadFile,
} from './index';
import { initSession } from '../RoleBasedSecurity/Session';
import ApiResponseError from './ApiResponseError';
import { setLanguage } from '../Languages/LanguageContext';
import ApiForbiddenError from './ApiForbiddenError';

describe('API', () => {
  afterEach(() => {
    window.SKIP_TEST_MODE = false;
    jest.clearAllMocks();
  });

  it('executes isMockView', async () => {
    await act(async () => {
      await expect(await isMockView())
        .toBe(true);
    });
  });

  it('executes setIsMockView', async () => {
    await act(async () => {
      await setIsMockView(true);
      await expect(isMockView())
        .toBe(true);
    });
  });

  it('executes mock restApiRequest inMockView', async () => {
    const result = await restApiRequest(
      'RANDOM_SERVICE',
      '/test',
      'GET',
      {},
      { message: 'This is mock data' },
    );
    expect(result.message)
      .toEqual('This is mock data');
  });

  it('executes fetch in not MockView', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        urlPath,
        options,
      }),
    }));

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    const {
      urlPath: url,
      options: opt,
    } = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'GET',
      {},
      {},
    );
    expect(url)
      .toEqual('/test');
    expect(opt.method)
      .toEqual('GET');
    expect(opt.headers.accept)
      .toEqual('application/json');
    expect(opt.headers.authorization)
      .toEqual('Bearer ');
  });

  it('executes different method types', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        urlPath,
        options,
      }),
    }));
    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;

    // POST
    const {
      options: optPost,
    } = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'POST',
      {},
      {},
    );
    expect(optPost.headers['content-type'])
      .toEqual('application/json');
    expect(optPost.method)
      .toEqual('POST');

    // PUT
    const {
      options: optPut,
    } = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'PUT',
      {},
      {},
    );
    expect(optPut.headers['content-type'])
      .toEqual('application/json');
    expect(optPut.method)
      .toEqual('PUT');

    // DELETE
    const {
      options: optDelete,
    } = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'DELETE',
      {},
      {},
    );
    expect(optDelete.headers['content-type'])
      .toEqual('application/json');
    expect(optDelete.method)
      .toEqual('DELETE');

    // DELETE WITH RETURN NULL
    const result = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'DELETE',
      { returnNull: true },
      {},
    );
    expect(result)
      .toEqual(null);

    // PATCH
    const {
      options: optPatch,
    } = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'PATCH',
      {},
      {},
    );
    expect(optPatch.headers['content-type'])
      .toEqual('application/merge-patch+json');
    expect(optPatch.method)
      .toEqual('PATCH');
  });

  it('generates params in query', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        urlPath,
        options,
      }),
    }));

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    const {
      urlPath: url,
    } = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'GET',
      {
        params: {
          param1: 'test',
          param2: 'test2',
          param3: [1, 2],
        },
      },
      {},
    );

    expect(url)
      .toEqual('/test?param1=test&param2=test2&param3%5B%5D=1&param3%5B%5D=2');
  });

  it('join array params with joinArray flag', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        urlPath,
        options,
      }),
    }));

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    const {
      urlPath: url,
    } = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'GET',
      {
        params: {
          param1: 'test',
          param2: 'test2',
          param3: [1, 2],
        },
        joinArray: true,
      },
      {},
    );

    expect(url)
      .toEqual('/test?param1=test&param2=test2&param3=1,2');
  });

  it('correctly passed headers and body', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        urlPath,
        options,
      }),
    }));

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    const {
      options: opt,
    } = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'POST',
      {
        headers: {
          'content-type': 'random-content',
          'random-header': 'random-value',
        },
        body: {
          param1: 'test',
        },
      },
      {},
    );

    expect(opt.headers['content-type'])
      .toEqual('random-content');

    expect(opt.headers['random-header'])
      .toEqual('random-value');

    expect(opt.body)
      .toEqual('{"param1":"test"}');
  });

  it('correctly set content language header for default language', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        urlPath,
        options,
      }),
    }));

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    const {
      options: opt,
    } = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'POST',
      {
        headers: {
          'content-type': 'random-content',
          'random-header': 'random-value',
        },
        body: {
          param1: 'test',
        },
      },
      {},
    );

    expect(opt.headers['content-language'])
      .toEqual('pl');
  });

  it('correctly set content language header for selected language', async () => {
    setLanguage('en');
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        urlPath,
        options,
      }),
    }));

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    const {
      options: opt,
    } = await restApiRequest(
      'TEST_SERVICE',
      '/test',
      'POST',
      {
        headers: {
          'content-type': 'random-content',
          'random-header': 'random-value',
        },
        body: {
          param1: 'test',
        },
      },
      {},
    );

    expect(opt.headers['content-language'])
      .toEqual('en');
  });

  it('correctly return exception when failed', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
      status: 501,
      message: 'Error message',
    }));

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;
    try {
      await restApiRequest(
        'TEST_SERVICE',
        '/test',
        'GET',
        {},
        {},
      );
    } catch (error) {
      expect(error instanceof ApiResponseError)
        .toBeTruthy();
    }
  });

  it('do not make infinitive loop when 401 status code', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      status: 401,
      json: () => Promise.resolve({

      }),
    }));
    const blockedPath = '/test';

    initSession();
    await setIsMockView(false);
    window.SKIP_TEST_MODE = true;

    const response1 = await restApiRequest(
      'TEST_SERVICE',
      blockedPath,
      'GET',
      {},
    );

    expect(response1)
      .toEqual(null);

    try {
      await restApiRequest(
        'TEST_SERVICE',
        blockedPath,
        'GET',
        {},
      );
    } catch (error) {
      expect(error instanceof ApiForbiddenError)
        .toBeTruthy();
    }
  });

  test('download method', async () => {
    const blobSpy = jest.fn();
    const createObjectURLSpy = jest.fn();
    const fetchSpy = jest.fn((path, options) => {
      expect(options.headers.authorization.startsWith('Bearer ')).toBe(true);
      return Promise.resolve({
        ok: true,
        blob: blobSpy,
      });
    });
    global.fetch = fetchSpy;
    global.window.URL = {
      createObjectURL: createObjectURLSpy,
    };

    initSession();
    await downloadFile(
      'TEST_SERVICE',
      '/test',
      'testFile',
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(blobSpy).toHaveBeenCalledTimes(1);
  });
});

describe('uploadFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('executes fetch', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        urlPath,
        options,
      }),
    }));
    const file = {};

    initSession();
    const {
      urlPath: url,
      options: opt,
    } = await uploadFile(
      'TEST_SERVICE',
      '/test',
      file,
    );
    expect(url)
      .toEqual('/test');
    expect(opt.method)
      .toEqual('POST');
    expect(opt.headers.authorization)
      .toEqual('Bearer ');
  });

  it('executes different method types', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        urlPath,
        options,
      }),
    }));
    const file = {};

    initSession();
    const {
      options: opt,
    } = await uploadFile(
      'TEST_SERVICE',
      '/test',
      file,
      {},
      null,
      'PATCH',
    );
    expect(opt.method)
      .toEqual('PATCH');
  });

  it('correctly passed headers', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        urlPath,
        options,
      }),
    }));
    const file = {};

    initSession();
    const {
      options: opt,
    } = await uploadFile(
      'TEST_SERVICE',
      '/test',
      file,
      {
        'content-type': 'random-content',
        'random-header': 'random-value',
      },
    );
    expect(opt.headers['content-type'])
      .toEqual('random-content');
    expect(opt.headers['random-header'])
      .toEqual('random-value');
    expect(opt.headers.authorization)
      .toEqual('Bearer ');
  });

  it('correctly return exception when failed', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
      status: 501,
      message: 'Error message',
    }));

    initSession();
    try {
      await uploadFile(
        'TEST_SERVICE',
        '/test',
        {},
      );
    } catch (error) {
      expect(error instanceof ApiResponseError)
        .toBeTruthy();
    }
  });

  it('correctly accept valid exception', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }));
    const file = { name: 'sample.pdf' };
    initSession();
    const throwErrorSpy = jest.fn();
    try {
      await uploadFile(
        'TEST_SERVICE',
        '/test',
        file,
        {},
        ['pdf'],
      );
    } catch (error) {
      throwErrorSpy();
    }
    expect(throwErrorSpy).toHaveBeenCalledTimes(0);
  });

  it('correctly throw error on invalid exception', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }));
    const file = { name: 'sample.pdf' };
    initSession();

    const throwErrorSpy = jest.fn();
    try {
      await uploadFile(
        'TEST_SERVICE',
        '/test',
        file,
        {},
        ['png', 'gif'],
      );
    } catch (error) {
      throwErrorSpy();
    }
    expect(throwErrorSpy).toHaveBeenCalledTimes(1);
  });
});
