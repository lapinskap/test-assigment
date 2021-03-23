import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-test-renderer';
import EnzymeToJson from 'enzyme-to-json';
import UserConfirmationPopup, { getUserConfirmationPopup } from './index';
import '../../tests/setupTests';

describe('getUserConfirmationPopup()', () => {
  it('executes getUserConfirmationPopup correctly on cancel click', () => {
    const callback = jest.fn((result) => {
      expect(result).toBe(false);
    });
    const message = 'something went wrong';
    getUserConfirmationPopup(message, callback);
    window.document.querySelectorAll('button')[0].click();
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('executes getUserConfirmationPopup correctly on confirm click', () => {
    const callback = jest.fn((result) => {
      expect(result).toBe(true);
    });
    const message = 'something went wrong';
    getUserConfirmationPopup(message, callback);

    window.document.querySelectorAll('button')[2].click();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('executes getUserConfirmationPopup without message', () => {
    const callback = (result) => {
      expect(result).toBe(true);
    };
    const message = '';
    getUserConfirmationPopup(message, callback);
  });
});

describe('<UserConfirmationPopup />', () => {
  const onCancel = () => ({});
  const onConfirm = () => ({});
  const isOpen = true;
  const title = 'Czy jesteś pewien?';
  const confirmLabel = 'Tak';
  const cancelLabel = 'Nie';
  const message = 'Czy na pewno chcesz wyknoać tę operację?';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    const tree = mount(
      <UserConfirmationPopup
        onCancel={onCancel}
        onConfirm={onConfirm}
        isOpen={isOpen}
      />,
    );

    expect(EnzymeToJson(tree))
      .toMatchSnapshot();
  });

  it('should call onCancel correctly', async () => {
    const onCancelSpy = jest.fn();
    const wrapper = shallow(
      <UserConfirmationPopup
        onCancel={onCancelSpy}
        onConfirm={onConfirm}
        isOpen={isOpen}
        title={title}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        message={message}
      />,
    );
    const popupModal = wrapper.find('Button').at(0);
    await act(async () => {
      await popupModal.simulate('click');
    });
    wrapper.update();
    expect(onCancelSpy).toHaveBeenCalled();
  });

  it('should call onConfirm correctly', async () => {
    const onConfirmSpy = jest.fn();
    const wrapper = shallow(
      <UserConfirmationPopup
        onCancel={onCancel}
        onConfirm={onConfirmSpy}
        isOpen={isOpen}
        title={title}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        message={message}
      />,
    );
    const popupModal = wrapper.find('Button').at(1);
    await act(async () => {
      await popupModal.simulate('click');
    });
    wrapper.update();
    expect(onConfirmSpy).toHaveBeenCalled();
  });
});
