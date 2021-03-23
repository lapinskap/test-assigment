/* eslint-disable function-call-argument-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import renderer from 'react-test-renderer';
import SimpleTabs from './SimpleTabs';
import '../../tests/setupTests';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    location: {
      hash: 'test',
    },
  }),
  Prompt: ({ message }) => <div>{message}</div>,
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));

describe('<SimpleTabs />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let tabsConfig = []; let activeKey; let defaultActiveKey; const animated = false; const
    destroyInactiveTabPane = true;

  beforeEach(() => {
    tabsConfig = [
      {
        key: '20',
        name: 'test',
        icon: 's-glyph-5',
      },
    ];
    activeKey = 'test';
    defaultActiveKey = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    const tree = renderer
      .create(<SimpleTabs
        activeKey={activeKey}
        tabsConfig={tabsConfig}
        defaultActiveKey={defaultActiveKey}
        animated={animated}
        destroyInactiveTabPane={destroyInactiveTabPane}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
