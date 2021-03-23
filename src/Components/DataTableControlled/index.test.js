import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { mount } from 'enzyme';
import DataTableControlled, { getListingData } from './index';
import '../../tests/setupTests';
import TestAppContext from '../../tests/TestAppContext';
import { initSession } from '../../utils/RoleBasedSecurity/Session';
import { waitToLoadMocks } from '../../tests/helpers';
import { ExportContext } from './exportButton';

let columns;
let data;
let filterable;
let defaultPageSize;
let fetchData;
let count;
let buttons;
let getTrProps;

beforeEach(() => {
  columns = [
    {
      Header: 'ID',
      accessor: 'companyId',
    },
    {
      Header: 'Nazwa skrócona',
      accessor: 'shortName',
    },
    {
      Header: 'Ulica',
      accessor: 'street',
    },
    {
      Header: 'Miasto',
      accessor: 'city',
    },
    {
      Header: 'Branża',
      accessor: 'industry',
    },
    {
      Header: 'Liczba pracowników',
      accessor: 'employee_number',
    },
    {
      Header: 'Akcja',
      accessor: 'action',
      filterable: false,
    },
  ];
  data = [{
    companyId: '1',
    shortName: '10clouds',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employee_number: 86,
  }, {
    companyId: '2',
    shortName: 'PKO BP',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employee_number: 58,
  }, {
    companyId: '3',
    shortName: 'Janex',
    street: 'Kościuszki',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employee_number: 83,
  }, {
    companyId: '4',
    shortName: '3m',
    street: 'Niepodległości',
    city: 'Łódź',
    industry: 'AUTOMOTIVE',
    employee_number: 24,
  }, {
    companyId: '5',
    shortName: 'AECOM',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'Branża 2',
    employee_number: 37,
  }, {
    companyId: '6',
    shortName: 'Allegro',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employee_number: 5,
  }, {
    companyId: '7',
    shortName: 'Alior bank',
    street: 'Poznańska',
    city: 'Wrocław',
    industry: 'Branża 2',
    employee_number: 11,
  }, {
    companyId: '8',
    shortName: 'Castorama',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employee_number: 98,
  }, {
    companyId: '9',
    shortName: 'Polfarmex',
    street: 'Warszawska',
    city: 'Wrocław',
    industry: 'AUTOMOTIVE',
    employee_number: 36,
  }, {
    companyId: '10',
    shortName: 'Cemex',
    street: 'Długa',
    city: 'Białystok',
    industry: 'AUTOMOTIVE',
    employee_number: 34,
  }];
  filterable = true;
  defaultPageSize = 20;
  fetchData = () => {
  };
  count = 10;
  buttons = [
    { text: '+ Add company' },
    {
      text: 'Homepage',
      href: '/',
    },
  ];
  getTrProps = () => ({});
});

