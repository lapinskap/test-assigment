import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Pagination from './pagination';
import '../../tests/setupTests';

describe('<DataTableControlled />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const tree = renderer
      .create(<Pagination
        pages={1}
        pageSize={10}
        availablePageSizes={[10, 20]}
        onPageSizeChange={() => {}}
        onPageChange={() => {}}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly fires methods', () => {
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();

    const wrapper = shallow(<Pagination
      pages={3}
      pageSize={10}
      availablePageSizes={[10, 20]}
      onPageSizeChange={onPageSizeChange}
      onPageChange={onPageChange}
    />);

    const previousButton = wrapper.find('button').at(0);
    const nextButton = wrapper.find('button').at(1);
    const input = wrapper.find('input');
    const select = wrapper.find('select');

    previousButton.simulate('click');
    expect(onPageChange).toHaveBeenCalledTimes(1);
    nextButton.simulate('click');
    expect(onPageChange).toHaveBeenCalledTimes(2);
    input.prop('onChange')({ target: { value: 2 } });
    expect(onPageChange).toHaveBeenCalledTimes(3);
    select.prop('onChange')({ target: { value: 2 } });
    expect(onPageSizeChange).toHaveBeenCalledTimes(1);
  });
});
