import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import CopiableField from './CopiableField';

describe('BusinessIdColumn', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('show and hide copy button', () => {
    global.document.queryCommandSupported = () => true;

    const { container } = render(<CopiableField content="1bda1322-f836-4e73-93c3-d41c92d8a7e2" label="Identyfikator" />);
    let button = container.querySelector('.copy-icon');
    expect(button).toBeNull();
    const wrapper = container.querySelector('.copiable-field');
    fireEvent.mouseEnter(wrapper);
    button = container.querySelector('.copy-icon');
    expect(button).not.toBeNull();
    fireEvent.mouseLeave(wrapper);
    button = container.querySelector('.copy-icon');
    expect(button).toBeNull();
  });

  it('fires copy command', () => {
    const execCommandSpy = jest.fn((type) => {
      expect(type).toBe('Copy');
    });
    global.document.queryCommandSupported = () => true;
    global.document.execCommand = execCommandSpy;

    const { container } = render(<CopiableField content="1bda1322-f836-4e73-93c3-d41c92d8a7e2" label="Identyfikator" />);
    const wrapper = container.querySelector('.copiable-field');
    fireEvent.mouseEnter(wrapper);
    const button = container.querySelector('.copy-icon');
    fireEvent.click(button);
    expect(execCommandSpy).toHaveBeenCalledTimes(1);
  });
});
