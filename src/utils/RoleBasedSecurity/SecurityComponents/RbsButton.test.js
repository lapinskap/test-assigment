import React from 'react';
import renderer from 'react-test-renderer';
import RbsButton from './RbsButton';
import { getPermissionsWrapper } from '../../hooks/security/useHasPermission.test';

describe('<RbsButton />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when have permissions ', () => {
    const Wrapper = getPermissionsWrapper(['test1:company:company']);

    const tree = renderer
      .create(
        <Wrapper>
          <RbsButton
            permission="test1:company:company"
          />
        </Wrapper>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly when have not permissions ', () => {
    const Wrapper = getPermissionsWrapper(['test1:company:company']);

    const tree = renderer
      .create(
        <Wrapper>
          <RbsButton
            permission="random:scope"
          />
        </Wrapper>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly when have permissions and button has props', () => {
    const Wrapper = getPermissionsWrapper(['test1:company:company']);

    const tree = renderer
      .create(
        <Wrapper>
          <RbsButton
            permission="random:scope"
            className="classRandom"
          />
        </Wrapper>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
