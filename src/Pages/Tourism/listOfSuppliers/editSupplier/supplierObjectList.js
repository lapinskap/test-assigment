import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import DataTable from '../../../../Components/DataTable';
import { SelectFilter } from '../../../../Components/DataTable/filters';
import { getUserConfirmationPopup } from '../../../../Components/UserConfirmationPopup';
import { mockData } from '../mockData';
import { TOURISM_SERVICE, restApiRequest } from '../../../../utils/Api';
import DataLoading from '../../../../Components/Loading/dataLoading';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import useDictionary from '../../../../utils/hooks/dictionaries/useDictionary';
import { DICTIONARY_COUNTRIES } from '../../../../utils/hooks/dictionaries/dictionariesCodes';
import { mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { tourismTourismObjectPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';

export default function SupplierObjectList({ supplierId }) {
  const [data, setData] = useState(null);
  const countries = useDictionary(DICTIONARY_COUNTRIES);
  const toggleActive = async (id, value) => {
    try {
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      if (item) {
        item.active = value;
        setData(updatedData);
      }
      await restApiRequest(
        TOURISM_SERVICE,
        `/tourism-objects/${id}`,
        'PATCH',
        {
          body: {
            status: value ? 'active' : 'inactive',
          },
        },
        {},
      );
      dynamicNotification(value ? __('Pomyślnie aktywowano obiekt') : __('Pomyślnie dezaktywowano obiekt'));
    } catch (e) {
      console.error(e);
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      if (item) {
        item.active = !value;
        setData(updatedData);
      }
      dynamicNotification(e.message || __('Nie udało się zmienić aktywności obiektu'), 'error');
    }
  };

  const columns = () => [
    {
      Header: 'Zaznaczenie',
      accessor: 'checkbox',
      maxWidth: 150,
      Filter: SelectFilter(ObjectOptions, true),
      Cell: () => (
        <div className="d-block w-100 text-center">
          <Input type="checkbox" />
        </div>
      ),
    },
    {
      Header: 'Kod obiektu',
      accessor: 'code',
    },
    {
      Header: 'Pełna nazwa obiektu',
      accessor: 'name',
    },
    {
      Header: 'Lista dostawców',
      accessor: 'suppliers',
    },
    {
      Header: 'Państwo',
      accessor: 'countryCode',
      Filter: SelectFilter(countries),
      Cell: mapValueFromOptions(countries, 'countryCode'),
    },
    {
      Header: 'Miasto',
      accessor: 'city',
      maxWidth: 150,
    },
    {
      Header: 'Status',
      accessor: 'status',
      maxWidth: 150,
    },
    {
      Header: 'Akcja',
      accessor: 'action',
      filterable: false,
      sortable: false,
      maxWidth: 250,
      Cell: (rowData) => (
        <div className="d-block w-100 text-center">
          <RbsButton
            permission={tourismTourismObjectPermissionWrite}
            onClick={() => {
              getUserConfirmationPopup(
                <p>
                  Czy na pewno chcesz opublikować dla użytkowników obiekt
                  {' '}
                  <strong>{rowData.row._original.name}</strong>
                  {' '}
                  w ofercie dostawcy
                  {' '}
                  <strong>{mockData[supplierId].name}</strong>
                  ?
                </p>, () => toggleActive(rowData._original.id, true), 'Publikowanie obiektu',
              );
            }}
            color="link"
            className="m-1"
          >
            Publikuj
          </RbsButton>
          {/* <Button
            onClick={() => {
              getUserConfirmationPopup(
                <p>
                  Czy na pewno chcesz usunąć obiekt
                  {' '}
                  <strong>{rowData.row._original.name}</strong>
                  {' '}
                  z listy obiektów dostawcy
                  {' '}
                  <strong>{mockData[supplierId].name}</strong>
                  ?
                </p>, submit, 'Usuwanie obiektu',
              );
            }}
            color="link"
            className="m-1"
          >
            Usuń
          </Button> */}
          <Link to={getUrlToForm(rowData.row._original.objectId)}><Button color="link" className="m-1">Edytuj</Button></Link>
        </div>
      ),
    },
  ];
  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <DataLoading
          fetchedData={data !== null}
          updateData={(updatedData) => setData(updatedData)}
          mockDataEndpoint="/suppliers/objects"
          endpoint={`/tourism-objects?itemsPerPage=10000&suppliers=${supplierId}`}
          service={TOURISM_SERVICE}
        >
          <DataTable
            id="tourismObjectSuppliersListing"
            key={data ? `table_${data.length}` : 'mocks'}
            columns={columns()}
            data={data || []}
            showPagination
            filterable
          />
        </DataLoading>
      </CSSTransitionGroup>
    </>
  );
}

const getUrlToForm = (id) => `/tourism/objects/edit/${id}#basic_info`;

const ObjectOptions = [
  { value: 'option1', label: 'Wszystkie' },
  { value: 'option2', label: 'Nowe' },
];

SupplierObjectList.propTypes = {
  supplierId: PropTypes.string.isRequired,
};
