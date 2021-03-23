import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'react-loaders';
import DataTable from '../../../../../../Components/DataTable';
import { getDateCell, mapValueFromOptions, priceColumn } from '../../../../../../Components/DataTable/commonCells';
import {
  LOADING_FALLBACK_VALUE, parseDataToTable, statusListingOptions,
} from '../utils';
import useBenefits, { IRI_PREFIX as BENEFIT_IRI_PREFIX } from '../../../../../../utils/hooks/benefit/useBenefits';
import { getIdFromIri } from '../../../../../../utils/jsHelpers/iriConverter';
import uniqueArray from '../../../../../../utils/jsHelpers/arrayUnique';
import useEmployees from '../../../../../../utils/hooks/company/useEmployees';
import useOrganizationUnits, { IRI_PREFIX as ORGANIZATION_UNIT_IRI_PREFIX } from '../../../../../../utils/hooks/company/useOrganizationUnits';
import FormsColumn from './formsColumn';
import ActionsColumn from './actionsColumn';

export default function PendingBenefitsTable({ subscriptionsData, updateItem }) {
  const [tableData, setTableData] = useState([]);
  const [employeesIds, setEmployeesIds] = useState([]);
  const [benefitsIds, setBenefitsIds] = useState([]);
  const [organizationUnitsIds, setOrganizationUnitsIds] = useState([]);
  const [isLazyLoading, setIsLazyLoading] = useState(false);

  const benefits = useBenefits(false, 'id', benefitsIds, null, null, true, !benefitsIds.length);
  const employees = useEmployees(false, 'id', employeesIds, false, !employeesIds.length);
  const organizationUnits = useOrganizationUnits(false, 'id', organizationUnitsIds, true, !organizationUnitsIds.length);

  useEffect(() => {
    setTableData(parseDataToTable(subscriptionsData, employees, benefits, organizationUnits, isLazyLoading));
  }, [subscriptionsData, employees, benefits, organizationUnits, isLazyLoading]);

  useEffect(() => {
    setBenefitsIds(subscriptionsData
      .map(({ benefit }) => getIdFromIri(benefit, BENEFIT_IRI_PREFIX))
      .filter(Boolean)
      .filter(uniqueArray));
    setEmployeesIds(subscriptionsData
      .map(({ ownerId }) => ownerId)
      .filter(Boolean)
      .filter(uniqueArray));
  }, [subscriptionsData]);

  useEffect(() => {
    setOrganizationUnitsIds(employees
      .map(({ organizationUnit }) => getIdFromIri(organizationUnit, ORGANIZATION_UNIT_IRI_PREFIX))
      .filter(Boolean)
      .filter(uniqueArray));
  }, [employees]);

  useEffect(() => {
    setIsLazyLoading(true);
    const timeout = setTimeout(() => {
      setIsLazyLoading(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [employees, subscriptionsData]);

  return (
    <>
      <DataTable
        id="pendingBenefitsListing"
        data={tableData}
        columns={[
          {
            Header: 'Numer FK',
            accessor: 'fk',
            Cell: lazyLoadingColumn,
          },
          {
            Header: 'Imię',
            accessor: 'firstName',
            Cell: lazyLoadingColumn,
          },
          {
            Header: 'Nazwisko',
            accessor: 'lastName',
            Cell: lazyLoadingColumn,
          },
          {
            Header: 'Jednostka Organizacyjna',
            accessor: 'organizationUnit',
            Cell: lazyLoadingColumn,
          },
          {
            Header: 'Benefit',
            accessor: 'benefit',
            Cell: lazyLoadingColumn,
          },
          {
            Header: 'Łączny koszt',
            accessor: 'summaryAmount',
            Cell: priceColumn,
          },
          {
            Header: 'Opłacone przez pracownika',
            accessor: 'employeePrice',
            Cell: priceColumn,
          },
          {
            Header: 'Status',
            accessor: 'pendingStatuses',
            width: 310,
            Cell: mapValueFromOptions(statusListingOptions, 'pendingStatuses'),
          },
          {
            Header: 'Formularze',
            accessor: 'pdfForms',
            width: 300,
            sortable: false,
            getProps: () => ({ updateItem }),
            Cell: FormsColumn,
          },
          {
            Header: 'Data wyboru',
            accessor: 'createdAt',
            Cell: getDateCell('createdAt'),
          },
          {
            Header: 'Akcja',
            accessor: 'action',
            filterable: false,
            sortable: false,
            getProps: () => ({ updateItem }),
            Cell: ActionsColumn,
          },
        ]}
      />
    </>
  );
}
const lazyLoadingColumn = (cellInfo) => {
  const value = cellInfo.row[cellInfo.column.id];
  return (
    <div className="d-block w-100 text-center">
      {value === LOADING_FALLBACK_VALUE ? <Loader active type="line-scale" style={{ transform: 'scale(0.4)' }} /> : value}
    </div>
  );
};

PendingBenefitsTable.propTypes = {
  subscriptionsData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  updateItem: PropTypes.func.isRequired,
};
