import React from 'react';
import renderer from 'react-test-renderer';
// import '../../tests/setupTests';
import {
  getLayout, LAYOUT_THREE_COLUMNS, LAYOUT_TWO_COLUMNS, LAYOUT_ONE_COLUMN,
} from './index';

describe('<Tiles />', () => {
  const getChildrenNumber = (numberOfElements) => [...Array(numberOfElements).keys()].map((el) => (
    <div key={el}>
      test
      {el}
    </div>
  ));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns nothing on wrong layout name', () => {
    global.console = { error: jest.fn() };
    const result = getLayout('wrong_layout_name', getChildrenNumber(10));
    expect(result)
      .toBe(null);
    expect(console.error)
      .toBeCalledTimes(1);
  });

  it('renders correctly 2 columns layout', () => {
    expect(renderer
      .create(getLayout(LAYOUT_TWO_COLUMNS, getChildrenNumber(10), { sm: 4, md: 4, lg: 4 }))
      .toJSON())
      .toMatchSnapshot();
    expect(renderer
      .create(getLayout(LAYOUT_TWO_COLUMNS, getChildrenNumber(10), { sm: [3, 7], md: [5, 5], lg: [4, 2] }))
      .toJSON())
      .toMatchSnapshot();
  });

  it('renders correctly 1 columns layout with border', () => {
    expect(renderer
      .create(getLayout(LAYOUT_ONE_COLUMN, getChildrenNumber(10), {}, 'key_1', true))
      .toJSON())
      .toMatchSnapshot();
    expect(renderer
      .create(getLayout(LAYOUT_ONE_COLUMN, getChildrenNumber(10), { sm: [12], md: [12], lg: [12] }, 'key_1', true))
      .toJSON())
      .toMatchSnapshot();
  });

  it('renders correctly 3 columns layout', () => {
    expect(renderer
      .create(getLayout(LAYOUT_THREE_COLUMNS, getChildrenNumber(10), { sm: [4, 4, 4], md: [4, 4, 4], lg: [3, 3, 4] }, 'key_1'))
      .toJSON())
      .toMatchSnapshot();
    expect(renderer
      .create(getLayout(LAYOUT_THREE_COLUMNS, getChildrenNumber(10), { sm: 4, md: 3, lg: 4 }, 'key_1'))
      .toJSON())
      .toMatchSnapshot();
  });

  it('renders null when no children', () => {
    const Layout = getLayout(LAYOUT_THREE_COLUMNS, [], {}, 'key_1');
    const tree = renderer
      .create(Layout)
      .toJSON();
    expect(tree)
      .toMatchSnapshot();
  });
});
