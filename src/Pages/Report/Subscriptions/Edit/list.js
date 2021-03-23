import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import DataTableControlled from '../../../../Components/DataTableControlled';
import { SelectFilter } from '../../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import { getAhrUrl } from '../../helpers/ahrHelper';

const SubscriptionReportList = ({ subscriptionList, isAhr }) => {
  const history = useHistory();

  const editSubUrl = (id) => getAhrUrl(`/report/subscriptions/edit/${id}`, isAhr);

  const handleClick = (id) => {
    history.push(editSubUrl(id));
    history.go(0);
  };

  const columns = () => [
    {
      Header: 'Nazwa raportu',
      accessor: 'reportName',
      filterable: false,

    },
    {
      Header: 'Utworzono',
      accessor: 'createdStr',
      filterable: false,

    },
    {
      Header: 'Sposób wysyłki',
      accessor: 'subscriptionMethod',
      Filter: SelectFilter([]),
      Cell: mapValueFromOptions([], 'subscriptionMethod'),
      filterable: false,

    },
    {
      Header: 'Format i Kodowanie',
      accessor: 'format',
      Filter: SelectFilter([]),
      Cell: mapValueFromOptions([], 'format'),
      filterable: false,

    },
    {
      Header: 'Częstotliwość',
      accessor: 'frequency',
      filterable: false,
    },
    {
      Header: 'Akcja',
      maxWidth: 150,
      filterable: false,
      sortable: false,
      Cell: (rowData) => (
        <div className="d-block w-100 text-center row">
          <Button role="button" color="link" onClick={() => handleClick(rowData.row._original.id)}>Przejdź</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTableControlled
        columns={columns()}
        data={subscriptionList}
        filterable
        fetchData={() => {}}
        count={subscriptionList.length || 0}
      />
    </>
  );
};

SubscriptionReportList.propTypes = {
  subscriptionList: PropTypes.arrayOf.isRequired,
  isAhr: PropTypes.bool.isRequired,
};

export default SubscriptionReportList;
