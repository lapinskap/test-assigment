import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';

import { mount } from 'enzyme';
import DataTable from './index';
import TestAppContext from '../../tests/TestAppContext';
import { ExportContext } from '../DataTableControlled/exportButton';
import '../../tests/setupTests';
import { waitToLoadMocks } from '../../tests/helpers';

let columns;
let data;
let filterable;
let defaultPageSize;
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
  buttons = [
    { text: '+ Add company' },
    {
      text: 'Homepage',
      href: '/',
    },
  ];
  getTrProps = () => ({});
});

describe('<DataTable />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('Data table main snapshot', () => {
    const tree = renderer
      .create(
        <DataTable
          columns={columns}
          data={[]}
          filterable={filterable}
          defaultPageSize={defaultPageSize}
          getTrProps={getTrProps}
        />,
      )
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });
  test('Data table snapshot with additional props', () => {
    const exportContext = new ExportContext({
      service: 'test',
      path: 'test-path',
      fileName: 'test',
      permission: 'test',
    });

    const tree = renderer
      .create(
        <TestAppContext router>
          <DataTable
            exportContext={exportContext}
            columns={columns}
            data={data}
            noCards
            filterable={filterable}
            showPagination={false}
            defaultPageSize={defaultPageSize}
            getTrProps={getTrProps}
            buttons={buttons}
            rowId="companyId"
            massActions={[
              { label: 'Usuń', id: 'delete', action: () => {} },
            ]}
          />
          ,
        </TestAppContext>,
      )
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });

  it('Should page change work correctly', async () => {
    const { container } = render((
      <TestAppContext router>
        <DataTable
          columns={columns}
          data={data}
          filterable={false}
          defaultPageSize={3}
          buttons={buttons}
          getTrProps={getTrProps}
        />
      </TestAppContext>
    ));
    expect(container.querySelector('input').value).toBe('1');
    const nextButton = screen.getByText('Następna');
    fireEvent.click(nextButton);
    expect(container.querySelector('input').value).toBe('2');
    const previousButton = screen.getByText('Poprzednia');
    fireEvent.click(previousButton);
    expect(container.querySelector('input').value).toBe('1');
  });

  it('Should page change work correctly', async () => {
    const wrapper = mount((
      <TestAppContext router>
        <DataTable
          columns={columns}
          data={data}
          filterable={filterable}
          defaultPageSize={3}
          buttons={buttons}
          getTrProps={getTrProps}
        />
      </TestAppContext>
    ));
    await waitToLoadMocks();
    wrapper.update();
    expect(wrapper.find('Pagination').prop('page')).toBe(1);
    const nextButton = wrapper.find('button').at(2);
    await act(() => {
      nextButton.simulate('click');
    });
    expect(wrapper.find('Pagination').prop('page')).toBe(2);
  });

  it('Should change page size correctly', async () => {
    const { container } = render((
      <TestAppContext router>
        <DataTable
          columns={columns}
          data={data}
          filterable={false}
          defaultPageSize={40}
          buttons={buttons}
          getTrProps={getTrProps}
        />
      </TestAppContext>
    ));
    const pageSizeSelect = container.querySelector('select');
    expect(pageSizeSelect.value).toBe('40');
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });
    expect(pageSizeSelect.value).toBe('20');
  });
});
