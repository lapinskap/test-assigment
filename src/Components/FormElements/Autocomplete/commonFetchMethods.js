import { COMPANY_MANAGEMENT_SERVICE, EMPLOYEE_MANAGEMENT_SERVICE, restApiRequest } from '../../../utils/Api';
import { mockData as companyMockData } from '../../../Pages/Company/CompanyList';
import { mockData as employeesMockData } from '../../../Pages/Company/EmployeeManagement/CompanyEmployees/List/list';

/** METHODS FOR ASYNC AUTOCOMPLETE */

export const getCompaniesOptionsFetchMethod = (currValue) => async (inputValue = '') => {
  const params = {};
  let mockData = [];
  if (inputValue) {
    params.fullName = inputValue;
    mockData = companyMockData.filter((company) => company.fullName.toLowerCase().includes(inputValue.toLowerCase()));
  } else if (currValue && !Array.isArray(currValue)) {
    params.id = currValue;
    mockData = companyMockData.filter((company) => company.id === currValue);
  } else if (Array.isArray(currValue) && currValue.length) {
    params.id = currValue;
    mockData = companyMockData.filter((company) => currValue.includes(company.id));
  }
  return restApiRequest(
    COMPANY_MANAGEMENT_SERVICE,
    '/companies',
    'GET',
    { params },
    mockData,
  )
    .then((result) => result.map(({ id, fullName }) => ({
      value: id,
      label: fullName,
    })))
    .catch(() => []);
};

export const getEmployeesOptionsFetchMethod = (currValue, additionalFilterParams) => async (inputValue = '') => {
  const params = {};
  let mockData = [];
  if (inputValue) {
    params.or_searchByName = [inputValue];
    mockData = employeesMockData.filter((employee) => employee.firstName.toLowerCase().includes(inputValue.toLowerCase()));
  } else if (currValue && !Array.isArray(currValue)) {
    params.id = currValue;
    mockData = employeesMockData.filter((employee) => employee.id === currValue);
  } else if (Array.isArray(currValue) && currValue.length) {
    params.id = currValue;
    mockData = employeesMockData.filter((employee) => currValue.includes(employee.id));
  }
  const fetchByName = restApiRequest(
    EMPLOYEE_MANAGEMENT_SERVICE,
    '/employees',
    'GET',
    { params: { ...params, ...additionalFilterParams } },
    mockData,
  )
    .then((result) => result.map(({
      id, firstName, lastName, fk,
    }) => ({
      value: id,
      label: `${firstName} ${lastName}${fk ? `(fk: ${fk})` : ''}`,
    })))
    .catch(() => []);
  const promises = [fetchByName];

  if (inputValue) {
    const fetchByFk = restApiRequest(
      EMPLOYEE_MANAGEMENT_SERVICE,
      '/employees',
      'GET',
      { params: { fk: inputValue, ...additionalFilterParams } },
      mockData,
    )
      .then((result) => result.map(({
        id, firstName, lastName, fk = '',
      }) => ({
        value: id,
        label: `${firstName} ${lastName}${fk ? `(fk: ${fk})` : ''}`,
      })))
      .catch(() => []);
    promises.push(fetchByFk);
  }

  const responses = await Promise.all(promises);

  let result = [];
  responses.forEach((requestResult) => {
    result = result.concat(requestResult);
  });
  return result.filter((value, index, self) => self.findIndex((el) => el.value === value.value) === index);
};
