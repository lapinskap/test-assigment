import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Checkboxes, {
  CHECKBOXES_BUTTONS_DESELECT_ALL,
  CHECKBOXES_BUTTONS_SELECT_ALL,
} from './Checkboxes';

describe('<Autocomplete />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    const div = document.createElement('div');
    div.setAttribute('id', 'form_tooltip_option_4');
    document.body.appendChild(div);

    const wrapper = renderer
      .create(<Checkboxes
        options={[
          { label: 'Option 1', value: 'option_1' },
          { label: 'Option 2', value: 'option_2' },
          { label: 'Option 3', value: 'option_3', required: true },
          { label: 'Option 4', value: 'option_4', tooltip: { content: 'Tooltip content' } },
          { label: 'Option 5', value: 'option_5' },
          { label: 'Option 6', value: 'option_6' },
          { label: 'Option 7', value: 'option_7' },
          { label: 'Option 8', value: 'option_8' },
          { label: 'Option 9', value: 'option_9' },
          { label: 'Option 10', value: 'option_10' },
          { label: 'Option 11', value: 'option_11' },
          { label: 'Option 12', value: 'option_12' },
        ]}
        disabled={false}
        afterLabel={<div>After label test</div>}
        label="Checkbox test"
        tooltip={<div>tooltip component</div>}
        columns={2}
        id="test_id"
        validation={['required']}
        value={['option_1']}
        errorMessage={'{"option_4":"Field is required"}'}
        onChange={() => {}}
        valueFormatter="numeric"
        inline={false}
        optionSwitcher={{
          onChange: () => {},
          disableIfNotChecked: true,
          checkedByDefault: true,
          label: 'Zmień',
        }}
      />);

    expect(wrapper.toJSON())
      .toMatchSnapshot();
  });

  it('renders correctly with only some props', () => {
    const wrapper = renderer
      .create(<Checkboxes
        options={[
          { label: 'Option 1', value: 'option_1' },
          { label: 'Option 2', value: 'option_2' },
          { label: 'Option 3', value: 'option_3' },
          { label: 'Option 4', value: 'option_4' },
          { label: 'Option 5', value: 'option_5' },
          { label: 'Option 6', value: 'option_6' },
          { label: 'Option 7', value: 'option_7' },
          { label: 'Option 8', value: 'option_8' },
          { label: 'Option 9', value: 'option_9' },
          { label: 'Option 10', value: 'option_10' },
          { label: 'Option 11', value: 'option_11' },
          { label: 'Option 12', value: 'option_12' },
        ]}
        disabled={false}
        label="Checkbox test"
        id="test_id"
        validation={['required']}
        value={['option_1']}
        onChange={() => {}}
        inline
      />);

    expect(wrapper.toJSON())
      .toMatchSnapshot();
  });

  it('correctly check option', () => {
    const onChangeSpy = jest.fn((id, values) => {
      expect(values.length).toBe(1);
      expect(values[0]).toBe('option_4');
    });

    const { container } = render(<Checkboxes
      options={[
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Option 3', value: 'option_3' },
        { label: 'Option 4', value: 'option_4' },
        { label: 'Option 5', value: 'option_5' },
        { label: 'Option 6', value: 'option_6' },
        { label: 'Option 7', value: 'option_7' },
        { label: 'Option 8', value: 'option_8' },
        { label: 'Option 9', value: 'option_9' },
        { label: 'Option 10', value: 'option_10' },
        { label: 'Option 11', value: 'option_11' },
        { label: 'Option 12', value: 'option_12' },
      ]}
      valueFormatter="numeric"
      disabled={false}
      label="Checkbox test"
      id="test_id"
      value={null}
      validation={['required']}
      onChange={onChangeSpy}
    />);
    const option4 = container.querySelectorAll('input')[3];

    fireEvent.click(option4);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('correctly uncheck option', () => {
    const onChangeSpy = jest.fn((id, values) => {
      expect(values.length).toBe(0);
    });

    const { container } = render(<Checkboxes
      options={[
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Option 3', value: 'option_3' },
        { label: 'Option 4', value: 'option_4' },
        { label: 'Option 5', value: 'option_5' },
        { label: 'Option 6', value: 'option_6' },
        { label: 'Option 7', value: 'option_7' },
        { label: 'Option 8', value: 'option_8' },
        { label: 'Option 9', value: 'option_9' },
        { label: 'Option 10', value: 'option_10' },
        { label: 'Option 11', value: 'option_11' },
        { label: 'Option 12', value: 'option_12' },
      ]}
      disabled={false}
      label="Checkbox test"
      id="test_id"
      validation={['required']}
      value={['option_4']}
      onChange={onChangeSpy}
    />);
    const option4 = container.querySelectorAll('input')[3];

    fireEvent.click(option4);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('correctly use option switcher', () => {
    const onSwitcherChangeSpy = jest.fn();

    const { container } = render(<Checkboxes
      options={[
        { label: 'Option 1', value: 'option_1' },
      ]}
      disabled={false}
      label="Checkbox test"
      id="test_id"
      validation={['required']}
      value={['option_4']}
      onChange={() => {}}
      optionSwitcher={{
        onChange: onSwitcherChangeSpy,
        disableIfChecked: true,
        checkedByDefault: true,
      }}
    />);
    const input = container.querySelectorAll('input')[0];
    const switcher = container.querySelectorAll('input')[1];
    expect(input.disabled).toBe(true);

    fireEvent.click(switcher);
    expect(input.disabled).toBe(false);
    fireEvent.click(switcher);
    expect(onSwitcherChangeSpy).toHaveBeenCalledTimes(2);
    expect(input.disabled).toBe(true);
  });

  it('correctly select all options by button', () => {
    const onChangeSpy = jest.fn((id, values) => {
      expect(values.length).toBe(3);
    });

    const { container } = render(<Checkboxes
      options={[
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Option 3', value: 'option_3' },
      ]}
      label="Checkbox test"
      id="test_id"
      value={[]}
      onChange={onChangeSpy}
      buttons={CHECKBOXES_BUTTONS_SELECT_ALL}
    />);
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  }); it('correctly deselect all options by button', () => {
    const onChangeSpy = jest.fn((id, values) => {
      expect(values.length).toBe(0);
    });

    const { container } = render(<Checkboxes
      options={[
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Option 3', value: 'option_3' },
      ]}
      label="Checkbox test"
      id="test_id"
      value={['option_1', 'option_2']}
      onChange={onChangeSpy}
      buttons={CHECKBOXES_BUTTONS_DESELECT_ALL}
    />);
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });
});
