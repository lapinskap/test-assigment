import React from 'react';
import renderer from 'react-test-renderer';
import ForbiddenPage from './ForbiddenPage';

describe('<ForbiddenPage />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    const tree = renderer
      .create(<ForbiddenPage
        permission="random:random"
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
