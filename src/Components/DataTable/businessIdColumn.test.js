import React from 'react';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import { fireEvent, render } from '@testing-library/react';
import BusinessIdColumn from './businessIdColumn';
import '../../tests/setupTests';

describe('BusinessIdColumn', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount((
      <BusinessIdColumn column={{ id: 'id' }} row={{ _original: { id: '1bda1322-f836-4e73-93c3-d41c92d8a7e2' } }} />
    ));
    expect(EnzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('show and hide copy button', () => {
    global.document.queryCommandSupported = () => true;

    const { container } = render(<BusinessIdColumn column={{ id: 'id' }} row={{ _original: { id: '1bda1322-f836-4e73-93c3-d41c92d8a7e2' } }} />);
    let button = container.querySelector('.business-id-copy');
    expect(button).toBeNull();
    const wrapper = container.querySelector('.business-id-column');
    fireEvent.mouseEnter(wrapper);
    button = container.querySelector('.business-id-copy');
    expect(button).not.toBeNull();
    fireEvent.mouseLeave(wrapper);
    button = container.querySelector('.business-id-copy');
    expect(button).toBeNull();
  });

  it('fires copy command', () => {
    const execCommandSpy = jest.fn((type) => {
      expect(type).toBe('Copy');
    });
    global.document.queryCommandSupported = () => true;
    global.document.execCommand = execCommandSpy;

    const { container } = render(<BusinessIdColumn column={{ id: 'id' }} row={{ _original: { id: '2bda1322-f836-4e73-93c3-d41c92d8a7e2' } }} />);
    const wrapper = container.querySelector('.business-id-column');
    fireEvent.mouseEnter(wrapper);
    const button = container.querySelector('.business-id-copy');
    fireEvent.click(button);
    expect(execCommandSpy).toHaveBeenCalledTimes(1);
  });
});
