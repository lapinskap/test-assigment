import React from 'react';
// import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import IPv4 from './IPv4';
import '../../tests/setupTests';

describe('<IPv4 />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let id; let label; let validation; let isInValid;
  let placeholder; let value; let prefix; let suffix; let validateField; let tooltip; let errorMessage; let
    onChange;

  beforeEach(() => {
    id = 1;
    label = 'test';
    validation = ['required'];
    isInValid = false;
    placeholder = '';
    value = '';
    prefix = '';
    suffix = '';
    validateField = '';
    tooltip = '';
    errorMessage = '';
    onChange = () => ({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    const tree = renderer
      .create(<IPv4
        id={id}
        label={label}
        validation={validation}
        isInValid={isInValid}
        placeholder={placeholder}
        value={value}
        prefix={prefix}
        suffix={suffix}
        validateField={validateField}
        tooltip={tooltip}
        errorMessage={errorMessage}
        onChange={onChange}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly without optional props', () => {
    const tree = renderer
      .create(<IPv4
        onChange={onChange}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
