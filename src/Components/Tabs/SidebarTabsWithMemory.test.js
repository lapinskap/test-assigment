/* eslint-disable function-call-argument-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import renderer from 'react-test-renderer';
import SidebarTabsWithMemory from './SidebarTabsWithMemory';
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

describe('<SidebarTabsWithMemory />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  function createNodeMock() {
    return {
      getBoundingClientRect() {
        return {
          width: 100,
        };
      },
    };
  }

  let tabsConfig; let defaultKey; const promptWhenUnsaved = true; let
    collectiveSaveAction;

  beforeEach(() => {
    tabsConfig = [
      {
        key: '20',
        name: 'test',
        icon: 's-glyph-5',
      },
    ];
    defaultKey = '';
    collectiveSaveAction = () => ({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    const tree = renderer
      .create(<SidebarTabsWithMemory
        tabsConfig={tabsConfig}
        defaultKey={defaultKey}
        promptWhenUnsaved={promptWhenUnsaved}
        collectiveSaveAction={collectiveSaveAction}
      />, { createNodeMock })
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
