/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable function-call-argument-newline */
import React from 'react';
import renderer from 'react-test-renderer';
import TabsWithMemory from './TabsWithMemory';
import '../../tests/setupTests';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    location: {
      hash: '#test',
    },
  }),
  Prompt: ({ message }) => <div>{message}</div>,
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));

describe('<TabsWithMemory />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let tabsConfig = []; let activeKey; let defaultActiveKey; const animated = false; const
    promptWhenUnsaved = true;

  beforeEach(() => {
    tabsConfig = [
      {
        key: '1',
        name: 'test',
        component: '<Tabs />',
        icon: 's-glyph-5',
        disabled: false,
      },
      {
        key: '2',
        name: 'test2',
        component: '<Tabs />',
        icon: 's-glyph-5',
        display: false,
      },
    ];
    activeKey = '';
    defaultActiveKey = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    const tree = renderer
      .create(<TabsWithMemory
        tabsConfig={tabsConfig}
        activeKey={activeKey}
        defaultActiveKey={defaultActiveKey}
        promptWhenUnsaved={promptWhenUnsaved}
        animated={animated}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
