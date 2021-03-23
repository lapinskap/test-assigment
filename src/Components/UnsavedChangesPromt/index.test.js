/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import renderer from 'react-test-renderer';
import UnsavedChangesPrompt from './index';
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

describe('<UnsavedChangesPrompt />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let message = 'Niezapisane zmiany zostaną utracone.';
  let children;

  beforeEach(() => {
    children = <div />;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const tree = renderer
      .create(
        <UnsavedChangesPrompt
          message={message}
        >
          {children}
        </UnsavedChangesPrompt>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with null message', () => {
    message = null;
    const tree = renderer
      .create(
        <UnsavedChangesPrompt
          message={message}
        >
          {children}
        </UnsavedChangesPrompt>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
