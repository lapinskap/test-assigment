import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Multiselect from './Multiselect';
import '../../tests/setupTests';

describe('<Multiselect />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    const wrapper = renderer
      .create(<Multiselect
        id="idmultiselect"
        label="Multiselect field"
        validation={['required']}
        value={[4]}
        prefix="Random prefix"
        suffix="Random prefix"
        validateField={() => {
        }}
        tooltip={<div>Tooltip</div>}
        invalid
        errorMessage="This field i required"
        onChange={() => {
        }}
        options={[{ value: 1 }, { value: 2 }]}
      />);

    expect(wrapper.toJSON())
      .toMatchSnapshot();
  });

  it('renders correctly without optional props', () => {
    const wrapper = renderer
      .create(<Multiselect
        onChange={() => {
        }}
        value={null}
        afterLabel={<div>test after label</div>}
        options={[{
          value: 1,
          label: 'Option 1',
        }, {
          value: 2,
          label: 'Option 2',
        }]}
      />);

    expect(wrapper.toJSON())
      .toMatchSnapshot();
  });

  it('it validate on blur', () => {
    const clickEvent = { target: { value: [1] } };
    const validateField = jest.fn((id, inputValue, validation) => {
      expect(id).toBe('test');
      expect(inputValue.length).toBe(1);
      expect(validation).toBe('required');
    });
    const wrapper = shallow(<Multiselect
      id="test"
      onChange={() => {
      }}
      value={null}
      validation="required"
      afterLabel={<div>test after label</div>}
      validateField={validateField}
      options={[{
        value: 1,
        label: 'Option 1',
      }, {
        value: 2,
        label: 'Option 2',
      }]}
    />);
    wrapper.find('Input').at(0).prop('onBlur')(clickEvent);
    expect(validateField).toHaveBeenCalledTimes(1);
  });
});
