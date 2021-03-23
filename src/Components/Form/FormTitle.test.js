import React from 'react';
// import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FormTitle from './FormTitle';
import '../../tests/setupTests';

function createNodeMock() {
  return {
    getBoundingClientRect() {
      return {
        width: 100,
      };
    },
  };
}

describe('<FormTitle />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);
  let title;
  let validateForm;

  beforeEach(() => {
    title = 'Test title';
    validateForm = () => {
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    const buttons = [
      <button type="submit">Button 1</button>,
      <button type="button">Button 2</button>,
      <button type="button">Button 3</button>,
    ];
    const tree = renderer
      .create(<FormTitle
        buttons={buttons}
        title={title}
        validateForm={validateForm}
      />, { createNodeMock })
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });

  // it('Should capture title correctly onChange', () => {
  //   const formTitle = shallow(<FormTitle
  //     buttons={buttons}
  //     title={title}
  //     stickyTitle
  //     validateForm={validateForm}
  //   />).find('.card-header-title');
  //   formTitle.value = 'Test';
  //   formTitle.simulate('change');
  //   expect(setState).toHaveBeenCalledWith('Test');
  // });

  it('renders correctly with valid buttons', () => {
    const buttons = [
      <button type="submit">Button 1</button>,
      <button type="button">Button 2</button>,
      <button type="button">Button 3</button>,
    ];
    const tree = renderer
      .create(<FormTitle
        buttons={buttons}
        title={title}
        stickyTitle
        validateForm={validateForm}
      />, { createNodeMock })
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });
});
