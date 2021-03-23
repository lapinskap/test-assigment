import {
  findEmployees,
  findCompanies,
  findMenuItems,
  getResultsFromChildren, findProducts, findTourismObjects,
} from './filters';
import '../../tests/setupTests';
import UserInfo from '../../utils/RoleBasedSecurity/UserInfo';
import { godPermission } from '../../utils/RoleBasedSecurity/permissions';

describe('filters', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('filters with findEmployees', async () => {
    const value = 'jan.kowalski@gmial.com';
    const result = await findEmployees(value);
    expect(result.length).toBe(1);
    expect(result[0].label).toBe('Jan Kowalski (jan.kowalski@gmial.com)');
  });

  it('filters with findCompanies', async () => {
    const value = '10clouds';
    const result = await findCompanies(value);
    expect(result.length).toBe(1);
    expect(result[0].label).toBe('10clouds');
  });

  it('filters with findProducts', async () => {
    const value = 'Bon 50zł do Lidla';
    const result = await findProducts(value);
    expect(result.length).toBe(1);
    expect(result[0].label).toBe('Bon 50zł do Lidla');
  });

  it('filters with findProducts', async () => {
    const value = 'U Róży';
    const result = await findTourismObjects(value);
    expect(result.length).toBe(1);
    expect(result[0].label).toBe('U Róży');
  });

  it('filters with findMenuItems', () => {
    const value = 'List';
    const ctx = { userInfo: new UserInfo({ permissions: [godPermission] }) };
    const result = findMenuItems(value, ctx);
    expect(result.length).toBe(5);
  });

  it('filters with findMenuItems for AHR Context', () => {
    const value = 'Imprezy firmowe';
    const ctx = { userInfo: new UserInfo({ role: 'ahr' }) };
    const result = findMenuItems(value, ctx);
    expect(result.length).toBe(1);
  });

  it('filters with findMenuItems and null value', () => {
    const value = false;
    const ctx = { userInfo: new UserInfo({ permissions: [godPermission] }) };
    const result = findMenuItems(value, ctx);
    expect(result.length).toBe(0);
  });

  it('executes getResultFromChildren correctly', () => {
    const resultHandler = [];
    const items = [];
    const value = 'fasad';
    expect(getResultsFromChildren(items, value, resultHandler)).toStrictEqual([]);
  });

  it('executes getResultFromChildren with props', () => {
    const resultHandler = [];
    const items = [{ to: 'some', label: 'Some', content: [{ to: 'some employees', label: 'None' }] }];
    const value = 'Some';
    const result = getResultsFromChildren(items, value, resultHandler);
    expect(result).toStrictEqual([{ to: 'some', label: 'Some' }]);
  });
});
