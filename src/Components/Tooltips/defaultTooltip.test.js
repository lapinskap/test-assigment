import React from 'react';
import renderer from 'react-test-renderer';
import DefaultTooltip from './defaultTooltip';
import '../../tests/setupTests';

describe('<DefaultTooltip />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let type; let content; const placement = 'auto'; let
    id;

  beforeEach(() => {
    type = 'info';
    content = [];
    id = 'TooltipDemo';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const div = document.createElement('div');
    div.setAttribute('id', 'TooltipDemo');
    document.body.appendChild(div);

    const tree = renderer
      .create(
        <DefaultTooltip
          type={type}
          content={content}
          placement={placement}
          id={id}
        />, div,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with props 2', () => {
    const div = document.createElement('div');
    div.setAttribute('id', 'TooltipDemo');
    document.body.appendChild(div);

    const tree = renderer
      .create(
        <DefaultTooltip
          type="legacy"
          content={content}
          placement={placement}
          id={id}
        />, div,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
