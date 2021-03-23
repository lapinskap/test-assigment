import React from 'react';
import renderer from 'react-test-renderer';
import Wizard from './index';
import '../../tests/setupTests';
import TestAppContext from '../../tests/TestAppContext';

describe('<Wizard />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const steps = [
      {
        component: <div>Component 1 Content</div>,
        name: 'Component 1',
      },
      {
        component: <div>Component 2 Content</div>,
        name: 'Component 2',
      },
      {
        component: <div>Component 3 Content</div>,
        name: 'Component 3',
      },
      {
        component: <div>Component 4 Content</div>,
        name: 'Component 4',
      },
    ];

    const tree = renderer
      .create((
        <TestAppContext router>
          <Wizard steps={steps} showNavigation={false} />
        </TestAppContext>
      ))
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });
});
