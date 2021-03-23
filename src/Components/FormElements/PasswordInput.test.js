import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import PasswordInput from './PasswordInput';

describe('<PasswordInput />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('correctly changes visibility on eye click', () => {
    const { container } = render(<PasswordInput id={test} className="test" onChange={() => null} />);
    const eye = container.querySelector('.password-input-eye');
    const input = container.querySelector('input');
    expect(input.classList.contains('test')).toBeTruthy();
    expect(input.classList.contains('password-hidden-input')).toBeTruthy();

    fireEvent.click(eye);
    expect(input.classList.contains('test')).toBeTruthy();
    expect(input.classList.contains('password-hidden-input')).not.toBeTruthy();
  });

  it('respects previewToggle prop', () => {
    const { container } = render(<PasswordInput id={test} className="test" onChange={() => null} previewToggle={false} />);
    const eye = container.querySelector('.password-input-eye');
    expect(eye).toBeNull();
  });
  it('correctly fires onChange', () => {
    const onChangeSpy = jest.fn();

    const { container } = render(<PasswordInput id="test" onChange={onChangeSpy} value="1234" />);
    const input = container.querySelector('input');
    expect(input.value).toBe('1234');

    fireEvent.change(input, { target: { value: 'a' } });
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });
  it('validate on blur', () => {
    const validateFieldSpy = jest.fn();

    const { container } = render(<PasswordInput id="test" validateField={validateFieldSpy} value="1234" />);
    const input = container.querySelector('input');

    fireEvent.blur(input, { target: { value: 'a' } });
    expect(validateFieldSpy).toHaveBeenCalledTimes(1);
  });
  it('validate on change when error', () => {
    const validateFieldSpy = jest.fn();
    const onChangeSpy = jest.fn();

    const { container } = render(<PasswordInput errorMessage="error" id="test" onChange={onChangeSpy} validateField={validateFieldSpy} />);
    const input = container.querySelector('input');

    fireEvent.change(input, { target: { value: 'a' } });
    expect(validateFieldSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });
});
