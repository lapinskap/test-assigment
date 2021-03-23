import React from 'react';
import { mount } from 'enzyme';
import DataTableControlled from './index';
import '../../tests/setupTests';
import TestAppContext from '../../tests/TestAppContext';
import {
  DESELECT_ALL, DESELECT_PAGE_ALL, SELECT_ALL, SELECT_PAGE_ALL,
} from './massActions';

let columns;
let data;
let filterable;
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

describe('massActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('correctly change massAction and select all', async () => {
    const massActionSpy = jest.fn((included) => {
      expect(included)
        .toBe(true);
    });

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
          rowId="companyId"
          massActions={[
            {
              label: 'Usuń',
              id: 'delete',
              action: massActionSpy,
            },
          ]}
        />
      </TestAppContext>
    ));
    const massActionSelectInput = wrapper.find('select')
      .at(1);
    massActionSelectInput.prop('onChange')({ target: { value: SELECT_ALL } });
    wrapper.update();
    const massActions = wrapper.find('select')
      .at(0);
    massActions.prop('onChange')({ target: { value: 'delete' } });
    expect(massActionSpy)
      .toHaveBeenCalledTimes(1);
  });

  it('correctly validates massAction', async () => {
    const massActionSpy = jest.fn();

    const wrapper = mount((
      <TestAppContext router>
        <DataTableControlled
          columns={columns}
          data={data}
          filterable={filterable}
          fetchData={fetchData}
          count={count}
          buttons={buttons}
          getTrProps={getTrProps}
          rowId="companyId"
          massActions={[
            {
              label: 'Usuń',
              id: 'delete',
              action: massActionSpy,
            },
          ]}
        />
      </TestAppContext>
    ));

    const massActionSelectInput = wrapper.find('select')
      .at(1);
    massActionSelectInput.prop('onChange')({ target: { value: DESELECT_ALL } });
    wrapper.update();

    const massActions = wrapper.find('select').at(0);
    massActions.prop('onChange')({ target: { value: 'delete' } });
    expect(massActionSpy)
      .toHaveBeenCalledTimes(0);

    massActionSelectInput.prop('onChange')({ target: { value: SELECT_PAGE_ALL } });
    wrapper.update();
    let massActionComponent = wrapper.find('MassActionsSelect');
    expect(massActionComponent.prop('count')).toBe(data.length);

    massActionSelectInput.prop('onChange')({ target: { value: DESELECT_PAGE_ALL } });
    wrapper.update();
    massActionComponent = wrapper.find('MassActionsSelect');
    expect(massActionComponent.prop('count')).toBe(0);
  });

  it('correctly deselect simple input when all are selected', async () => {
    const massActionSpy = jest.fn((included, excluded) => {
      expect(included).toBe(true);
      expect(excluded.length).toBe(1);
    });

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
          rowId="companyId"
          massActions={[
            {
              label: 'Usuń',
              id: 'delete',
              action: massActionSpy,
            },
          ]}
        />
      </TestAppContext>
    ));
    const massActionSelectInput = wrapper.find('select')
      .at(1);
    massActionSelectInput.prop('onChange')({ target: { value: SELECT_ALL } });
    wrapper.update();

    const massActionCheckboxInput = wrapper.find('input[type="checkbox"]').at(0);
    massActionCheckboxInput.prop('onChange')();
    wrapper.update();

    const massActions = wrapper.find('select')
      .at(0);
    massActions.prop('onChange')({ target: { value: 'delete' } });
    expect(massActionSpy)
      .toHaveBeenCalledTimes(1);
  });

  it('correctly select and deselect simple input', async () => {
    const onSelectSpy = jest.fn((included) => {
      expect(included.length).toBe(2);
    });
    const onDeselectSpy = jest.fn((included) => {
      expect(included.length).toBe(1);
    });

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
          rowId="companyId"
          massActions={[
            {
              label: 'On select',
              id: 'select',
              action: onSelectSpy,
            },
            {
              label: 'On deselect',
              id: 'deselect',
              action: onDeselectSpy,
            },
          ]}
        />
      </TestAppContext>
    ));

    let massActionCheckboxInput1 = wrapper.find('input[type="checkbox"]').at(0);
    massActionCheckboxInput1.prop('onChange')();
    wrapper.update();
    const massActionCheckboxInput2 = wrapper.find('input[type="checkbox"]').at(1);
    massActionCheckboxInput2.prop('onChange')();
    wrapper.update();

    let massActions = wrapper.find('select')
      .at(0);
    massActions.prop('onChange')({ target: { value: 'select' } });
    expect(onSelectSpy).toHaveBeenCalledTimes(1);
    wrapper.update();

    massActionCheckboxInput1 = wrapper.find('input[type="checkbox"]').at(0);
    massActionCheckboxInput1.prop('onChange')();

    wrapper.update();
    massActions = wrapper.find('select').at(0);
    massActions.prop('onChange')({ target: { value: 'deselect' } });
    expect(onDeselectSpy).toHaveBeenCalledTimes(1);
  });

  it('correctly exclude simple input when all are requested', async () => {
    const onSelectSpy = jest.fn((included, excluded) => {
      expect(included).toBe(true);
      expect(excluded.length).toBe(0);
    });
    const onDeselectSpy = jest.fn((included, excluded) => {
      expect(included).toBe(true);
      expect(excluded.length).toBe(1);
    });

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
          rowId="companyId"
          massActions={[
            {
              label: 'On deselect',
              id: 'deselect',
              action: onDeselectSpy,
            },
            {
              label: 'On select',
              id: 'select',
              action: onSelectSpy,
            },
          ]}
        />
      </TestAppContext>
    ));

    const massActionSelectInput = wrapper.find('select')
      .at(1);
    massActionSelectInput.prop('onChange')({ target: { value: SELECT_ALL } });
    wrapper.update();

    let massActionCheckboxInput1 = wrapper.find('input[type="checkbox"]').at(0);
    massActionCheckboxInput1.prop('onChange')();
    wrapper.update();

    let massActions = wrapper.find('select')
      .at(0);
    massActions.prop('onChange')({ target: { value: 'deselect' } });
    expect(onDeselectSpy).toHaveBeenCalledTimes(1);
    wrapper.update();

    massActionCheckboxInput1 = wrapper.find('input[type="checkbox"]').at(0);
    massActionCheckboxInput1.prop('onChange')();

    wrapper.update();
    massActions = wrapper.find('select').at(0);
    massActions.prop('onChange')({ target: { value: 'select' } });
    expect(onSelectSpy).toHaveBeenCalledTimes(1);
  });
});
