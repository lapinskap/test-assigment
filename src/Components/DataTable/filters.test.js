import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import {
  getArraySelectFilterMethod,
  dateFilterMethod,
  defaultFilterMethod,
  IntIdFilter,
  DefaultFilter,
  AutocompleteSelectFilter, SelectFilter,
} from './filters';
import '../../tests/setupTests';
import { wait } from '../../tests/helpers';

describe('filter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getArraySelectFilterMethod with no forceNumeric', () => {
    const filterMethod = getArraySelectFilterMethod();
    const id = 'test';
    expect(filterMethod({ id, value: 'option_1' }, { [id]: ['option_1', 'option_2'] })).toBe(true);
    expect(filterMethod({ id, value: 'option_3' }, { [id]: ['option_1', 'option_2'] })).toBe(false);
    expect(filterMethod({ id, value: null }, { [id]: ['option_1', 'option_2'] })).toBe(true);
    expect(filterMethod({ id, value: 'option_1' }, { [id]: null })).toBe(false);
  });

  test('getArraySelectFilterMethod with forceNumeric', () => {
    const filterMethod = getArraySelectFilterMethod(true);
    const id = 'test';
    expect(filterMethod({ id, value: '1' }, { [id]: [1, 2] })).toBe(true);
    expect(filterMethod({ id, value: '3' }, { [id]: [1, 2] })).toBe(false);
  });

  test('dateFilterMethod with no forceNumeric', () => {
    const filterMethod = dateFilterMethod;
    const id = 'test';
    expect(filterMethod({ id, value: '01/02/2020' }, { [id]: ['from', 'to'] })).toBe(true);
    expect(filterMethod({ id }, { [id]: ['from', 'to'] })).toBe(true);
    expect(filterMethod({ id, value: '03/04/1999' }, { [id]: ['03/04/1999', '03/04/1999'] })).toBe(true);
  });

  test('textCaseInsensitiveFilterMethod', () => {
    const id = 'test_field';
    expect(defaultFilterMethod({ id, value: 'Companies' }, { [id]: 'Company' })).toBe(false);
    expect(defaultFilterMethod({ id, value: 'test' }, { [id]: 'This is Test' })).toBe(true);
    expect(defaultFilterMethod({ id, value: null }, { [id]: 'Random text' })).toBe(true);
    expect(defaultFilterMethod({ id, value: 'PLOYEE' }, { [id]: 'employees' })).toBe(true);
    expect(defaultFilterMethod({ id, value: 'false' }, { [id]: false })).toBe(true);
    expect(defaultFilterMethod({ id, value: 'true' }, { [id]: false })).toBe(false);
    expect(defaultFilterMethod({ id, value: 'tom' }, { [id]: ['Adam', 'Tom'] })).toBe(true);
    expect(defaultFilterMethod({ id, value: 'Kate' }, { [id]: ['Adam', 'Tom'] })).toBe(false);
    expect(defaultFilterMethod({ id, value: 9 }, { [id]: ['9', '8'] })).toBe(true);
    expect(defaultFilterMethod({ id, value: '9' }, { [id]: [4, 9, 8] })).toBe(true);
  });

  test('DefaultFilter on change work correctly', () => {
    const onChangeSpy = jest.fn((value) => {
      expect(value).toBe('123qwe456.,()');
    });
    const { container } = render(<DefaultFilter onChange={onChangeSpy} filter={{ value: '1' }} column={{ id: 'test' }} />);
    const input = container.querySelector('input');

    fireEvent.change(input, { target: { value: '123qwe456.,()' } });
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  test('IntIdFilter accept only digits', () => {
    const onChangeSpy = jest.fn((value) => {
      expect(value).toBe('123456');
    });
    const { container } = render(<IntIdFilter onChange={onChangeSpy} filter={{ value: '1' }} column={{ id: 'test' }} />);
    const input = container.querySelector('input');

    fireEvent.change(input, { target: { value: '123qwe456.,()' } });
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  test('AutocompleteSelectFilter on change work correctly', () => {
    const onChangeSpy = jest.fn((value) => {
      expect(value).toBe(1);
    });
    const Component = AutocompleteSelectFilter([{ value: 1, label: 'test' }], false);
    const { container } = render(<Component onChange={onChangeSpy} filter={{ value: '1' }} column={{ id: 'test' }} />);
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'test' } });
    const option = container.querySelector('.gridFilterAutocomplete__option');
    fireEvent.click(option);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  test('AutocompleteSelectFilter submitting form', async () => {
    const onChangeSpy = jest.fn();
    const onSubmitSpy = jest.fn();
    const Component = AutocompleteSelectFilter([{ value: 1, label: 'test' }]);
    const { container } = render((
      <form onSubmit={onSubmitSpy}>
        <button type="submit">Submit</button>
        <Component onChange={onChangeSpy} filter={{ value: '1' }} column={{ id: 'test' }} />
      </form>
    ));
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'test' } });
    const option = container.querySelector('.gridFilterAutocomplete__option');
    fireEvent.click(option);

    await wait();
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
  });

  test('SelectFilter on change work correctly', async () => {
    const onChangeSpy = jest.fn((value) => {
      expect(value).toBe('test');
    });
    const Component = SelectFilter([{ value: 'test', label: 'Some Label' }], false);
    const { container } = render(<Component onChange={onChangeSpy} filter={{ value: '1' }} column={{ id: 'test' }} />);
    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: 'test' } });

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  test('SelectFilter submitting form', async () => {
    const onChangeSpy = jest.fn();
    const onSubmitSpy = jest.fn();
    const Component = SelectFilter([{ value: 1, label: 'test' }]);
    const { container } = render((
      <form onSubmit={onSubmitSpy}>
        <button type="submit">Submit</button>
        <Component onChange={onChangeSpy} filter={{ value: '1' }} column={{ id: 'test' }} />
      </form>
    ));
    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: 1 } });

    await wait();
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
  });
});
