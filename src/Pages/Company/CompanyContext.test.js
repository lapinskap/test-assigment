/* eslint-disable react/prop-types */
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { create } from 'react-test-renderer';
import CompanyContext, {
  CompanyContextWrapper, useCompanyName, useCompanyHasFunctionality, useCompanyValue,
} from './CompanyContext';
import { wait, waitToLoadMocks } from '../../tests/helpers';

describe('CompanyContext', () => {
  test('CompanyContext renders correctly', async () => {
    const wrapper = create((
      <CompanyContextWrapper companyId="a43275e4-eeb2-11ea-adc1-0242ac1200021" showError>
        <div className="text-wrap">
          Zarządzanie firmą
          <CompanyContext.Consumer>
            {({ data }) => data.fullName }
          </CompanyContext.Consumer>
        </div>
      </CompanyContextWrapper>
    ));
    await wait(150);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});

describe('useCompanyName', () => {
  it('returns company name', () => {
    const wrapper = ({ children }) => (
      <CompanyContext.Provider value={{
        data: {
          fullName: 'test name',
        },
        refresh: () => null,
      }}
      >
        {children}
      </CompanyContext.Provider>
    );
    const { result } = renderHook(() => useCompanyName(), { wrapper });
    expect(result.current).toBe('test name');
  });
});

describe('useCompanyValue', () => {
  it('returns company value', async () => {
    const wrapper = ({ children }) => (
      <CompanyContext.Provider value={{
        data: {
          name: 'test',
        },
        refresh: () => null,
      }}
      >
        {children}
      </CompanyContext.Provider>
    );
    const { result } = renderHook(() => useCompanyValue('name', ''), { wrapper });
    await waitToLoadMocks();
    expect(result.current).toBe('test');
  });
  it('returns default value', () => {
    const wrapper = ({ children }) => (
      <CompanyContext.Provider value={{
        data: {
        },
        refresh: () => null,
      }}
      >
        {children}
      </CompanyContext.Provider>
    );
    const { result } = renderHook(() => useCompanyValue('name', ''), { wrapper });
    expect(result.current).toBe('');
  });
});

describe('useCompanyHasFunctionality', () => {
  it('returns true', () => {
    const wrapper = ({ children }) => (
      <CompanyContext.Provider value={{
        data: {
          name: '',
          functionalities: ['EMPLOYEE_PESEL'],
        },
        refresh: () => null,
      }}
      >
        {children}
      </CompanyContext.Provider>
    );
    const { result } = renderHook(() => useCompanyHasFunctionality('EMPLOYEE_PESEL'), { wrapper });
    expect(result.current).toBe(true);
  });
  it('returns false', () => {
    const wrapper = ({ children, data }) => (
      <CompanyContext.Provider value={{
        data,
      }}
      >
        {children}
      </CompanyContext.Provider>
    );
    const { result } = renderHook(() => useCompanyHasFunctionality('test'), { wrapper });
    expect(result.current).toBe(false);
  });
});
