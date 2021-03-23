import React from 'react';
import { mount } from 'enzyme';
import Index from './index';
import '../../../../tests/setupTests';
import TestAppContext from '../../../../tests/TestAppContext';
import { deleteSession, initSession } from '../../../../utils/RoleBasedSecurity/Session';
import { waitToLoadMocks } from '../../../../tests/helpers';

describe('egp listing', () => {
  beforeEach(() => {
    initSession();
  });
  afterEach(() => {
    deleteSession();
  });

  it('renders without crashing', async () => {
    initSession();
    const wrapper = mount(
      <TestAppContext redux router>
        <Index match={{ params: { companyId: 'a43275e4-eeb2-11ea-adc1-0242ac1200021' } }} />
      </TestAppContext>,
    );
    await waitToLoadMocks();
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
});
