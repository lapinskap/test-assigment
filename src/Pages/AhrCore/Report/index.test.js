import React from 'react';
import renderer from 'react-test-renderer';
import ReportRouter from './index';
import '../../../tests/setupTests';
import TestAppContext from '../../../tests/TestAppContext';

describe('<ReportRouter />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct snapshot with simple props', () => {
    const tree = renderer
      .create(
        <TestAppContext router>
          <ReportRouter match={{ url: '/ahr/report', params: {}, path: '' }} />
        </TestAppContext>,
      )
      .toJSON();
    expect(tree)
      .toMatchSnapshot();
  });
});
