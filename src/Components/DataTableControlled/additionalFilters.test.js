import React from 'react';
import renderer from 'react-test-renderer';
import {
  render, fireEvent,
} from '@testing-library/react';
import AdditionalFilters from './additionalFilters';
import '../../tests/setupTests';

describe('<AdditionalFilters />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const tree = renderer
      .create((
        <AdditionalFilters
          onFilteredChange={() => {
          }}
          currentFilters={[{ id: 'test_select', value: '2' }]}
          filtersConfig={[
            {
              type: 'text',
              label: 'Test Text Filter',
              id: 'test_text',
            },
            {
              type: 'select',
              label: 'Test Select Filter',
              id: 'test_select',
              options: [{
                value: '1',
              }, {
                label: 'Option 2',
                value: '2',
              }],
            },
          ]}
        />
      ))
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });

  it('correctly changed filters', async () => {
    const onFilteredChangeSpy = jest.fn();
    const { container } = render((
      <AdditionalFilters
        onFilteredChange={onFilteredChangeSpy}
        currentFilters={[{ id: 'test_select', value: '2' }]}
        filtersConfig={[
          {
            type: 'text',
            label: 'Test Text Filter',
            id: 'test_text',
          },
          {
            type: 'select',
            label: 'Test Select Filter',
            id: 'test_select',
            options: [{
              value: '1',
            }, {
              label: 'Option 2',
              value: '2',
            }],
          },
        ]}
      />
    ));

    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '1' } });
    expect(onFilteredChangeSpy).toHaveBeenCalledTimes(1);

    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: '1' } });
    expect(onFilteredChangeSpy).toHaveBeenCalledTimes(2);
  });
});
