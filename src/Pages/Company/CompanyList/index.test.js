import React from 'react';
import { act, create } from 'react-test-renderer';
import CompanyList from './index';
import '../../../tests/setupTests';
import TestAppContext from '../../../tests/TestAppContext';
import { waitToLoadMocks } from '../../../tests/helpers';

jest.mock('react-transition-group', () => ({
  ...jest.requireActual('react-transition-group'),
  // eslint-disable-next-line react/prop-types
  CSSTransitionGroup: ({ children }) => <div>{children}</div>,
}));

describe('<CompanyList />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render correct in default state', async () => {
    let tree = null;
    await act(async () => {
      tree = create(
        <TestAppContext redux router>
          <CompanyList />
        </TestAppContext>,
      );
    });
    await waitToLoadMocks();

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
