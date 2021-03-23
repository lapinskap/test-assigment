import React from 'react';
import { mount } from 'enzyme';
import Index from './index';
import '../../../../../tests/setupTests';
import TestAppContext from '../../../../../tests/TestAppContext';
import { initSession, deleteSession } from '../../../../../utils/RoleBasedSecurity/Session';

describe('Rentable group edit', () => {
  afterEach(() => {
    jest.clearAllMocks();
    deleteSession();
  });

  it('renders without crashing', async () => {
    initSession();
    const wrapper = mount(
      <TestAppContext redux router rbs>
        <Index match={{ params: { companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021' } }} />
      </TestAppContext>,
    );
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
});
