import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Autocomplete from './Autocomplete';
import '../../../tests/setupTests';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('<Autocomplete />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', async () => {
    const wrapper = renderer
      .create(<Autocomplete
        errorMessage="Pole jest wymagane"
        label="Firma"
        value={['option_3']}
        isMultiselect
        onChange={() => {}}
        id="test_autocomplete"
        options={[
          { label: 'Option 1', value: 'option_1' },
          { label: 'Option 2', value: 'option_2' },
          { label: 'Group 1', options: [{ label: 'Option 3', value: 'option_3' }, { label: 'Option 4', value: 'option_4' }] },
        ]}
        validation={['required']}
        tooltip={<div>Tooltip mock</div>}
        validateField={() => {}}
      />);
    await waitToLoadMocks();
    expect(wrapper.toJSON())
      .toMatchSnapshot();
  });

  it('act correctly on focus and blur', () => {
    const validateSpy = jest.fn();

    const { container } = render(<Autocomplete
      label="Firma"
      value="option_3"
      onChange={() => {}}
      id="test_autocomplete"
      options={[
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Group 1', options: [{ label: 'Option 3', value: 'option_3' }, { label: 'Option 4', value: 'option_4' }] },
      ]}
      validateField={validateSpy}
    />);
    const input = container.querySelector('input');

    input.focus();
    input.blur();

    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
  it('do not crash on blur when no validate method', () => {
    const { container } = render(<Autocomplete
      label="Firma"
      value="option_3"
      onChange={() => {}}
      id="test_autocomplete"
      options={[
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Group 1', options: [{ label: 'Option 3', value: 'option_3' }, { label: 'Option 4', value: 'option_4' }] },
      ]}
    />);
    const input = container.querySelector('input');

    input.focus();
    input.blur();
  });

  it('stops propagation on key down', () => {
    const stopPropagationSpy = jest.fn();
    const mockEvent = {
      stopPropagation: stopPropagationSpy,
    };
    const wrapper = shallow(<Autocomplete
      errorMessage="Pole jest wymagane"
      label="Firma"
      onChange={() => {}}
      id="test_autocomplete"
      fetchOptions={() => {}}
      validation={['required']}
      tooltip={<div>Tooltip mock</div>}
      validateField={() => {}}
      options={[
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Group 1', options: [{ label: 'Option 3', value: 'option_3' }, { label: 'Option 4', value: 'option_4' }] },
      ]}
    />);
    const select = wrapper.find('StateManager');
    select.prop('onKeyDown')(mockEvent);

    expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
  });
});
