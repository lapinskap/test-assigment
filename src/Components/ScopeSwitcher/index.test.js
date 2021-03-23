import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import '../../tests/setupTests';
import { waitToLoadMocks } from '../../tests/helpers';
import ScopeSwitcher from './index';

describe('<ScopeSwitcher />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with minimum props', async () => {
    const wrapper = renderer
      .create(<ScopeSwitcher
        changeScope={() => {}}
        scope={{}}
      />);
    await waitToLoadMocks();
    expect(wrapper.toJSON())
      .toMatchSnapshot();
  });
  it('renders correctly with skipped company props', async () => {
    const wrapper = renderer
      .create(<ScopeSwitcher
        changeScope={() => {}}
        scope={{ companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021' }}
        skipCompany
      />);
    await waitToLoadMocks();
    expect(wrapper.toJSON())
      .toMatchSnapshot();
  });

  it('correctly change company id', async () => {
    const onChangeSpy = jest.fn();

    const wrapper = shallow(<ScopeSwitcher
      changeScope={onChangeSpy}
      scope={{
        companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
        employeeGroupId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
      }}
    />);
    const companySelect = wrapper.find('AsyncAutocomplete');

    const changeCompany = companySelect.prop('onChange');

    changeCompany({ value: 'a43275e4-eeb2-11ea-adc1-0242ac1200021' });
    expect(onChangeSpy).toHaveBeenCalledTimes(0);

    changeCompany({ value: '1' });
    expect(onChangeSpy).toHaveBeenLastCalledWith('1', 'a43275e4-eeb2-11ea-adc1-0242ac1200021');
    changeCompany(null);
    expect(onChangeSpy).toHaveBeenLastCalledWith(null, null);
  });

  it('correctly change employee group id', async () => {
    const onChangeSpy = jest.fn();

    const wrapper = shallow(<ScopeSwitcher
      changeScope={onChangeSpy}
      scope={{
        companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
        employeeGroupId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021',
      }}
    />);
    const employeeGroupSelectSelect = wrapper.find('Autocomplete');

    const changeEmployeeGroup = employeeGroupSelectSelect.prop('onChange');

    changeEmployeeGroup({ value: 'a43275e4-eeb2-11ea-adc1-0242ac1200021' });
    expect(onChangeSpy).toHaveBeenCalledTimes(0);

    changeEmployeeGroup({ value: '1' });
    expect(onChangeSpy).toHaveBeenLastCalledWith('a43275e4-eeb2-11ea-adc1-0242ac1200021', '1');
    changeEmployeeGroup(null);
    expect(onChangeSpy).toHaveBeenLastCalledWith('a43275e4-eeb2-11ea-adc1-0242ac1200021', null);
  });
});
