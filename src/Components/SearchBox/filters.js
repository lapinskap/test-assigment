import { AhrMainNav, MainNav } from '../../Layout/AppNav/NavItems';
import { filterNavItemsByAlc } from '../../utils/RoleBasedSecurity/filters';
import { mockData as mockCompanyData } from '../../Pages/Company/CompanyList';
import { mockData as mockEmployeeData } from '../../Pages/Company/EmployeeManagement/CompanyEmployees/List/list';
import __ from '../../utils/Translations';
import {
  CATALOG_MANAGEMENT_SERVICE, COMPANY_MANAGEMENT_SERVICE, restApiRequest, TOURISM_SERVICE,
} from '../../utils/Api';
import { productsMockData } from '../../Pages/ProductCatalog/List/table';
import { tourismObjectsMockData } from '../../Pages/Tourism/listOfObjects/table';

export const getResultsFromChildren = (items, value, resultHandler = []) => {
  let result = resultHandler;
  items.forEach(({ to, label, content }) => {
    if (to && __(label).toLowerCase().includes(value.toLowerCase())) {
      result.push({ to, label });
    }
    if (content && content.length) {
      result = getResultsFromChildren(content, value, resultHandler);
    }
  });
  return result;
};

export const findMenuItems = (value, ctx) => {
  if (!value || value.length < 2) {
    return [];
  }
  const items = filterNavItemsByAlc(MainNav, ctx.userInfo);
  return getResultsFromChildren(items, value).slice(0, 5).map(({ label, ...rest }) => ({ ...rest, label: __(label) }));
};

export const findEmployees = (value) => new Promise((resolve) => {
  setTimeout(() => {
    const result = mockEmployeeData.filter((item) => {
      const lowerCaseValue = value.toLowerCase();
      const name = `${item.firstName} ${item.lastName}`;
      return name.toLowerCase().includes(lowerCaseValue)
          || item.email.toLowerCase().includes(lowerCaseValue);
    }).map(({
      firstName, lastName, email, id,
    }) => ({
      label: `${firstName} ${lastName} (${email})`,
      to: `/ahr/employees/${id}`,
    }));
    resolve(result);
  }, 500);
});
export const findCompanies = (value) => restApiRequest(
  COMPANY_MANAGEMENT_SERVICE,
  '/companies',
  'GET',
  {
    params: {
      fullName: value,
      itemsPerPage: 10,
    },
  },
  mockCompanyData.filter((item) => item.fullName.toLowerCase().includes(value.toLowerCase())),
).then((res) => res.map(({ fullName, id }) => ({
  label: fullName,
  to: `/company/edit/${id}`,
})));
export const findProducts = (value) => restApiRequest(
  CATALOG_MANAGEMENT_SERVICE,
  '/products',
  'GET',
  {
    params: {
      name: value,
      itemsPerPage: 10,
    },
  },
  productsMockData.filter((item) => item.name.toLowerCase().includes(value.toLowerCase())),
).then((res) => res.map(({ name, id, mbProductType }) => ({
  label: name,
  to: `/product-catalog/products/${id}/${mbProductType}`,
})));
export const findTourismObjects = (value) => restApiRequest(
  TOURISM_SERVICE,
  '/tourism-objects',
  'GET',
  {
    params: {
      name: value,
      itemsPerPage: 10,
    },
  },
  tourismObjectsMockData.filter((item) => item.name.toLowerCase().includes(value.toLowerCase())),
).then((res) => res.map(({ name, id }) => ({
  label: name,
  to: `/tourism/objects/edit/${id}#basic_info`,
})));
