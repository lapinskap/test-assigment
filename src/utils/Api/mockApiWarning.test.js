import React from 'react';
import { act, create } from 'react-test-renderer';
import ApiWarning from './mockApiWarning';
import { waitToLoadMocks } from '../../tests/helpers';

function createNodeMock() {
  return {
    getBoundingClientRect() {
      return {
        width: 100,
      };
    },
  };
}

describe('<ApiWarning />', () => {
  afterEach(() => {
    window.SKIP_TEST_MODE = false;
    jest.clearAllMocks();
  });

  it('Should render correct with isMockView true', async () => {
    let tree = null;
    await act(async () => {
      tree = create(
        <ApiWarning />, { createNodeMock },
      );
    });
    await waitToLoadMocks();

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should render with isMockView false', async () => {
    let tree = null;
    window.SKIP_TEST_MODE = true;
    await act(async () => {
      tree = create(
        <ApiWarning />, { createNodeMock },
      );
    });
    await waitToLoadMocks();

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
