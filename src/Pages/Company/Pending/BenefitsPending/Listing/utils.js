import {
  STATUS_ACTIVE,
  STATUS_DENIED,
  STATUS_PENDING,
} from '../../../EmployeeManagement/CompanyEmployees/Edit/Subscriptions/utils';

export const COMPLETED_STATUS_WAITING_FOR_ACTIVE_FORMS = 'waitingForActiveForms';
export const COMPLETED_STATUS_WAITING_FOR_PDF_FORMS = 'waitingForPdfForms';
export const statusOptions = [
  { value: COMPLETED_STATUS_WAITING_FOR_ACTIVE_FORMS, label: 'Oczekuje na uzupełnienie danych osobowych' },
  { value: COMPLETED_STATUS_WAITING_FOR_PDF_FORMS, label: 'Oczekuje na dokumenty do doniesienia' },
];
export const statusListingOptions = [
  ...statusOptions,
  { value: STATUS_ACTIVE, label: 'Zaakceptowany' },
  { value: STATUS_DENIED, label: 'Odrzucony' },
];

export const prepareBackendFilters = ({
  employeeId, createdAtFrom, createdAtTo, benefitName,
}, companyId) => {
  const params = {
    itemsPerPage: 10000,
    status: 'pending',
  };
  params['benefit.companyId'] = companyId;
  if (employeeId) {
    params['subscription.ownerId'] = employeeId;
  }
  if (createdAtFrom) {
    params['createdAt[after]'] = new Date(createdAtFrom).toISOString();
  }
  if (createdAtTo) {
    params['createdAt[before]'] = new Date(createdAtTo).toISOString();
  }
  if (benefitName) {
    params['benefit.name'] = benefitName;
  }
  return params;
};

export const handleFrontendFilters = (data, { formId, status }) => data.filter((item) => {
  if (formId && !item?.pdfForms.find(({ id }) => formId.includes(id))) {
    return false;
  }
  if (status && !item?.pendingStatuses?.includes(status)) {
    return false;
  }
  return true;
});

export const LOADING_FALLBACK_VALUE = '***';
export const parseDataToTable = (subscriptions, employees, benefits, organizationUnits, loadingData) => subscriptions.map((item) => {
  const loadingFallback = loadingData ? LOADING_FALLBACK_VALUE : null;
  const employee = employees.find(({ id: employeeId }) => employeeId === item.ownerId);
  const organizationUnit = organizationUnits.find(
    ({ id: organizationUnitIri }) => organizationUnitIri && organizationUnitIri === employee?.organizationUnit,
  );
  const benefit = benefits.find(({ id: benefitIri }) => benefitIri === item.benefit);
  const pendingStatus = item.pendingStatuses?.length === 1 ? item.pendingStatuses[0] : item.pendingStatuses;

  return ({
    ...item,
    fk: employee?.fk || (item.ownerId && !employee ? loadingFallback : null),
    firstName: employee?.firstName || (item.ownerId && !employee ? loadingFallback : null),
    lastName: employee?.lastName || (item.ownerId && !employee ? loadingFallback : null),
    organizationUnit: organizationUnit?.name || (item.ownerId && !organizationUnit ? loadingFallback : null),
    benefit: benefit?.name || (item.benefit && !benefit ? loadingFallback : null),
    summaryAmount: +item.employeePrice + +item.employerPrice,
    pendingStatuses: item.status !== STATUS_PENDING ? item.status : pendingStatus,
  });
});
