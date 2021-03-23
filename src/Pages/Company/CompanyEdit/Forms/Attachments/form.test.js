import React from 'react';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import AttachmentForm from './form';
import '../../../../../tests/setupTests';

describe('AttachmentForm', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let isOpen; let close; let attachmentId; let
    companyId;

  beforeEach(() => {
    companyId = 5;
    attachmentId = 23;
    close = () => ({});
    isOpen = true;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const tree = mount(<AttachmentForm
      companyId={companyId}
      attachmentId={attachmentId}
      close={close}
      isOpen={isOpen}
    />);

    expect(EnzymeToJson(tree)).toMatchSnapshot();
  });
});
