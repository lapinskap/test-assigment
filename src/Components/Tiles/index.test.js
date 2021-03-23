import React from 'react';
import EnzymeToJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import Tiles from './index';
import '../../tests/setupTests';

describe('<Tiles />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct snapshot with simple selected value', () => {
    const onTileClickSpy = jest.fn((id) => {
      expect(id).toBe('test_1');
    });
    const config = [
      {
        id: 'test_1',
        label: 'Test 1',
        icon: 'icon_1',
      },
      {
        id: 'test_2',
        label: 'Test 2',
        icon: 'icon_2',
      },
    ];
    const wrapper = shallow(<Tiles config={config} selected="test_1" onTileClick={onTileClickSpy} />);

    wrapper.find('.widget-chart').at(0).prop('onClick')();
    expect(onTileClickSpy).toHaveBeenCalledTimes(1);
    expect(EnzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('renders correct snapshot with array selected value', () => {
    const config = [
      {
        id: 'test_1',
        label: 'Test 1',
        icon: 'icon_1',
      },
      {
        id: 'test_2',
        label: 'Test 2',
        icon: 'icon_2',
      },
    ];
    const wrapper = shallow(<Tiles config={config} selected={['test_1']} />);
    expect(wrapper.find('.widget-chart').at(0).prop('onClick')).toBe(null);
    expect(EnzymeToJson(wrapper)).toMatchSnapshot();
  });
});
