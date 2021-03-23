import React, { useContext } from 'react';
import { mount } from 'enzyme';
import renderer, { act } from 'react-test-renderer';
import EnzymeToJson from 'enzyme-to-json/index';
import RbsAppWrapper from './RbsAppWrapper';
import '../../tests/setupTests';
import RbsContext from './RbsContext';
import {
  clearSessionData, deleteSession, SESSION_STORAGE_KEY, USER_INFO_STORAGE_KEY,
} from './Session';
import { waitToLoadMocks } from '../../tests/helpers';

describe('<RbsAppWrapper />', () => {
  afterEach(() => {
    jest.clearAllMocks();
    clearSessionData();
    deleteSession();
  });
  it('renders correctly with children when logged', async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
      token: 'asds',
      date: Date.now(),
      expires_in: 3600,
    }));

    const wrapper = mount((
      <RbsAppWrapper>
        <div>1234</div>
      </RbsAppWrapper>
    ));
    wrapper.update();
    expect(EnzymeToJson(wrapper))
      .toMatchSnapshot();
  });
  it('renders correctly with wrong user info json', async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
      token: 'asds',
      date: Date.now(),
      expires_in: 3600,
    }));
    sessionStorage.setItem(USER_INFO_STORAGE_KEY, '{"k[]');
    const wrapper = mount((
      <RbsAppWrapper>
        <div>1234</div>
      </RbsAppWrapper>
    ));
    wrapper.update();
    expect(EnzymeToJson(wrapper))
      .toMatchSnapshot();
  });
  it('renders correctly with children when not logged', async () => {
    const tree = renderer
      .create((
        <RbsAppWrapper>
          <div>1234</div>
        </RbsAppWrapper>
      ))
      .toJSON();
    await waitToLoadMocks();
    expect(tree)
      .toMatchSnapshot();
  });
  it('should login and logout method work', async () => {
    const Content = () => {
      const { login, logout } = useContext(RbsContext);
      return (
        <div>
          <button type="button" onClick={() => login('admin', 'admin')}>Login</button>
          <button type="button" onClick={() => logout()}>Logout</button>
        </div>
      );
    };
    let wrapper;
    await act(() => {
      wrapper = mount((
        <RbsAppWrapper>
          <Content />
        </RbsAppWrapper>
      ));
    });
    wrapper.update();
    await act(() => {
      wrapper.find('button')
        .at(0)
        .prop('onClick')();
    });
    wrapper.update();
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).not.toBe(null);

    await act(() => {
      wrapper.find('button')
        .at(1)
        .prop('onClick')();
    });
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBe(null);
  });
});
