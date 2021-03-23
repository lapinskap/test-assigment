import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Card, CardBody,
} from 'reactstrap';
import DataTable from '../../../../../../Components/DataTable';
import Popup from './popup';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import { MAGENTO_ADMIN_SERVICE } from '../../../../../../utils/Api';
import __ from '../../../../../../utils/Translations';
import FormTitle from '../../../../../../Components/Form/FormTitle';
import ActionColumn from '../../../../../../Components/DataTable/actionColumn';
import useSuppliers from '../../../../../../utils/hooks/suppliers/useSuppliers';
import { AutocompleteSelectFilter } from '../../../../../../Components/DataTable/filters';
import { mapValueFromOptions, priceColumn } from '../../../../../../Components/DataTable/commonCells';
import usePointsBanks from '../../../../../../utils/hooks/pointsBank/usePointsBanks';
import priceFormatter from '../../../../../../utils/jsHelpers/priceFormatter';

export default function OneTimeService({ employeeId, companyId }) {
  const [tableData, setTableData] = useState([]);
  const [pointsBanksMap, setPointsBanksMap] = useState({});
  const [alreadyFetched, setAlreadyFetched] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const closeForm = useCallback(() => {
    setOpenPopup(false);
  }, [setOpenPopup]);
  const suppliersOptions = useSuppliers(true, false, true);

  const pointsBanks = usePointsBanks(false, 'pointsBankCompanyId', companyId, !companyId);

  useEffect(() => {
    const newPointsBanksMap = {};
    pointsBanks.forEach(({ id, name }) => {
      newPointsBanksMap[id] = name;
    });
    setPointsBanksMap(newPointsBanksMap);
  }, [pointsBanks]);

  return (
    <Card>
      <FormTitle
        title="Warunki edycji świadczeń jednorazowych"
        buttons={[
          <Button
            data-t1="subscription-edit-rules"
            key="subscription-edit-rules"
            color="secondary"
            onClick={() => setOpenPopup(true)}
          >
            {__('Warunki edycji świadczeń jednorazowych')}
          </Button>,
        ]}
      />
      <CardBody>
        <DataLoading
          service={MAGENTO_ADMIN_SERVICE}
          endpoint={`/order?customerBusinessId=${employeeId}&itemsPerPage=10000`}
          fetchedData={alreadyFetched}
          updateData={(response) => {
            let items = [];
            response.forEach(({ items: orderItems, incrementId: orderId }) => {
              items = [...items, ...orderItems.map((item) => ({ ...item, orderId }))];
            });
            setTableData(items);
            setAlreadyFetched(true);
          }}
          mockDataEndpoint="/employee/oneTimeServices/list"
        >
          <DataTable
            id="oneTimeServicesListing"
            key={`one_time_services_listing_${alreadyFetched}`}
            data={tableData}
            noCards
            filterable
            columns={[
              {
                Header: 'SKU',
                accessor: 'sku',
              },
              {
                Header: 'Dostawca',
                accessor: 'supplierId',
                Filter: AutocompleteSelectFilter(suppliersOptions),
                Cell: mapValueFromOptions(suppliersOptions, 'supplierId'),
                sortable: false,
              },
              {
                Header: 'Nazwa świadczenia',
                accessor: 'name',
              },
              {
                Header: 'Ogólny koszt świadczenia',
                accessor: 'rowTotal',
                Cell: priceColumn,
              },
              {
                Header: 'Sposób opłacenia',
                accessor: 'pointsBank',
                Cell: (rowData) => displayBanksItems(rowData.row._original.pointsBank, pointsBanksMap),
              },
              {
                Header: 'ID transakcji',
                accessor: 'orderId',
              },
              {
                Header: 'Akcja',
                filterable: false,
                sortable: false,
                accessor: 'action',
                Cell: (rowData) => (
                  <div className="d-block w-100 text-center">
                    <ActionColumn
                      data={rowData.row._original}
                      buttons={[
                        {
                          id: 'cancelSubscription',
                          onClick: () => {},
                          label: 'Anuluj',
                          disabled: true,
                        },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />
        </DataLoading>
        {openPopup ? <Popup close={closeForm} isOpen={Boolean(openPopup)} /> : null}
      </CardBody>
    </Card>
  );
}

const displayBanksItems = (items, pointsBanksMap) => {
  if (!items) {
    return null;
  }

  return (
    <ul>
      {items.map(({ id, balance }) => (
        <li key={id}>
          {pointsBanksMap[id] || 'Nieznany bank'}
          :
          {' '}
          {priceFormatter(balance)}
        </li>
      ))}
    </ul>
  );
};

OneTimeService.propTypes = {
  employeeId: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
};
