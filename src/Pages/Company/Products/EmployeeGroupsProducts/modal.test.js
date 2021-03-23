import React from 'react';
import { mount } from 'enzyme';
import Modal from './modal';
import '../../../../tests/setupTests';
import TestAppContext from '../../../../tests/TestAppContext';
import EmployeeGroupContext from './employeeGroupContext';
import { mockPaymentsConfig } from './index';

describe('egp listing', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <TestAppContext redux router>
        <EmployeeGroupContext.Provider value={{ paymentsConfig: mockPaymentsConfig, data: {} }}>
          <Modal
            treePath={[]}
            category={{ name: 'test', id: 'test-id', type: 'products' }}
            product={{ name: 'test-product', id: 'test-id' }}
            close={() => {
            }}
            categoryConfig={{ products: {} }}
          />
        </EmployeeGroupContext.Provider>
      </TestAppContext>,
    );
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
});
