import React from 'react';
import { mount, shallow } from 'enzyme';
import renderer, { act } from 'react-test-renderer';
import Report, { generateFakeReportData } from './index';
import '../../tests/setupTests';

describe('<Report />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let companyDataFetch;
  let title;
  let submitMethod;
  let resultConfig;
  const formGroups = [];
  const
    groupsAsColumns = true;

  beforeEach(() => {
    companyDataFetch = () => [];
    title = 'Testowy Raport';
    submitMethod = () => [];
    resultConfig = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const tree = renderer
      .create(<Report
        isCompanyDepended={false}
        companyDataFetch={companyDataFetch}
        title={title}
        submitMethod={submitMethod}
        resultConfig={resultConfig}
        formGroups={formGroups}
        groupsAsColumns={groupsAsColumns}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with Company depended', () => {
    const tree = renderer
      .create(<Report
        isCompanyDepended
        companyDataFetch={companyDataFetch}
        title={title}
        submitMethod={submitMethod}
        resultConfig={resultConfig}
        formGroups={formGroups}
        groupsAsColumns={groupsAsColumns}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should have correct behavior on all buttons', async () => {
    const wrapper = mount(<Report
      isCompanyDepended
      companyDataFetch={companyDataFetch}
      title={title}
      submitMethod={submitMethod}
      resultConfig={resultConfig}
      formGroups={formGroups}
      groupsAsColumns={groupsAsColumns}
    />);

    const generateButton = wrapper.find('button').at(1);
    expect(generateButton.text()).toBe('Generuj');
    await act(async () => {
      await generateButton.simulate('click');
    });
    let resultWrapper = wrapper.find('Result');
    expect(resultWrapper.props().isOpen).toBeTruthy();
    act(() => {
      resultWrapper.prop('close')();
    });
    wrapper.update();
    const clearButton = wrapper.find('Button').at(0);
    act(() => {
      clearButton.simulate('click');
    });
    resultWrapper = wrapper.find('Result');
    expect(resultWrapper.length).toBe(0);
  });

  it('should selectCompany method work', async () => {
    const companyDataFetchMock = jest.fn();
    const wrapper = shallow(<Report
      isCompanyDepended
      companyDataFetch={companyDataFetchMock}
      title={title}
      submitMethod={submitMethod}
      resultConfig={resultConfig}
      formGroups={formGroups}
      groupsAsColumns={groupsAsColumns}
    />);
    await wrapper.find('FormElement').prop('onChange')('company', '1');
    expect(wrapper.find('FormElement').props().value).toBe('1');
    expect(companyDataFetchMock).toHaveBeenCalled();
  });

  it('should onChange method work', async () => {
    const wrapper = shallow(<Report
      companyDataFetch={companyDataFetch}
      title={title}
      submitMethod={submitMethod}
      resultConfig={resultConfig}
      formGroups={[
        {
          formElements: [
            {
              label: 'Test',
              id: 'test',
            },
          ],
        },
      ]}
      groupsAsColumns={groupsAsColumns}
    />);
    act(() => {
      wrapper.find('FormComponent').prop('config').defaultOnChange('test', 'test value');
    });
    expect(wrapper.find('FormComponent').prop('data').test).toBe('test value');
  });

  it('should generate fake report data', async () => {
    const fakeData = await generateFakeReportData([{ accessor: 'test_1' }, { accessor: 'test_2' }]);
    expect(fakeData.length).toBeGreaterThan(0);
    expect(fakeData[0]).toHaveProperty('test_1');
    expect(fakeData[0]).toHaveProperty('test_2');
  });
});
