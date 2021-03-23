import {
  filterNavItemsByAlc, filterTabsByAcl, hasAccessTo,
} from './filters';
import UserInfo from './UserInfo';
import { godPermission } from './permissions';

describe('filters', () => {
  it('filters with filterNavItemsByAlc', () => {
    const userInfo = new UserInfo({ permissions: ['test_1', 'test_2', 'test_sub_2'] });
    const tabsConfig = [
      { aclKey: 'test_1' },
      { aclKey: 'test_2', content: [{ aclKey: 'test_sub_1' }, { aclKey: 'test_sub_2' }] },
      { aclKey: 'test_3' },
    ];
    const result = filterNavItemsByAlc(tabsConfig, userInfo);
    expect(result.length).toBe(2);
    expect(result[0].aclKey).toBe('test_1');
    expect(result[1].aclKey).toBe('test_2'); expect(result[1].content.length).toBe(1);
    expect(result[1].content[0].aclKey).toBe('test_sub_2');
  });
  it('filters with filterNavItemsByAlc  for acl admin', () => {
    const userInfo = new UserInfo({ permissions: [godPermission] });

    const tabsConfig = [
      { aclKey: 'test_1' },
      { aclKey: 'test_2', content: [{ aclKey: 'test_sub_1' }, { aclKey: 'test_sub_2' }] },
      { aclKey: 'test_3' },
    ];
    const result = filterNavItemsByAlc(tabsConfig, userInfo);
    expect(result.length).toBe(3);
    expect(result[0].aclKey).toBe('test_1');
    expect(result[1].aclKey).toBe('test_2'); expect(result[1].content.length).toBe(2);
    expect(result[1].content[1].aclKey).toBe('test_sub_2');
  }); it('filters with filterTabsByAcl', () => {
    const userInfo = new UserInfo({ permissions: ['test_1', 'test_2'] });
    const tabsConfig = [{ aclKey: 'test_1' }, { aclKey: 'test_2' }, { aclKey: 'test_3' }];
    const result = filterTabsByAcl(tabsConfig, userInfo);
    expect(result.length).toBe(3);
    expect(result[2].aclKey).toBe('test_3');
    expect(result[2].disabled).toBe(true);
    expect(result[2].component).not.toBe(true);
    expect(result[2].tabClassName).toBe('not-allowed');
    expect(result[2].tabTitle).not.toBe(true);
  }); it('filters with filterTabsByAcl for acl admin', () => {
    const userInfo = new UserInfo({ permissions: [godPermission] });

    const tabsConfig = [{ aclKey: 'test_1' }, { aclKey: 'test_2' }, { aclKey: 'test_3' }];
    const result = filterTabsByAcl(tabsConfig, userInfo);
    expect(result.length).toBe(3);
    expect(result[0].aclKey).toBe('test_1');
    expect(result[2].aclKey).toBe('test_3');
  }); it('filters with hasAccessTo', () => {
    const userInfo = new UserInfo({ permissions: ['test_1'] });
    const field = ['some_menu'];
    expect(hasAccessTo(userInfo, field)).toBe(false);
  });
});
