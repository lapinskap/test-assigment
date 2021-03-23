/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
// import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import SidebarMenu, { isActiveItem, getActiveId } from './index';
// import TestAppContext from '../../tests/TestAppContext';
import '../../tests/setupTests';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    listen: () => ({ location: 'test' }),
  }),
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));

describe('isActiveItem()', () => {
  it('executes isActiveItem', () => {
    const item = [{ to: 'some', label: 'Some', content: [{ to: 'some employees', label: 'None' }] }];
    const pathname = '/';
    const result = isActiveItem(item, pathname);
    expect(result).toBe(false);
  });
});

describe('getActiveId', () => {
  it('executes getActiveId', () => {
    const content = [{
      id: 1, to: 'some', label: 'Some', content: [{ to: 'some employees', label: 'None' }],
    }];
    const pathname = '/';
    const result = getActiveId(content, pathname);
    expect(result).toBe(null);
  });
});

describe('<SidebarMenu />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let content;
  let
    linkId;

  beforeEach(() => {
    content = [{
      icon: 'pe-7s-diamond',
      label: 'Katalog produktów',
      to: '/product-catalog/products',
      id: 'product-catalog',
      aclKey: 'product-catalog',
    }, {
      icon: 'pe-7s-shuffle',
      label: 'Lista dostawców',
      to: '/suppliers',
      id: 'provider',
      aclKey: 'provider',
    }, {
      icon: 'pe-7s-id',
      label: 'Firma',
      id: 'company',
      aclKey: 'company',
      content: [{
        label: 'Lista firm',
        to: '/company/list',
        id: 'company_list',
        aclKey: 'company_list',
      }, {
        label: 'Pracownicy',
        to: '/company/employee-list',
        id: 'employee_list',
        aclKey: 'employee_list',
      }],
    }, {
      icon: 'pe-7s-tools',
      label: 'Administracja',
      id: 'administration',
      aclKey: 'administration',
      content: [{
        label: 'Parametry konfiguracyjne',
        to: '/administration/configuration/default/default',
        id: 'configuration',
        aclKey: 'configuration',
      }, {
        label: 'Słowniki',
        to: '/administration/dictionary',
        id: 'dictionary',
      }, {
        label: 'Konfiguracja adresów IP',
        to: '/administration/ip-security',
        id: 'ip-security',
        aclKey: 'ip-security',
      }],
    }, {
      icon: 'pe-7s-users',
      label: 'Operatorzy MB',
      to: '/user/operator/list',
      id: 'user_operator_list',
      aclKey: 'user_operator_list',
    }, {
      icon: 'pe-7s-box2',
      label: 'CMS',
      to: '/cms/management',
      id: 'cms',
      aclKey: 'cms',
    }, {
      icon: 'pe-7s-graph2',
      label: 'Raporty',
      id: 'report',
      aclKey: 'report',
      content: [{
        label: 'Wybrane benefity',
        to: '/report/chosen_subscription_benefits',
        id: 'chosen_subscription_benefits',
        aclKey: 'chosen_subscription_benefits',
      }],
    }, {
      icon: 'pe-7s-notebook',
      label: 'Tłumaczenia',
      id: 'translate',
      aclKey: 'report',
      content: [{
        label: 'Tłumaczenia interfejsu',
        to: '/translate/interface',
        id: 'translate_interface',
        aclKey: 'translate_interface',
      }, {
        label: 'Tłumaczenia wartości prostych',
        to: '/translate/simple',
        id: 'translate_simple',
        aclKey: 'translate_simple',
      }, {
        label: 'Tłumaczenia opisów',
        to: '/translate/description',
        id: 'translate_description',
        aclKey: 'translate_description',
      }, {
        label: 'Zakresy',
        to: '/translate/scopes',
        id: 'translate_scopes',
        aclKey: 'translate_scopes',
      }],
    }, {
      icon: 'pe-7s-display2',
      label: 'Standardy',
      id: 'standards',
      aclKey: 'standards',
      content: [{
        label: 'Grid filtrowalny js',
        to: '/standards/grid/filtrable-js',
        id: 'grid_filtrerable_js',
        aclKey: 'standards',
      }, {
        label: 'Grid filtrowalny backend',
        to: '/standards/grid/filtrable-backend',
        id: 'grid_filtrerable_backend',
        aclKey: 'standards',
      }, {
        label: 'Formularze',
        to: '/standards/forms',
        id: 'forms',
        aclKey: 'standards',
      }, {
        label: 'Zakładki (proste)',
        to: '/standards/tabs/simple',
        id: 'tabs_simple',
        aclKey: 'standards',
      }, {
        label: 'Zakładki (z zapamiętywaniem)',
        to: '/standards/tabs/with-memo',
        id: 'tabs_with_memo',
        aclKey: 'standards',
      }, {
        label: 'Zakładki boczne',
        to: '/standards/tabs/sidebar',
        id: 'tabs_sidebar',
        aclKey: 'standards',
      }],
    }];
    linkId = '12';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    const tree = renderer
      .create(<SidebarMenu content={content} linkId={linkId} />)
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });

  // it('should call onClick on Link', async () => {
  //   const wrapper = mount(<TestAppContext router><SidebarMenu content={content} linkId={linkId} /></TestAppContext>);
  //
  //   const toggleLink = wrapper.find('Link').at(0);
  //   const toggleSpy = jest.fn();
  //   await act(async () => {
  //     await toggleLink.simulate('click');
  //   });
  //   wrapper.update();
  //   expect(await toggleSpy).toHaveBeenCalled();
  // });
});
