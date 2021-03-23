import { restApiRequest, TRANSLATOR_SERVICE } from '../../../utils/Api';

const cache = {};
let cacheAll = null;
export default async function fetchScopeOptions(type, mockData) {
  if (!cache[type]) {
    if (!cacheAll) {
      try {
        const res = await restApiRequest(TRANSLATOR_SERVICE,
          '/scopes',
          'GET',
          {
            itemsPerPage: 10000,
          },
          mockData);
        cacheAll = res.map(({ title, code, type: optionType }) => ({
          value: code, label: title, type: optionType,
        }));
      } catch (e) {
        console.error(e);
        cacheAll = [];
      }
    }
    cache[type] = cacheAll.filter((item) => item.type === type);
  }
  return cache[type] || [];
}

export function getAllOptions() {
  return cacheAll || [];
}

export const ScopeTypes = [
  { label: 'Interfejs', value: 1 },
  { label: 'Wartości proste', value: 2 },
  { label: 'Opisy', value: 3 },
];
