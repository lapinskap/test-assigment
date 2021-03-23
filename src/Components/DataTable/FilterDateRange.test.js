import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import FilterDateRange from './FilterDateRange';

describe('<FilterDateRange />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  });

  it('renders correctly with props', () => {
    const format = 'dd-MM-yyy';
    const wrapper = renderer
      .create(<FilterDateRange format={format} id="test" />);

    expect(wrapper.toJSON())
      .toMatchSnapshot();
  });

  test('FROM input acts correctly on change when time select is off', () => {
    const onChangeSpy = jest.fn(({ from }) => {
      expect(from.toString()).toBe(new Date('01/01/2021').toString());
    });
    const format = 'dd-MM-yyy';

    const { container } = render(<FilterDateRange format={format} id="test" onChange={onChangeSpy} showTimeSelect={false} />);
    const input = container.querySelector('#test_from');

    fireEvent.change(input, { target: { value: '01/01/2021' } });
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  test('TO input acts correctly on change when time select is off', () => {
    const onChangeSpy = jest.fn(({ to }) => {
      expect(+to).toBe(+new Date('01/01/2021') + (24 * 60 * 60 * 1000) - 1000);
    });
    const format = 'dd-MM-yyy';

    const { container } = render(<FilterDateRange format={format} id="test" onChange={onChangeSpy} showTimeSelect={false} />);
    const input = container.querySelector('#test_to');

    fireEvent.change(input, { target: { value: '01/01/2021' } });
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  test('TO input acts correctly on change when time select is on', () => {
    const onChangeSpy = jest.fn(({ to }) => {
      expect(to.toString()).toBe(new Date('01/01/2021').toString());
    });
    const format = 'dd-MM-yyy';

    const { container } = render(<FilterDateRange format={format} id="test" onChange={onChangeSpy} showTimeSelect />);
    const input = container.querySelector('#test_to');

    fireEvent.change(input, { target: { value: '01/01/2021' } });
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  test('TO cannot be earlier than from', () => {
    const fromValue = new Date('2021-01-01');
    const onChangeSpy = jest.fn(({ to }) => {
      expect(to.toString()).toBe(fromValue.toString());
    });
    const format = 'dd-MM-yyy';

    const { container } = render(<FilterDateRange format={format} id="test" onChange={onChangeSpy} showTimeSelect value={{ from: fromValue }} />);
    const input = container.querySelector('#test_to');

    fireEvent.change(input, { target: { value: '12/31/2020' } });
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });
});
