import React from 'react';
import CompanyContext, { CompanyContextWrapper } from '../../Pages/Company/CompanyContext';
import __ from '../../utils/Translations';
import {
  banksBanksPermissionRead,
  catalogProductPermissionRead,
  catalogProductPermissionWrite,
  cmsDocumentPermissionRead,
  companyApplicationPermissionRead,
  companyCompanyPermissionRead,
  companyFundingPermissionRead,
  employeeAhrRolePermissionRead,
  employeeEmployeeGroupPermissionRead,
  employeeEmployeeGroupPermissionWrite,
  employeeEmployeePermissionRead,
  employeeEmployeePermissionWrite,
  employeeGroupProductConfigPermissionRead,
  employeeOrganizationUnitPermissionRead,
  employeeRentableGroupPermissionRead,
  companyTokenPermissionRead,
  subscriptionBenefitPermissionRead,
  subscriptionBenefitPermissionWrite,
  notificationAppMessagePermissionRead,
  configurationConfigurationPermissionRead, employeeRentableGroupSelectionWindowPermissionWrite,
} from '../../utils/RoleBasedSecurity/permissions';

export const getSubMenuByLocation = (location, isAhr) => {
  if (isAhr) {
    const pathRoot = location.split('/')
      .slice(0, 3)
      .join('/');
    switch (pathRoot) {
      case '/ahr/company':
        return CompanySubMenu.code;
      default:
        return false;
    }
  } else {
    const pathRoot = location.split('/')
      .slice(0, 3)
      .join('/');
    switch (pathRoot) {
      case '/company/edit':
        return CompanySubMenu.code;
      default:
        return false;
    }
  }
};

export const getSubMenuComponentByCode = (code) => {
  switch (code) {
    case CompanySubMenu.code:
      return CompanySubMenu;
    default:
      return null;
  }
};

