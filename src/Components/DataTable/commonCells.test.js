import React from 'react';
import renderer from 'react-test-renderer';
import { mapValueFromOptions } from './commonCells';
import '../../tests/setupTests';

describe('mapValueFromOptions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with single value', () => {
    const options = [
      { value: 'option_1', label: 'Option 1' },
      { value: 'option_2', label: 'Option 2' },
      { value: 'option_3', label: 'Option 3' },
    ];
    const row = { test: 'option_1' };
    const Component = mapValueFromOptions(options, 'test');
    const tree = renderer
      .create(<Component row={row} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with array values', () => {
    const options = [
      { value: 'option_1', label: 'Option 1' },
      { value: 'option_2', label: 'Option 2' },
      { value: 'option_3', label: 'Option 3' },
    ];
    const row = { test: ['option_1', 'option_4'] };
    const Component = mapValueFromOptions(options, 'test');
    const tree = renderer
      .create(<Component row={row} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
