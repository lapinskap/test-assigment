import { useState, useEffect } from 'react';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../Api';
import __ from '../../Translations';
import { mockData as companyMockData } from '../../../Pages/Company/CompanyList';
import useRentableGroups from './useRentableGroups';
import useEmployeeGroups from './useEmployeeGroups';
import useOrganizationUnits from './useOrganizationUnits';

export default function useCompanyGroupsOptions(
  companyId,
  rentableGroupsOptions = false,
  employeeGroupsOptions = false,
  organizationUnitsOptions = false,
  companyOptions = false,
) {
  const [companyData, setCompanyData] = useState([]);
  const rentableGroups = useRentableGroups(false, 'companyId', companyId, false, !companyId);
  const employeeGroups = useEmployeeGroups(false, 'companyId', companyId, false, !companyId);
  const organizationUnits = useOrganizationUnits(false, 'companyId', companyId, false, !companyId);

  useEffect(() => {
    if (companyOptions) {
      restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        `/companies?id=${companyId}`,
        'GET',
        {},
        companyMockData.filter((el) => el.id === companyId),
      )
        .then((result) => setCompanyData(result))
        .catch(() => []);
    }
  }, [companyOptions, setCompanyData, companyId]);

  const result = [];

  if (companyOptions) {
    result.push({
      label: __('Firma'),
      options: companyData.map(({ id, fullName: name }) => ({
        value: `company_${id}`,
        label: name,
      })),
    });
  }

  if (rentableGroupsOptions) {
    result.push({
      label: __('Grupy dochodowości'),
      options: rentableGroups.map(({ id, frontendName }) => ({
        value: `rentableGroup_${id}`,
        label: frontendName,
      })),
    });
  }

  if (employeeGroupsOptions) {
    result.push({
      label: __('Grupy pracownicze'),
      options: employeeGroups.map(({ id, name }) => ({
        value: `employeeGroup_${id}`,
        label: name,
      })),
    });
  }

  if (organizationUnitsOptions) {
    result.push({
      label: __('Jednostki organizacyjne'),
      options: organizationUnits.map(({ id, name }) => ({
        value: `organizationUnit_${id}`,
        label: name,
      })),
    });
  }

  return result;
}
