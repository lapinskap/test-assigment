import { getCompaniesOptionsFetchMethod, getEmployeesOptionsFetchMethod } from './commonFetchMethods';

describe('useCompanyGroupsOptions', () => {
  it('returns default options when has currValue', async () => {
    const method = getCompaniesOptionsFetchMethod('a43275e4-eeb2-11ea-adc1-0242ac1200021');
    const result = await method();
    expect('value' in result[0] && 'label' in result[0]).toBeTruthy();
  });
  it('returns default options when has currValue as Array', async () => {
    const method = getCompaniesOptionsFetchMethod(['a43275e4-eeb2-11ea-adc1-0242ac1200021', 'a43275e4-eeb2-11ea-adc1-0242ac1200022']);
    const result = await method();
    expect('value' in result[0] && 'label' in result[0]).toBeTruthy();
  });
  it('not returns default options when has not currValue', async () => {
    const method = getCompaniesOptionsFetchMethod();
    const result = await method('');
    expect(result.length).toBe(0);
  });
  it('returns options with input text', async () => {
    const method = getCompaniesOptionsFetchMethod('');
    const result = await method('Al');
    expect('value' in result[0] && 'label' in result[0]).toBeTruthy();
  });
});
describe('getEmployeesOptionsFetchMethod', () => {
  it('returns default options when has currValue', async () => {
    const method = getEmployeesOptionsFetchMethod('a43275e4-eeb2-11ea-adc1-0242ac1200021');
    const result = await method();
    expect('value' in result[0] && 'label' in result[0]).toBeTruthy();
  });
  it('returns default options when has currValue as Array', async () => {
    const method = getEmployeesOptionsFetchMethod(['a43275e4-eeb2-11ea-adc1-0242ac1200021', 'a43275e4-eeb2-11ea-adc1-0242ac1200022']);
    const result = await method();
    expect('value' in result[0] && 'label' in result[0]).toBeTruthy();
  });
  it('not returns default options when has not currValue', async () => {
    const method = getEmployeesOptionsFetchMethod();
    const result = await method('');
    expect(result.length).toBe(0);
  });
  it('returns options with input text', async () => {
    const method = getEmployeesOptionsFetchMethod('');
    const result = await method('Jan');
    expect('value' in result[0] && 'label' in result[0]).toBeTruthy();
  });
});
