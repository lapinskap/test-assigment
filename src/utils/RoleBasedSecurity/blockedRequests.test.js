import {
  addBlockedRequest,
  BLOCKED_REQUESTS_STORAGE_KEY,
  isBlockedRequest,
  removeBlockedRequest,
} from './blockedRequests';

describe('blockedRequests', () => {
  beforeEach(() => {
    sessionStorage.removeItem(BLOCKED_REQUESTS_STORAGE_KEY);
  });
  afterEach(() => {
    sessionStorage.removeItem(BLOCKED_REQUESTS_STORAGE_KEY);
  });
  it('add blocked request', () => {
    const testPath = '/test';
    expect(isBlockedRequest(testPath)).toBe(false);
    addBlockedRequest(testPath);
    expect(isBlockedRequest(testPath)).toBe(true);
  });
  it('remove blocked request', () => {
    const testPath = '/test';
    sessionStorage.setItem(BLOCKED_REQUESTS_STORAGE_KEY, '["/test"]');
    expect(isBlockedRequest(testPath)).toBe(true);
    removeBlockedRequest(testPath);
    expect(isBlockedRequest(testPath)).toBe(false);
  });
  it('handle wrong strage data', () => {
    const testPath = '/test';
    sessionStorage.setItem(BLOCKED_REQUESTS_STORAGE_KEY, '{[}');
    expect(isBlockedRequest(testPath)).toBe(false);
  });
});
