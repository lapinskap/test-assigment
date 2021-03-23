import React, { useState } from 'react';
import '../../tests/setupTests';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import DataLoading from './dataLoading';
import { waitToLoadMocks } from '../../tests/helpers';
import { initSession, deleteSession } from '../../utils/RoleBasedSecurity/Session';

describe('<DataLoading />', () => {
  const mockEndpoint = '/company/companyData/edit';
  const service = '';

  afterEach(() => {
    window.SKIP_TEST_MODE = false;
    deleteSession();
    jest.clearAllMocks();
  });

  it('renders correctly with mocks', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }));
    const Component = () => {
      const [fetched, setFetched] = useState(false);
      return (
        <DataLoading
          service={service}
          updateData={() => {
            setFetched(true);
          }}
          endpoint={mockEndpoint}
          isMock
          fetchedData={fetched}
          forceLoader={false}
          isNew={false}
          mockDataEndpoint={mockEndpoint}
        >
          <div>Content</div>
        </DataLoading>
      );
    };

    const wrapper = mount(<Component />);
    await waitToLoadMocks();
    wrapper.update();
    expect(EnzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('renders correctly new', async () => {
    const wrapper = mount(
      <DataLoading
        service={service}
        updateData={() => {}}
        endpoint={mockEndpoint}
        isMock
        fetchedData={false}
        isNew
        forceLoader={false}
        mockDataEndpoint={mockEndpoint}
      >
        <div>Content</div>
      </DataLoading>,
    );
    wrapper.update();
    expect(EnzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('renders correctly whith 500 error fetch', async () => {
    window.SKIP_TEST_MODE = true;
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }));
    initSession();
    const updateDataSpy = jest.fn();
    const wrapper = mount(
      <DataLoading
        service={service}
        updateData={updateDataSpy}
        endpoint={mockEndpoint}
        fetchedData={false}
        forceLoader={false}
        isNew={false}
      >
        <div>Content</div>
      </DataLoading>,
    );
    wrapper.update();
    expect(EnzymeToJson(wrapper)).toMatchSnapshot();
    expect(updateDataSpy).toHaveBeenCalledTimes(0);
  });

  it('renders correctly whith 403 error fetch', async () => {
    window.SKIP_TEST_MODE = true;
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      status: 403,
      json: () => Promise.resolve({}),
    }));
    initSession();
    const updateDataSpy = jest.fn();
    const wrapper = mount(
      <DataLoading
        service={service}
        updateData={updateDataSpy}
        endpoint={mockEndpoint}
        fetchedData={false}
        forceLoader={false}
        isNew={false}
      >
        <div>Content</div>
      </DataLoading>,
    );
    wrapper.update();
    expect(EnzymeToJson(wrapper)).toMatchSnapshot();
    expect(updateDataSpy).toHaveBeenCalledTimes(0);
  });
});
