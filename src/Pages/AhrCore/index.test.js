import React from 'react';
import renderer from 'react-test-renderer';
import AhrRouter from './index';
import '../../tests/setupTests';
import TestAppContext from '../../tests/TestAppContext';

describe('<AhrRouter />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct snapshot with simple props', () => {
    const tree = renderer
      .create(
        <TestAppContext router>
          <AhrRouter match={{ url: '/ahr', params: {}, path: '' }} />
        </TestAppContext>,
      )
      .toJSON();
    expect(tree)
      .toMatchSnapshot();
  });
});
