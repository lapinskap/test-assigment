import { userInfoRequest } from './Session';

describe('authorization', () => {
  it('has userInfo Request', async () => {
    const { role, name } = await userInfoRequest();
    expect(role).toBe('omb');
    expect(name).toBe('jantestowy');
  });
});
