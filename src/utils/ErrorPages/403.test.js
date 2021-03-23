import React from 'react';
import renderer from 'react-test-renderer';
import ForbiddenErrorPage from './403';
import '../../tests/setupTests';

describe('<ForbiddenErrorPage />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const tree = renderer.create(<ForbiddenErrorPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
