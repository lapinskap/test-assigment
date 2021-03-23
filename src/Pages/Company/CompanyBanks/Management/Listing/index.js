import PropTypes from 'prop-types';
import React, { useState } from 'react';

import DataTable from '../../../../../Components/DataTable';
import NewBankForm from './newBankForm';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { COMPANY_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import ActionColumn from '../../../../../Components/DataTable/actionColumn';

export default function Listing({ companyId }) {
  const [data, setData] = useState(null);
  const [showNewBankForm, setShowNewBankForm] = useState(false);
  const closeNewBankForm = (refresh = false) => {
    setShowNewBankForm(false);
    if (refresh) {
      setData(null);
    }
  };

  return (
    <>
      <DataLoading
        service={COMPANY_MANAGEMENT_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => setData(updatedData)}
        mockDataEndpoint="/company/companyBanks/listing"
        endpoint={`/points-banks/owner?pointsBankOwnerId=${companyId}`}
      >
        <DataTable
          id="companyBanksListing"
          columns={columns(companyId)}
          data={data || []}
          filterable
          buttons={[
            {
              onClick: () => {
                setShowNewBankForm(true);
              },
              text: '+ Dodaj nowy bank',
              id: 'companyBanksAdd',
              color: 'primary',
            },
          ]}
        />
      </DataLoading>
      {showNewBankForm ? <NewBankForm close={closeNewBankForm} companyId={companyId} /> : null}
    </>
  );
}

const columns = (companyId) => [
  {
    Header: 'Nazwa',
    accessor: 'name',
  },
  {
    Header: 'Edycja',
    accessor: 'edit',
    width: 200,
    Cell: (data) => (
      <div className="d-block w-100 text-center">
        <ActionColumn
          data={data.row._original}
          buttons={[
            {
              id: 'companyBanksEdit',
              color: 'link',
              label: 'Edytuj',
              href: `/company/edit/${companyId}/banks/management/${data.row._original.pointsBankId}#one_time_charge_up`,
            },
          ]}
        />
      </div>
    ),
  },
];

Listing.propTypes = {
  companyId: PropTypes.string.isRequired,
};
