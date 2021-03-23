import React from 'react';
import renderer from 'react-test-renderer';
import Legend from './Legend';
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

describe('<Legend />', () => {
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
    const legend = [
      'id_test - test value 1',
      'id_test - test value 2',
      'id_test - test value 3',
    ];
    const tree = renderer
      .create(<Legend
        legend={legend}
        title={title}
        validateForm={validateForm}
      />, { createNodeMock })
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });

  it('renders correctly with valid legend', () => {
    const legend = [
      'id_test - test value 1',
      'id_test - test value 2',
      'id_test - test value 3',
    ];
    const tree = renderer
      .create(<Legend
        legend={legend}
        title={title}
        stickyTitle
        validateForm={validateForm}
      />, { createNodeMock })
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });
});
