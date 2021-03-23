import React from 'react';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import IpForm from './form';
import '../../../../../tests/setupTests';

describe('IpForm', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let isOpen; let close; let ipAddressId; let
    companyId;

  beforeEach(() => {
    companyId = 5;
    ipAddressId = 23;
    close = () => ({});
    isOpen = true;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const tree = mount(<IpForm
      companyId={companyId}
      ipAddressId={ipAddressId}
      close={close}
      isOpen={isOpen}
    />);

    expect(EnzymeToJson(tree)).toMatchSnapshot();
  });
});
