/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import DataTable from '../../../../Components/DataTable';
import useCompanies from '../../../../utils/hooks/company/useCompanies';
import { SUBSCRIPTION_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import useBenefitGroups from '../../../../utils/hooks/benefit/useBenefitGroups';
import { AutocompleteSelectFilter } from '../../../../Components/DataTable/filters';

export default function SupplierSubscriptionList({ supplierId }) {
  const companies = useCompanies(true);
  const [benefitGroupIds, setBenefitGroupIds] = useState([]);
  const [supplierSubscriptions, setSupplierSubscriptions] = useState([]);
  useEffect(() => {
    const params = {};

    params.supplierId = supplierId;

    restApiRequest(
      SUBSCRIPTION_MANAGEMENT_SERVICE,
      '/benefit-employee-groups',
      'GET',
      {
        params,
      },
      [],
    )
      .then((res) => {
        setBenefitGroupIds([...new Set(res.map((x) => x.benefit.benefitGroup))]);
        setSupplierSubscriptions(res);
      })
      .catch((e) => dynamicNotification(e.message || __('Nie udało się pobrać świadczeń'), 'error'));
  }, [supplierId]);
  const benefitGroups = useBenefitGroups(true, 'id', benefitGroupIds, true, !benefitGroupIds.length);
  const columns = [
    {
      Header: 'Nazwa świadczenia',
      accessor: 'name',
      Cell: (cellInfo) => cellInfo.row._original.benefit.name,
    },
    {
      Header: 'Grupa abonamentów',
      accessor: 'benefitGroup',
      Filter: AutocompleteSelectFilter(benefitGroups),
      Cell: (cellInfo) => {
        const { benefitGroup } = cellInfo.row._original.benefit;
        const matchedOption = benefitGroups.find((option) => option.value === benefitGroup);
        return matchedOption ? matchedOption.label : benefitGroup;
      },
    },
    {
      Header: 'Firma',
      accessor: 'companyId',
      Filter: AutocompleteSelectFilter(companies),
      Cell: (cellInfo) => {
        const { companyId } = cellInfo.row._original.benefit;
        const matchedOption = companies.find((option) => option.value === companyId);
        return matchedOption ? matchedOption.label : companyId;
      },
    },
    {
      Header: 'Grupa pracownicza',
      accessor: 'name',
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
          data={supplierSubscriptions}
          showPagination
          filterable
        />
      </CSSTransitionGroup>
    </>
  );
}

SupplierSubscriptionList.propTypes = {
  supplierId: PropTypes.string.isRequired,
};