describe('<DataTableControlled />', () => {
  afterEach(() => {
    window.SKIP_TEST_MODE = false;
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const exportContext = new ExportContext({
      service: 'test',
      path: 'test-path',
      fileName: 'test',
      permission: 'test',
    });
    const tree = renderer
      .create((
        <TestAppContext router>
          <DataTableControlled
            exportContext={exportContext}
            columns={columns}
            data={data}
            filterable={filterable}
            defaultPageSize={defaultPageSize}
            additionalFilters={[
              {
                type: 'text',
                id: 'additional_filter',
                label: 'Additional filter',
              },
            ]}
            fetchData={fetchData}
            count={count}
            getTrProps={getTrProps}
            rowId="companyId"
            massActions={[
              { label: 'Usuń', id: 'delete', action: () => {} },
            ]}
          />
        </TestAppContext>
      ))
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });

  it('Should render buttons correctly', async () => {
    const wrapper = mount((
      <TestAppContext router>
        <DataTableControlled
          columns={columns}
          data={data}
          filterable={filterable}
          defaultPageSize={defaultPageSize}
          fetchData={fetchData}
          count={count}
          buttons={buttons}
          getTrProps={getTrProps}
        />
      </TestAppContext>
    ));
    expect(wrapper.find('Button')
      .at(0)
      .children()
      .text())
      .toBe('+ Add company');
  });

  it('Should page change work correctly', async () => {
    const wrapper = mount((
      <TestAppContext router>
        <DataTableControlled
          columns={columns}
          data={data}
          filterable={filterable}
          defaultPageSize={3}
          fetchData={fetchData}
          count={count}
          buttons={buttons}
          getTrProps={getTrProps}
        />
      </TestAppContext>
    ));
    await waitToLoadMocks();
    wrapper.update();
    expect(wrapper.find('Pagination').prop('page')).toBe(1);
    const nextButton = wrapper.find('button').at(4);
    await act(() => {
      nextButton.simulate('click');
    });
    expect(wrapper.find('Pagination').prop('page')).toBe(2);
  });

  it('Should change page size correctly', async () => {
    const wrapper = mount((
      <TestAppContext router>
        <DataTableControlled
          columns={columns}
          data={data}
          filterable={filterable}
          defaultPageSize={3}
          fetchData={fetchData}
          count={count}
          buttons={buttons}
          getTrProps={getTrProps}
        />
      </TestAppContext>
    ));
    await waitToLoadMocks();
    await act(() => {
      const nextButton = wrapper.find('button').at(4);
      nextButton.simulate('click');
    });
    wrapper.update();
    await act(() => {
      wrapper.find('Pagination').prop('onPageSizeChange')(20);
    });
    wrapper.update();
    expect(wrapper.find('Pagination').prop('pageSize')).toBe(20);
    expect(wrapper.find('Pagination').prop('page')).toBe(1);
  });

  it('Should change sort state correctly', async () => {
    const wrapper = mount((
      <TestAppContext router>
        <DataTableControlled
          columns={columns}
          data={data}
          filterable={filterable}
          defaultPageSize={3}
          fetchData={fetchData}
          count={count}
          buttons={buttons}
          getTrProps={getTrProps}
        />
      </TestAppContext>
    ));
    await waitToLoadMocks();
    await act(() => {
      const nextButton = wrapper.find('button').at(4);
      nextButton.simulate('click');
    });
    wrapper.update();
    await act(() => {
      wrapper.find('ReactTable').prop('onSortedChange')([{ id: 'test', desc: true }]);
    });
    wrapper.update();
    expect(wrapper.find('ReactTable').prop('sorted')[0].id).toBe('test');
    expect(wrapper.find('ReactTable').prop('sorted')[0].desc).toBeTruthy();
    expect(wrapper.find('ReactTable').prop('sorted').length).toBe(1);
    await act(() => {
      wrapper.find('ReactTable').prop('onSortedChange')([{ id: 'test_2', desc: false }]);
    });
    wrapper.update();
    expect(wrapper.find('ReactTable').prop('sorted')[0].id).toBe('test_2');
    expect(wrapper.find('ReactTable').prop('sorted')[0].desc).not.toBeTruthy();
    expect(wrapper.find('ReactTable').prop('sorted').length).toBe(1);
    await act(() => {
      wrapper.find('ReactTable').prop('onSortedChange')();
    });
    wrapper.update();
    expect(wrapper.find('ReactTable').prop('sorted').length).toBe(0);
    expect(wrapper.find('Pagination').prop('page')).toBe(1);
  });

  it('Should change nothing when loading', async () => {
    const wrapper = mount((
      <TestAppContext router>
        <DataTableControlled
          columns={columns}
          data={data}
          filterable={filterable}
          defaultPageSize={defaultPageSize}
          fetchData={fetchData}
          count={count}
        />
      </TestAppContext>
    ));
    // Here we skip waitToLoadMock so all functions should be blocked, and no props should change
    await act(() => {
      wrapper.find('ReactTable').prop('onSortedChange')([{ id: 'test', desc: true }]);

      wrapper.find('ReactTable').prop('onFilteredChange')([{ key: 'test', value: 3 }]);
      const filterButton = wrapper.find('button').at(0);
      filterButton.simulate('click');

      const resetFiltersButton = wrapper.find('button').at(1);
      resetFiltersButton.simulate('click');

      wrapper.find('Pagination').prop('onPageSizeChange')(10);

      wrapper.find('Pagination').prop('onPageChange')(2);

      // default functions:
      wrapper.find('ReactTable').prop('NoDataComponent')();
      wrapper.find('ReactTable').prop('defaultFilterMethod')();
      wrapper.find('ReactTable').prop('getTrProps')();
    });
    wrapper.update();

    expect(wrapper.find('ReactTable').prop('sorted').length).toBe(0);
    expect(wrapper.find('Pagination').prop('page')).toBe(1);
    expect(+wrapper.find('Pagination').prop('pageSize')).toBe(+defaultPageSize);
    expect(wrapper.find('ReactTable').prop('filtered').length).toBe(0);
  });

  it('Should filter data correctly', async () => {
    const wrapper = mount((
      <TestAppContext router>
        <DataTableControlled
          columns={columns}
          data={data}
          filterable={filterable}
          defaultPageSize={3}
          fetchData={fetchData}
          count={count}
          getTrProps={getTrProps}
        />
      </TestAppContext>
    ));
    await waitToLoadMocks();
    await act(() => {
      const nextButton = wrapper.find('button').at(3);
      nextButton.simulate('click');
    });
    wrapper.update();
    await act(() => {
      wrapper.find('ReactTable').prop('onFilteredChange')([{ key: 'test', value: 3 }]);
    });
    wrapper.update();
    expect(wrapper.find('ReactTable').prop('filtered')[0].key).toBe('test');
    expect(wrapper.find('ReactTable').prop('filtered')[0].value).toBe(3);
    expect(wrapper.find('ReactTable').prop('filtered').length).toBe(1);

    await act(() => {
      const filterButton = wrapper.find('button').at(0);
      filterButton.simulate('click');
    });
    wrapper.update();
    expect(wrapper.find('ReactTable').prop('sorted').length).toBe(0);

    await act(() => {
      const resetFiltersButton = wrapper.find('button').at(1);
      resetFiltersButton.simulate('click');
    });
    wrapper.update();
    expect(wrapper.find('ReactTable').prop('filtered').length).toBe(0);
  });

  test('getListingData method correct both for mock request', async () => {
    const mockResult = await getListingData(
      'TEST_LISTING', '', null, 1, 10, null, {}, [{ test: 'test_value' }],
    );
    expect(mockResult.count)
      .toBe(1);
    expect(mockResult.data[0].test)
      .toBe('test_value');
  });

  test('getListingData method correct both for real request', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        'hydra:member': [{ test: 'test_value' }],
        'hydra:totalItems': 1,
      }),
    }));
    await initSession();
    window.SKIP_TEST_MODE = true;
    const mockResult = await getListingData(
      'TEST_LISTING', '', [{ id: 'name', value: 'test' }], 1, 10, {}, { params: {}, headers: {}, method: 'POST' }, [{ test: 'test_value' }],
    );
    expect(mockResult.count)
      .toBe(1);
    expect(mockResult.data[0].test)
      .toBe('test_value');
  });

  test('getListingData method correct pass date filters', async () => {
    const from = new Date('2020-12-17T13:18:52.893Z');
    const to = new Date('2021-12-17T13:19:52.893Z');
    global.fetch = jest.fn((path) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        'hydra:member': [{ test: path }],
        'hydra:totalItems': 1,
      }),
    }));
    await initSession();
    window.SKIP_TEST_MODE = true;
    const mockResult = await getListingData(
      'TEST_LISTING', '/test', [{ id: 'dateRange', value: { from, to } }], 1, 10, null, {
        dateFilters: ['dateRange'], params: {}, headers: {}, method: 'POST',
      }, [{ test: 'test_value' }],
    );
    expect(mockResult.data[0].test).toBe(
      '/test?itemsPerPage=10&page=1&dateRange%5Bafter%5D=2020-12-17T13:18:52.893Z&dateRange%5Bbefore%5D=2021-12-17T13:19:52.893Z',
    );
  });

  test('getListingData method correct return empty array on error for real request', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({
      }),
      status: 500,
    }));
    await initSession();
    window.SKIP_TEST_MODE = true;
    const mockResult = await getListingData(
      'TEST_LISTING', '', null, 1, 10,
    );
    expect(mockResult.count)
      .toBe(0);
  });
});
