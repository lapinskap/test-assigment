import React from 'react';
import { mount } from 'enzyme';
import Wysiwyg from './Wysiwyg';
import '../../tests/setupTests';

describe('<Wysiwyg />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('works correctly onFocus and onMode', () => {
    const getDataSpy = jest.fn(() => 'test content');
    const validationSpy = jest.fn(() => {});
    const removeListenerSpy = jest.fn();
    const attachListenerSpy = jest.fn((editable, type, callback) => {
      callback();
      return {
        removeListener: removeListenerSpy,
      };
    });

    const eventMock = {
      editor: {
        mode: 'source',
        editable() {
          return {
            attachListener: attachListenerSpy,
          };
        },
        getData: getDataSpy,
      },
    };

    const onChangeSpy = jest.fn();

    const wrapper = mount(<Wysiwyg
      id="test_wysiwig"
      label="Random Wysiwyg"
      belowLabelComponent={<div>TEST</div>}
      translatorTrigger={null}
      value="Some data"
      validateField={validationSpy}
      disabled={false}
      onChange={onChangeSpy}
      tooltip={null}
    />);

    wrapper.find('CKEditor').prop('onChange')(eventMock);
    expect(removeListenerSpy).not.toHaveBeenCalled();
    expect(getDataSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledTimes(1);

    wrapper.update();

    wrapper.find('CKEditor').prop('onMode')(eventMock);
    expect(attachListenerSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledTimes(2);
    expect(getDataSpy).toHaveBeenCalledTimes(2);
  });
});
