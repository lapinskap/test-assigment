import React from 'react';
import renderer from 'react-test-renderer';
import { getPermissionsWrapper } from '../../hooks/security/useHasPermission.test';
import SecurityWrapper from './SecuirityWrapper';

describe('<RbsButton />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when have permissions ', () => {
    const Wrapper = getPermissionsWrapper(['test1:company:company']);
    const tree = renderer
      .create(
        <Wrapper>
          <SecurityWrapper
            permission="test1:company:company"
          >
            <div>content</div>
          </SecurityWrapper>
        </Wrapper>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders nothing when have not permissions ', () => {
    const Wrapper = getPermissionsWrapper(['test1:company:company']);

    const tree = renderer
      .create(
        <Wrapper>
          <SecurityWrapper
            permission="random:scope"
          >
            <div>content</div>
          </SecurityWrapper>
        </Wrapper>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders disabled content nothing when have not permissions and disable props', () => {
    const Wrapper = getPermissionsWrapper(['test1:company:company']);

    const tree = renderer
      .create(
        <Wrapper>
          <SecurityWrapper
            disable
            permission="random:scope"
          >
            <div>content</div>
          </SecurityWrapper>
        </Wrapper>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
