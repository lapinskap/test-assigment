import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import AsyncAutocomplete from './AsyncAutocomplete';
import '../../../tests/setupTests';
import { waitToLoadMocks } from '../../../tests/helpers';

describe('<AsyncAutocomplete />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', async () => {
    const wrapper = renderer
      .create(<AsyncAutocomplete
        errorMessage="Pole jest wymagane"
        label="Firma"
        value={['option_3']}
        isMultiselect
        onChange={() => {}}
        id="test_autocomplete"
        fetchOptions={() => [
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

  it('renders correctly loads options', async () => {
    const options = [
      { label: 'Option 1', value: 'option_1' },
      { label: 'Option 2', value: 'option_2' },
      { label: 'Group 1', options: [{ label: 'Option 3', value: 'option_3' }, { label: 'Option 4', value: 'option_4' }] },
    ];

    // eslint-disable-next-line no-unused-vars
    const fetchOptionsSpy = jest.fn((test) => options);

    const wrapper = shallow(<AsyncAutocomplete
      errorMessage="Pole jest wymagane"
      label="Firma"
      onChange={() => {}}
      id="test_autocomplete"
      fetchOptions={fetchOptionsSpy}
      validation={['required']}
      tooltip={<div>Tooltip mock</div>}
      validateField={() => {}}
    />);
    const select = wrapper.find('Async');

    const loadOptionsMethod = select.prop('loadOptions');
    const callbackSpy1 = jest.fn();
    await loadOptionsMethod('test', callbackSpy1);
    expect(fetchOptionsSpy).toHaveBeenCalledWith('test');
    expect(callbackSpy1).toHaveBeenCalledWith(options);

    const callbackSpy2 = jest.fn((result) => {
      expect(Array.isArray(result) && result.length === 0).toBeTruthy();
    });
    await loadOptionsMethod('', callbackSpy2);
    expect(callbackSpy2).toHaveBeenCalled();
  });

  it('stops propagation on key down', () => {
    const stopPropagationSpy = jest.fn();
    const mockEvent = {
      stopPropagation: stopPropagationSpy,
    };
    const wrapper = shallow(<AsyncAutocomplete
      errorMessage="Pole jest wymagane"
      label="Firma"
      onChange={() => {}}
      id="test_autocomplete"
      fetchOptions={() => {}}
      validation={['required']}
      tooltip={<div>Tooltip mock</div>}
      validateField={() => {}}
    />);
    const select = wrapper.find('Async');
    select.prop('onKeyDown')(mockEvent);

    expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
  });

  it('act correctly on focus and blur', async () => {
    const validateSpy = jest.fn();

    const { container } = render(<AsyncAutocomplete
      label="Firma"
      value="option_3"
      onChange={() => {}}
      id="test_autocomplete"
      fetchOptions={() => [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Group 1', options: [{ label: 'Option 3', value: 'option_3' }, { label: 'Option 4', value: 'option_4' }] },
      ]}
      validateField={validateSpy}
    />);
    const input = container.querySelector('input');
    input.focus();
    input.blur();

    await waitToLoadMocks();

    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
  it('do not crash on blur when no validate method', () => {
    const { container } = render(<AsyncAutocomplete
      label="Firma"
      value="option_3"
      onChange={() => {}}
      id="test_autocomplete"
      fetchOptions={() => [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Group 1', options: [{ label: 'Option 3', value: 'option_3' }, { label: 'Option 4', value: 'option_4' }] },
      ]}
    />);
    const input = container.querySelector('input');

    input.focus();
    input.blur();
  });
});
