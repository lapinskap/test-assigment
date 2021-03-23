import UserInfo from './UserInfo';

describe('userInfo', () => {
  it('has all required getters', () => {
    const userInfo = new UserInfo({
      role: 'omb',
      firstName: 'John',
      lastName: 'Admin',
      email: 'test@example.com',
      permissions: ['a', 'b', 'c'],
      relations: { company: 'test' },
      username: 'user',
      companyId: 'test',
    });
    expect(userInfo.getRole()).toBe('omb');
    expect(userInfo.getFirstName()).toBe('John');
    expect(userInfo.getLastName()).toBe('Admin');
    expect(userInfo.getPermissions().length).toBe(3);
    expect(Object.keys(userInfo.getRelations())[0]).toBe('company');
    expect(userInfo.getEmail()).toBe('test@example.com');
    expect(userInfo.getUsername()).toBe('user');
    expect(userInfo.getCompanyId()).toBe('test');
    expect(userInfo.isAhr()).toBe(false);
  });
  it('has default relations and permissions', () => {
    const userInfo = new UserInfo({});
    expect(userInfo.getPermissions().length).toBe(0);
    expect(userInfo.getCompanyId()).toBe(undefined);
  });
  it('isAhr work correctly', () => {
    const userInfo = new UserInfo({ role: 'ahr' });
    expect(userInfo.isAhr()).toBe(true);
  });
  it('check if is correct user', () => {
    const ahr = new UserInfo({ role: 'ahr' });
    expect(ahr.hasAccessToPanel()).toBe(true);
    const omb = new UserInfo({ role: 'omb' });
    expect(omb.hasAccessToPanel()).toBe(true);
    const employee = new UserInfo({ role: 'employee' });
    expect(employee.hasAccessToPanel()).toBe(false);
  });
});
