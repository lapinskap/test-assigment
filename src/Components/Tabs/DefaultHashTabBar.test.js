/* eslint-disable function-call-argument-newline */
import React from 'react';
import renderer from 'react-test-renderer';
import DefaultHashTabBar from './DefaultHashTabBar';
import '../../tests/setupTests';
import TestAppContext from '../../tests/TestAppContext';

describe('<DefaultHashTabBar />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let panels; let
    activeKey;

  beforeEach(() => {
    panels = [
      {
        props: {
          disabled: true,
        },
      },
      {
        props: {
          display: false,
        },
      },
    ];
    activeKey = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    const tree = renderer
      .create(
        <TestAppContext router>
          <DefaultHashTabBar activeKey={activeKey} panels={panels} />
        </TestAppContext>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
