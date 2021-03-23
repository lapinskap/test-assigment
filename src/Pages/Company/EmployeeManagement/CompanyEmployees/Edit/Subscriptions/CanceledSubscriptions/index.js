import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardHeader, CardBody,
} from 'reactstrap';
import DataTable from '../../../../../../../Components/DataTable';
import {
  DateFilter,
  dateFilterMethod, SelectFilter,
} from '../../../../../../../Components/DataTable/filters';
import { getDateCell, mapValueFromOptions, priceColumn } from '../../../../../../../Components/DataTable/commonCells';
import __ from '../../../../../../../utils/Translations';
import {
  benefitIdColumn, POPUP_TYPE_BLOCK,
  POPUP_TYPE_CANCEL,
  POPUP_TYPE_CHANGE, STATUS_CANCELED,
  statusesOptions,
} from '../utils';
import ActionColumn from '../../../../../../../Components/DataTable/actionColumn';
import { subscriptionEmployeeSubscriptionItemCancel } from '../../../../../../../utils/RoleBasedSecurity/permissions';

const CanceledSubscriptions = ({ items, companyId, openPopup }) => (
  <Card>
    <CardHeader>{__('Świadczenia abonamentowe, z których zrezygnowano')}</CardHeader>
    <CardBody>
      <DataTable
        noCards
        id="canceledSubscriptions"
        key={`canceledSubscriptions_${items.length}`}
        columns={[
          {
            Header: 'Nazwa',
            accessor: 'name',
          },
          {
            Header: 'Status',
            accessor: 'status',
            Filter: SelectFilter(statusesOptions),
            Cell: mapValueFromOptions(statusesOptions, 'status'),
          },
          {
            Header: 'Data startu',
            accessor: 'startsAt',
            Filter: DateFilter(),
            filterMethod: dateFilterMethod,
            Cell: getDateCell('startsAt'),
          },
          {
            Header: 'Data końca',
            accessor: 'endsAt',
            Filter: DateFilter(),
            filterMethod: dateFilterMethod,
            Cell: getDateCell('endsAt'),
          },
          {
            Header: 'ID benefitu w firmie',
            accessor: 'benefit',
            getProps: () => ({ company: companyId }),
            Cell: benefitIdColumn,
          },
          {
            Header: 'Koszt pracownika',
            accessor: 'employeePrice',
            Cell: priceColumn,
          },
          {
            Header: 'Koszt pracodawcy',
            accessor: 'employerPrice',
            Cell: priceColumn,
          },
          {
            Header: 'Blokada ponownego wyboru do',
            accessor: 'blockTo',
            Filter: DateFilter(),
            filterMethod: dateFilterMethod,
            Cell: getDateCell('blockTo'),
          },
          {
            Header: 'Akcja',
            accessor: 'action',
            maxWidth: 100,
            filterable: false,
            sortable: false,
            Cell: (cell) => {
              const rowId = cell.row._original.id;
              const isCanceled = cell.row._original.status === STATUS_CANCELED;
              return (
                <div className="w-100">
                  <ActionColumn
                    data={cell.row._original}
                    buttons={[
                      !isCanceled ? {
                        id: 'cancel',
                        onClick: () => openPopup(POPUP_TYPE_CANCEL, rowId),
                        permission: subscriptionEmployeeSubscriptionItemCancel,
                        label: 'Anuluj',
                      } : null,
                      !isCanceled ? {
                        id: 'change',
                        onClick: () => openPopup(POPUP_TYPE_CHANGE, rowId),
                        label: 'Zmień',
                      } : null,
                      {
                        id: 'block',
                        onClick: () => openPopup(POPUP_TYPE_BLOCK, rowId),
                        label: 'Blokada',
                      },
                    ]}
                  />
                </div>
              );
            },
          },
        ]}
        data={items}
        showPagination={false}
        filterable
      />
    </CardBody>
  </Card>
);

CanceledSubscriptions.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  companyId: PropTypes.string.isRequired,
  openPopup: PropTypes.func.isRequired,
};

export default CanceledSubscriptions;
