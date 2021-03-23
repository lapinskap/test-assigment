import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import InputSwitcher from './InputSwitcher';

describe('<InputSwitcher />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('act correctly on click', () => {
    const onChangeSpy = jest.fn();
    const checked = false;

    const { container } = render(<InputSwitcher checked={checked} id="test" onChange={onChangeSpy} />);
    const input = container.querySelector('input');

    fireEvent.click(input);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(!checked);
  });
});
