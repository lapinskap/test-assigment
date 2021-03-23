import React from 'react';
import renderer from 'react-test-renderer';
import TilesMenu from './index';
import '../../tests/setupTests';
import TestAppContext from '../../tests/TestAppContext';

jest.mock('react-transition-group', () => ({
  ...jest.requireActual('react-transition-group'),
  // eslint-disable-next-line react/prop-types
  CSSTransitionGroup: ({ children }) => <div>{children}</div>,
}));

describe('<TilesMenu />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct snapshot with simple props', () => {
    const config = [
      {
        id: 'test_1',
        to: '/step1/step2/test_1',
        label: 'Test 1',
        icon: 'icon_1',
      },
      {
        id: 'test_2',
        to: '/step1/step2/test_2',
        label: 'Test 2',
        icon: 'icon_2',
      },
    ];
    const tree = renderer
      .create(
        <TestAppContext router redux>
          <TilesMenu
            config={config}
            title="test title"
            breadcrumbs={[
              { title: 'Step 1', link: '/step1' },
              { title: 'Step 2', link: '/step1/step2' },
            ]}
          />
        </TestAppContext>,
      )
      .toJSON();
    expect(tree)
      .toMatchSnapshot();
  });
});
