import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardHeader, CardBody,
} from 'reactstrap';
import DataTable from '../../../../../../../Components/DataTable';
import {
  DateFilter,
  dateFilterMethod,
} from '../../../../../../../Components/DataTable/filters';
import { getDateCell, priceColumn } from '../../../../../../../Components/DataTable/commonCells';
import __ from '../../../../../../../utils/Translations';
import {
  benefitIdColumn,
  POPUP_TYPE_CANCEL, POPUP_TYPE_CHANGE, POPUP_TYPE_RESIGN, POPUP_TYPE_SUSPEND,
} from '../utils';
import ActionColumn from '../../../../../../../Components/DataTable/actionColumn';
import {
  subscriptionEmployeeSubscriptionItemCancel,
  subscriptionEmployeeSubscriptionItemResign,
} from '../../../../../../../utils/RoleBasedSecurity/permissions';

const ActiveSubscriptions = ({ items, openPopup, companyId }) => (
  <Card>
    <CardHeader>{__('Zawieszanie i rezygnacja ze świadczeń abonamentowych')}</CardHeader>
    <CardBody>
      <DataTable
        noCards
        id="activeSubscriptions"
        key={`activeSubscriptions_${items.length}`}
        columns={[
          {
            Header: 'Nazwa',
            accessor: 'name',
          },
          {
            Header: 'Data startu',
            accessor: 'startsAt',
            Filter: DateFilter(),
            minWidth: 150,
            filterMethod: dateFilterMethod,
            Cell: getDateCell('startsAt'),
          },
          {
            Header: 'Data końca',
            accessor: 'endsAt',
            Filter: DateFilter(),
            minWidth: 150,
            filterMethod: dateFilterMethod,
            Cell: getDateCell('endsAt'),
          },
          {
            Header: 'Zawieszenie od',
            accessor: 'suspendedFrom',
            Filter: DateFilter(),
            minWidth: 150,
            filterMethod: dateFilterMethod,
            Cell: getDateCell('suspendedFrom'),
          },
          {
            Header: 'Zawieszenie do',
            accessor: 'suspendedTo',
            Filter: DateFilter(),
            minWidth: 150,
            filterMethod: dateFilterMethod,
            Cell: getDateCell('suspendedTo'),
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
            Header: 'Akcja',
            accessor: 'action',
            filterable: false,
            sortable: false,
            maxWidth: 100,
            Cell: (cell) => {
              const rowId = cell.row._original.id;
              return (
                <div className="w-100">
                  <ActionColumn
                    data={cell.row._original}
                    buttons={[
                      {
                        id: 'cancel',
                        permission: subscriptionEmployeeSubscriptionItemCancel,
                        onClick: () => openPopup(POPUP_TYPE_CANCEL, rowId),
                        label: 'Anuluj',
                      },
                      {
                        id: 'change',
                        onClick: () => openPopup(POPUP_TYPE_CHANGE, rowId),
                        label: 'Zmień',
                      },
                      {
                        id: 'resign',
                        permission: subscriptionEmployeeSubscriptionItemResign,
                        onClick: () => openPopup(POPUP_TYPE_RESIGN, rowId),
                        label: 'Rezygnuj',
                      },
                      {
                        id: 'suspend',
                        onClick: () => openPopup(POPUP_TYPE_SUSPEND, rowId),
                        label: 'Zawieś',
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

ActiveSubscriptions.propTypes = {
  companyId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  openPopup: PropTypes.func.isRequired,
};

export default ActiveSubscriptions;
