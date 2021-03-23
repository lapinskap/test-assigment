import { mount } from 'enzyme';
import '../../tests/setupTests';
import React from 'react';
import { deleteSession, initSession } from '../RoleBasedSecurity/Session';
import { getBrowsingHistory, useAddToHistory } from './index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path',
  }),
}));

describe('Session', () => {
  afterEach(() => {
    deleteSession();
    window.localStorage.removeItem('omb_browsing_history_undefined');
  });

  it('return empty history when loclasotrage data is wrong', async () => {
    await initSession();
    window.localStorage.setItem('omb_browsing_history_', '[fdsd');

    const history = getBrowsingHistory();
    expect(Array.isArray(history))
      .toBe(true);
    expect(history.length)
      .toBe(0);
  });

  it('return empty history when loclasotrage data is missing', async () => {
    await initSession();
    const history = getBrowsingHistory();
    expect(Array.isArray(history))
      .toBe(true);
    expect(history.length)
      .toBe(0);
  });

  it('correctly updates history', async () => {
    await initSession();
    window.localStorage.setItem('omb_browsing_history_undefined', JSON.stringify([{
      time: 0,
      path: '/test',
      title: 'Page 1',
    }]));

    const HookTestComponent = () => {
      useAddToHistory('Page 2', null, true);
      return null;
    };

    const wrapper = mount(<HookTestComponent />);
    wrapper.update();

    const history = getBrowsingHistory();
    expect(history.length).toBe(2);
    expect(history[0].title).toBe('Page 2');
    expect(history[1].title).toBe('Page 1');
  });

  it('return empty history when loclasotrage data is missing', async () => {
    await initSession();
    const history = getBrowsingHistory();
    expect(Array.isArray(history))
      .toBe(true);
    expect(history.length)
      .toBe(0);
  });

  it('do not update history when arg canAddToHistory = false', async () => {
    await initSession();
    window.localStorage.setItem('omb_browsing_history_undefined', JSON.stringify([{
      time: 0,
      path: '/test',
      title: 'Page 1',
    }]));

    const HookTestComponent = () => {
      useAddToHistory('Page 2', null, false);
      return null;
    };

    const wrapper = mount(<HookTestComponent />);
    wrapper.update();

    const history = getBrowsingHistory();

    expect(history.length).toBe(1);
    expect(history[0].title).toBe('Page 1');
  });
});
