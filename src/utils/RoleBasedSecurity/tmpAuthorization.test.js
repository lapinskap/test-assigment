import tmpAuthorization from './tmpAuthorization';
import { isMockView } from '../Api';

describe('tmp login methods', () => {
  beforeEach(() => {
    window.SKIP_TEST_MODE = true;
  });
  afterEach(() => {
    window.SKIP_TEST_MODE = false;
  });
  it('login as ahr', () => {
    const { userInfo } = tmpAuthorization('ahr');
    const {
      firstName, lastName, companyId, role, email,
    } = userInfo;
    expect(role).toBe('ahr');
    expect(firstName).toBe('dev');
    expect(lastName).toBe('ahr mocks');
    expect(email).toBeTruthy();
    expect(companyId).toBe('a43275e4-eeb2-11ea-adc1-0242ac1200021');
    expect(isMockView()).toBe(true);
  });
  it('login as admin mock', () => {
    const { userInfo } = tmpAuthorization('omb');
    const {
      companyId, role,
    } = userInfo;
    expect(role).toBe('omb');
    expect(companyId).toBe(0);
    expect(isMockView()).toBe(true);
  });
  it('login as admin mock', () => {
    const { userInfo } = tmpAuthorization('adminahr');
    const {
      companyId, role,
    } = userInfo;
    expect(role).toBe('ahr');
    expect(companyId).not.toBe(0);
    expect(isMockView()).toBe(false);
  });
  it('return false on no tmp data', () => {
    const result = tmpAuthorization('test');
    expect(result).toBe(false);
  });
});
