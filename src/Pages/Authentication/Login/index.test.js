import React from 'react';
import renderer from 'react-test-renderer';
import Login from './index';
import '../../../tests/setupTests';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path',
  }),
  // eslint-disable-next-line react/prop-types,react/jsx-props-no-spreading
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
jest.mock('reactstrap', () => ({
  ...jest.requireActual('reactstrap'),
  Tooltip: () => <div>Tooltip mock</div>,
}));
describe('<Login />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render correct in default state', () => {
    const tree = renderer
      .create(<Login />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
