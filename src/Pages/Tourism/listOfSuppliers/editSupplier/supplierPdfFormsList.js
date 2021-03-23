import React, { useState, useEffect } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
// import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import DataTable from '../../../../Components/DataTable';
import __ from '../../../../utils/Translations';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
// import {mapValueFromOptions} from "../../../../Components/DataTable/commonCells";
// import useCompanies from '../../../../utils/hooks/company/useCompanies';

export default function SupplierPdfFormsList({ supplierId }) {
  const [supplierPdfForms, setSupplierPdfForms] = useState([]);
  useEffect(() => {
    const params = {};
    params.supplierId = supplierId;
    restApiRequest(
      SUBSCRIPTION_MANAGEMENT_SERVICE,
      '/pdf-forms',
      'GET',
      {
        params,
      },
      [],
    )
      .then((res) => {
        setSupplierPdfForms(res);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać świadczeń'), 'error'));
  }, [supplierId]);

  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Opis',
      accessor: 'description',
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
        <DataTable
          id="supplierSubscriptionsListing"
          columns={columns}
          data={supplierPdfForms}
          showPagination
          filterable
        />
      </CSSTransitionGroup>
    </>
  );
}

SupplierPdfFormsList.propTypes = {
  supplierId: PropTypes.string.isRequired,
};