export const CompanySubMenu = {
  code: 'company',
  getTitle: (location) => {
    const id = CompanySubMenu.getId(location);
    return (
      <CompanyContextWrapper companyId={id || ''} key={id} showError={false}>
        <div className="text-wrap">
          {__('Zarządzanie firmą')}
          <CompanyContext.Consumer>
            {({ data }) => (data && data.fullName ? `: ${data.fullName}` : '')}
          </CompanyContext.Consumer>
        </div>
      </CompanyContextWrapper>
    );
  },
  getId: (location) => location.split('/')[3],
  parent_id: 'company_list',
  getConfig: (location) => {
    const companyId = CompanySubMenu.getId(location);
    const prefix = `/company/edit/${companyId}`;
    return [
      {
        label: 'Edycja firmy',
        to: `${prefix}/data`,
        id: 'companyEdit',
        permission: companyCompanyPermissionRead,
        icon: 'pe-7s-config',
      },
      {
        label: 'Zarządzanie pracownikami',
        to: `${prefix}/employee-management`,
        id: 'employeeManagement',
        icon: 'pe-7s-user',
        content: [
          {
            label: 'Pracownicy',
            to: `${prefix}/employee-management/employees`,
            id: 'companyEmployee',
            aclKey: employeeEmployeePermissionRead,
            tileIcon: 'pe-7s-user',
          },
          {
            label: 'Administratorzy',
            to: `${prefix}/employee-management/ahr`,
            id: 'companyAhrs',
            aclKey: employeeAhrRolePermissionRead,
            tileIcon: 'pe-7s-tools',
          },
          {
            label: 'Grupy pracownicze',
            to: `${prefix}/employee-management/employee-groups`,
            id: 'employeeGroups',
            aclKey: employeeEmployeeGroupPermissionRead,
            tileIcon: 'pe-7s-users',
          },
          {
            label: 'Grupy dochodowości',
            to: `${prefix}/employee-management/rentable-groups`,
            id: 'rentableGroups',
            aclKey: employeeRentableGroupPermissionRead,
            tileIcon: 'pe-7s-users',
          },
          {
            label: 'Zarządzanie oknami grup dochodowości',
            to: `${prefix}/employee-management/rentable-group-selection-windows`,
            id: 'rentableGroupSelectionWindow',
            aclKey: employeeRentableGroupSelectionWindowPermissionWrite,
            tileIcon: 'pe-7s-photo-gallery',
          },
          {
            label: 'Jednostki organizacyjne',
            to: `${prefix}/employee-management/organization-units`,
            id: 'organization_units',
            aclKey: employeeOrganizationUnitPermissionRead,
            tileIcon: 'pe-7s-add-user',
          },
        ],
      },
      {
        label: 'Świadczenia cykliczne',
        to: `${prefix}/subscriptions`,
        id: 'subscriptionsConfig',
        icon: 'pe-7s-diamond',
        content: [
          {
            label: 'Świadczenia abonamentowe',
            to: `${prefix}/subscriptions/benefits`,
            id: 'subscriptionsBenefits',
            aclKey: subscriptionBenefitPermissionRead,
            tileIcon: 'pe-7s-diamond',
            isAnchor: true,
          },
          {
            label: 'Konfiguracja świadczeń abonamentowych',
            to: `${prefix}/subscriptions/config`,
            id: 'subscriptionsBenefitsConfig',
            aclKey: subscriptionBenefitPermissionRead,
            tileIcon: 'pe-7s-diamond',
          },
          // {
          //   label: 'Konfiguracja doładowań cyklicznych',
          //   to: `${prefix}/subscriptions/subscription-top-ups`,
          //   id: 'subscriptionsTopUps',
          //   aclKey: 'subscriptions-top-ups',
          //   tileIcon: 'pe-7s-diamond',
          // },
          {
            label: 'Formularze PDF',
            to: `${prefix}/subscriptions/pdf-forms`,
            id: 'comapnyForms',
            aclKey: subscriptionBenefitPermissionRead,
            icon: 'pe-7s-pen',
          },
        ],
      },
      {
        label: 'Zarządzanie produktami',
        to: `${prefix}/products`,
        id: 'companyProducts',
        icon: 'pe-7s-gift',
        content: [
          // Probably to delete with components
          // {
          //   label: 'Produkty zgrupowane',
          //   to: `${prefix}/products/clusters-benefits`,
          //   id: 'benefits_grouped',
          //   aclKey: 'benefits_grouped',
          //   tileIcon: 'pe-7s-plugin',
          // },
          {
            label: 'Produkty w firmie',
            to: `${prefix}/products/egp`,
            id: 'employeeGroupProducts',
            aclKey: employeeGroupProductConfigPermissionRead,
            tileIcon: 'pe-7s-diamond',
          },
        ],
      },
      {
        label: 'Akceptacje',
        to: `${prefix}/pending`,
        id: 'pending',
        icon: 'pe-7s-next',
        content: [
          {
            label: 'Benefity oczekujące',
            to: `${prefix}/pending/benefits`,
            id: 'pendingBenefits',
            aclKey: catalogProductPermissionRead,
            tileIcon: 'pe-7s-next',
          },
        ],
      },
      {
        label: 'Banki punktów',
        to: `${prefix}/banks`,
        id: 'companyBanks',
        icon: 'pe-7s-piggy',
        content: [
          {
            label: 'Konfiguracja banków punktów',
            to: `${prefix}/banks/config`,
            id: 'companyBanksConfig',
            aclKey: banksBanksPermissionRead,
            tileIcon: 'pe-7s-config',
          },
          {
            label: 'Zarządzanie bankami punktów',
            to: `${prefix}/banks/management`,
            id: 'companyBanksManagement',
            aclKey: banksBanksPermissionRead,
            tileIcon: 'pe-7s-magic-wand',
          },
        ],
      },
      {
        label: 'CMS',
        to: `${prefix}/cms/management`,
        id: 'cms',
        aclKey: cmsDocumentPermissionRead,
        icon: 'pe-7s-plugin',
      },
      {
        label: 'Zarządzanie tokenami',
        to: `${prefix}/token_management`,
        id: 'tokenManagement',
        aclKey: companyTokenPermissionRead,
        icon: 'pe-7s-lock',
      },
      {
        label: 'Wnioski',
        to: `${prefix}/application`,
        id: 'application',
        aclKey: companyApplicationPermissionRead,
        icon: 'pe-7s-drawer',
        isAnchor: true,
      },
      {
        label: 'Parametry konfiguracyjne',
        to: `${prefix}/configuration`,
        id: 'configuration',
        aclKey: configurationConfigurationPermissionRead,
        icon: 'pe-7s-config',
        isAnchor: true,
      },
      {
        icon: 'pe-7s-comment',
        label: 'Powiadomienia',
        id: 'notification',
        to: `${prefix}/notification`,
        content: [
          {
            label: 'Wiadomości wewnątrzsystemowe',
            to: `${prefix}/notification/app-messages`,
            id: 'appMessages',
            aclKey: notificationAppMessagePermissionRead,
            tileIcon: 'pe-7s-chat',
          },
        ],
      },
      {
        label: 'Importy',
        to: `${prefix}/imports`,
        id: 'imports',
        icon: 'pe-7s-download',
        content: [
          {
            label: 'Import pracowników',
            to: `${prefix}/imports/employee`,
            id: 'importsEmployee',
            aclKey: employeeEmployeePermissionWrite,
            tileIcon: 'pe-7s-add-user',
          },
          {
            label: 'Import kart sportowych',
            to: `${prefix}/imports/sport-cards`,
            id: 'importsSportCards',
            aclKey: subscriptionBenefitPermissionWrite,
            tileIcon: 'pe-7s-ball',
          },
          {
            label: 'Import rezygnacji z kart sportowych',
            to: `${prefix}/imports/resignation-sport-cards`,
            id: 'importsSportCardsResignation',
            aclKey: subscriptionBenefitPermissionWrite,
            tileIcon: 'pe-7s-config',
          },
          {
            label: 'Import numerów kart przedpłaconych',
            to: `${prefix}/imports/prepaid-cards`,
            id: 'importsPrepaidCards',
            aclKey: catalogProductPermissionWrite,
            tileIcon: 'pe-7s-credit',
          },
          {
            label: 'Import świadczeń abonamentowych',
            to: `${prefix}/imports/subscriptions`,
            id: 'importsSubscriptions',
            aclKey: 'subscriptions',
            tileIcon: 'pe-7s-diamond',
          },
          {
            label: 'Import anulacji świadczeń abonamentowych',
            to: `${prefix}/imports/resignation-subscriptions`,
            id: 'importsSubscriptionsResignation',
            aclKey: subscriptionBenefitPermissionWrite,
            tileIcon: 'pe-7s-config',
          },
          {
            label: 'Import formularzy świadczeń abonamentowych',
            to: `${prefix}/imports/forms-subscriptions`,
            id: 'importsSubscriptionsForms',
            aclKey: subscriptionBenefitPermissionWrite,
            tileIcon: 'pe-7s-note2',
          },
          {
            label: 'Import zmian numerów FK i maili',
            to: `${prefix}/imports/email-fk-changes`,
            id: 'importsEmailFkChanges',
            aclKey: employeeEmployeePermissionWrite,
            tileIcon: 'pe-7s-id',
          },
          {
            label: 'Import dezaktywacji kont pracowników',
            to: `${prefix}/imports/deactivate-employee`,
            id: 'importsDeactivateEmployee',
            aclKey: employeeEmployeePermissionWrite,
            tileIcon: 'pe-7s-delete-user',
          },
          {
            label: 'Import grup pracowniczych i grup dochodowości',
            to: `${prefix}/imports/groups`,
            id: 'importsGroups',
            aclKey: employeeEmployeeGroupPermissionWrite,
            tileIcon: 'pe-7s-users',
          },
          {
            label: 'Import zmian cech pracowników',
            to: `${prefix}/imports/change-employee-attributes`,
            id: 'importsEmployeeAttributesChanges',
            aclKey: employeeEmployeePermissionWrite,
            tileIcon: 'pe-7s-magic-wand',
          },
          {
            label: 'Import dofinansowań',
            to: `${prefix}/imports/fundings`,
            id: 'importsFundings',
            aclKey: companyFundingPermissionRead,
            tileIcon: 'pe-7s-cash',
          },
        ],
      },
      // Probably to delete with components
      // {
      //   label: 'Przedawnione',
      //   to: `${prefix}/legacy`,
      //   id: 'legacy',
      //   aclKey: 'legacy',
      //   icon: 'pe-7s-close',
      //   content: [
      //     {
      //       label: 'Blokady banków',
      //       to: `${prefix}/legacy/bank-blockade`,
      //       id: 'bank_blockade',
      //       aclKey: 'legacy',
      //       tileIcon: 'pe-7s-piggy',
      //     },
      //     {
      //       label: 'Pola przedawnione',
      //       to: `${prefix}/legacy/legacy-data`,
      //       id: 'legacy',
      //       aclKey: 'legacy',
      //       tileIcon: 'pe-7s-shield',
      //     },
      //     {
      //       label: 'Edycja menu',
      //       to: `${prefix}/legacy/edit-menu`,
      //       id: 'edit_menu',
      //       aclKey: 'legacy',
      //       tileIcon: 'pe-7s-menu',
      //     },
      //     {
      //       label: 'Personalizacja systemu',
      //       to: `${prefix}/legacy/system-personalization`,
      //       id: 'system_personalization',
      //       aclKey: 'legacy',
      //       tileIcon: 'pe-7s-flag',
      //     },
      //     {
      //       label: 'Konf. świadczeń cyklicznych',
      //       to: `${prefix}/legacy/periodic-services-configuration`,
      //       id: 'periodic_services_configuration',
      //       aclKey: 'legacy',
      //       tileIcon: 'pe-7s-config',
      //     },
      //   ],
      // },
    ];
  },
};
