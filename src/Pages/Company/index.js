import React from 'react';
import { Route } from 'react-router-dom';

// Pages
import { match as matchPropTypes, location as locationPropTypes } from 'react-router-prop-types';
import PropType from 'prop-types';
import CompanyList from './CompanyList';
import CompanyCreate from './CompanyCreate';
import CompanyEdit from './CompanyEdit';
import OrganizationUnits from './EmployeeManagement/OrganizationUnits/List';
import OrganizationUnitsEdit from './EmployeeManagement/OrganizationUnits/Edit';
import CompanyEmployeesList from './EmployeeManagement/CompanyEmployees/List';
import CompanyEmployeesEdit from './EmployeeManagement/CompanyEmployees/Edit';
import GroupsEmployeesList from './EmployeeManagement/GroupsEmployee/List';
import GroupsEmployeesEdit from './EmployeeManagement/GroupsEmployee/Edit';
import GroupsRentableList from './EmployeeManagement/GroupsRentable/List';
import GroupsRentableEdit from './EmployeeManagement/GroupsRentable/Edit';
import RentableGroupsWindowList from './EmployeeManagement/RentableGroupsWindow/List';
import RentableGroupsWindowEdit from './EmployeeManagement/RentableGroupsWindow/Edit';
import Ahr from './EmployeeManagement/CompanyAhr';
import AhrGroupsForm from './EmployeeManagement/CompanyAhr/Forms/AhrRoles/form';
import PendingBenefits from './Pending/BenefitsPending';
import BenefitsClustersList from './Products/BenefitsClusters/List';
import BenefitsClustersEdit from './Products/BenefitsClusters/Edit';
import EmployeeGroupsProducts from './Products/EmployeeGroupsProducts';
import PdfFormsListing from './PdfForms/Listing';
import PdfFormsEdit from './PdfForms/Edit';
import Subscriptions from './Products/Subscriptions';
import EditBenefit from './Products/Subscriptions/EditBenefit';
import EditBenefitEmployeeGroup from './Products/Subscriptions/EditBenefitEmployeeGroup';
import SubscriptionBenefitsConfig from './Products/SubscriptionsConfig/subscriptionBenefitsConfig';
import SubscriptionTopUps from './Products/SubscriptionsConfig/subscriptionTopUps';
import CmsManagement from './Cms/index';
import ApplicationList from './Application/List';
import ApplicationEdit from './Application/Edit';
import ImportEmployee from './Imports/Forms/Employee';
import ImportChanges from './Imports/Forms/Changes';
import ImportDeactivateEmployee from './Imports/Forms/DeactivateEmployee';
import ImportEmployeeAttributesChanges from './Imports/Forms/EmployeeAttributesChanges';
import ImportFundings from './Imports/Forms/Fundings';
import ImportGroups from './Imports/Forms/Groups';
import ImportPrepaidCards from './Imports/Forms/PrepaidCards';
import ImportSportCards from './Imports/Forms/SportCards';
import ImportSportCardsResignation from './Imports/Forms/SportCardsResignation';
import ImportSubscriptions from './Imports/Forms/Subscriptions';
import ImportSubscriptionsForms from './Imports/Forms/SubscriptionsForms';
import ImportSubscriptionsResignation from './Imports/Forms/SubscriptionsResignation';
import EditMenu from './Legacy/EditMenu';
import BankBlockade from './Legacy/BankBlockade';
import LegacyData from './Legacy/LegacyData';
import SystemPersonalization from './Legacy/SystemPersonalization';
import PeriodicServicesConf from './Legacy/PeriodicServicesConf';
import TokenManagement from './TokenManagement';
import EmployeeList from './EmployeeList';
import TilesMenu from '../../Components/TilesMenu';
import { CompanySubMenu } from '../../Layout/AppNav/SubMenuItems';
import { getCompanyBaseBreadcrumbs, rootBreadcrumb } from './routerHelper';
import BanksConfig from './CompanyBanks/Config';
import BankManagementListing from './CompanyBanks/Management/listingPage';
import BankManagementEdit from './CompanyBanks/Management/editPage';
import { MainNav } from '../../Layout/AppNav/NavItems';
import { CompanyContextWrapper, useCompanyName } from './CompanyContext';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import {
  banksBanksPermissionRead,
  catalogProductPermissionRead,
  catalogProductPermissionWrite,
  cmsDocumentPermissionRead,
  companyApplicationPermissionRead,
  companyCompanyPermissionRead,
  companyCompanyPermissionWrite,
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
  configurationConfigurationPermissionRead,
  employeeRentableGroupSelectionWindowPermissionRead,
  subscriptionBenefitEmployeeGroupPermissionRead,
  subscriptionPdfFormFilePermissionRead,
  subscriptionEmployeeSubscriptionItemAccept,
} from '../../utils/RoleBasedSecurity/permissions';
import AppMessagesList from './Notification/AppMessages/List';
import AppMessagesEdit from './Notification/AppMessages/Edit';
import Configuration from './Configuration';

const Company = ({ match, location }) => {
  const companyId = CompanySubMenu.getId(location.pathname);
  return (
    <>
      <Route
        exact
        path={`${match.url}`}
        render={() => (
          <TilesMenu
            config={MainNav.find((el) => el.id === 'company').content}
            title="Firma"
            breadcrumbs={[]}
          />
        )}
      />
      <SecureRoute permission={companyCompanyPermissionRead} exact path={`${match.url}/list`} component={CompanyList} />
      <SecureRoute
        permission={companyCompanyPermissionWrite}
        path={`${match.url}/list/create`}
        component={CompanyCreate}
      />
      <SecureRoute
        permission={employeeEmployeePermissionRead}
        path={`${match.url}/employee-list`}
        component={EmployeeList}
      />
      <CompanyContextWrapper companyId={companyId || ''} key={companyId}>
        <Route
          exact
          path={`${match.url}/edit/:companyId`}
          render={() => <RootCompanyTilesMenu location={location} />}
        />
        <SecureRoute
          permission={companyCompanyPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/data`}
          component={CompanyEdit}
        />
        <Route
          exact
          path={`${match.url}/edit/:companyId/employee-management`}
          render={() => (
            <CompanyTilesMenu
              id="employeeManagement"
              title="Zarządzanie pracownikami"
              location={location}
            />
          )}
        />
        <SecureRoute
          permission={employeeEmployeePermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/employees`}
          component={CompanyEmployeesList}
        />
        <SecureRoute
          permission={employeeEmployeePermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/employees/:employeeId`}
          component={CompanyEmployeesEdit}
        />
        <SecureRoute
          permission={employeeRentableGroupPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/rentable-groups`}
          component={GroupsRentableList}
        />
        <SecureRoute
          permission={employeeRentableGroupPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/rentable-groups/:groupId`}
          component={GroupsRentableEdit}
        />
        <SecureRoute
          permission={employeeRentableGroupSelectionWindowPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/rentable-group-selection-windows`}
          component={RentableGroupsWindowList}
        />
        <SecureRoute
          permission={employeeRentableGroupSelectionWindowPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/rentable-group-selection-windows/:windowId`}
          component={RentableGroupsWindowEdit}
        />
        <SecureRoute
          permission={employeeEmployeeGroupPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/employee-groups`}
          component={GroupsEmployeesList}
        />
        <SecureRoute
          permission={employeeEmployeeGroupPermissionRead}
          path={`${match.url}/edit/:companyId/employee-management/employee-groups/:groupId`}
          component={GroupsEmployeesEdit}
        />
        <SecureRoute
          permission={employeeOrganizationUnitPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/organization-units`}
          component={OrganizationUnits}
        />
        <SecureRoute
          permission={employeeOrganizationUnitPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/organization-units/:unitId`}
          component={OrganizationUnitsEdit}
        />
        <SecureRoute
          permission={employeeAhrRolePermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/ahr`}
          component={Ahr}
        />
        <SecureRoute
          permission={employeeAhrRolePermissionRead}
          exact
          path={`${match.url}/edit/:companyId/employee-management/ahr-roles/:id`}
          component={AhrGroupsForm}
        />
        <SecureRoute
          permission={catalogProductPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/products`}
          render={() => (
            <CompanyTilesMenu id="companyProducts" title="Zarządzanie produktami" location={location} />)}
        />
        <SecureRoute
          permission={catalogProductPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/products/clusters-benefits`}
          component={BenefitsClustersList}
        />
        <SecureRoute
          permission={catalogProductPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/products/clusters-benefits/:clusterId`}
          component={BenefitsClustersEdit}
        />
        <SecureRoute
          permission={employeeGroupProductConfigPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/products/egp`}
          component={EmployeeGroupsProducts}
        />

        <Route
          exact
          path={`${match.url}/edit/:companyId/subscriptions`}
          render={() => (
            <CompanyTilesMenu
              id="subscriptionsConfig"
              title="Zarządzanie świadczeniami cyklicznymi"
              location={location}
            />
          )}
        />
        <SecureRoute
          permission={subscriptionBenefitPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/subscriptions/benefits`}
          component={Subscriptions}
        />
        <SecureRoute
          permission={subscriptionBenefitEmployeeGroupPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/subscriptions/benefits/:employeeGroupId`}
          component={Subscriptions}
        />
        <SecureRoute
          permission={subscriptionBenefitPermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/subscriptions/benefits/new/:benefitGroupId`}
          component={EditBenefit}
        />
        <SecureRoute
          permission={subscriptionBenefitPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/subscriptions/benefits/editEmployeeGroup/:benefitEmployeeGroupId`}
          component={EditBenefitEmployeeGroup}
        />
        <SecureRoute
          permission={subscriptionBenefitPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/subscriptions/benefits/edit/:benefitId`}
          component={EditBenefit}
        />
        {/* <SecureRoute */}
        {/*  permission={subscriptionBenefitPermissionRead} */}
        {/*  exact */}
        {/*  path={`${match.url}/edit/:companyId/subscriptions/config`} */}
        {/*  component={SubscriptionBenefitsConfig} */}
        {/* /> */}
        <SecureRoute
          exact
          permission={subscriptionBenefitPermissionRead}
          path={`${match.url}/edit/:companyId/subscriptions/config/:employeeGroupId?`}
          component={SubscriptionBenefitsConfig}
        />
        <SecureRoute
          permission={subscriptionBenefitPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/subscriptions/subscription-top-ups`}
          component={SubscriptionTopUps}
        />
        <SecureRoute
          permission={subscriptionPdfFormFilePermissionRead}
          exact
          path={`${match.url}/edit/:companyId/subscriptions/pdf-forms`}
          component={PdfFormsListing}
        />
        <SecureRoute
          permission={subscriptionPdfFormFilePermissionRead}
          exact
          path={`${match.url}/edit/:companyId/subscriptions/pdf-forms/:pdfFormId`}
          component={PdfFormsEdit}
        />

        <SecureRoute
          permission={catalogProductPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/pending`}
          render={() => (<CompanyTilesMenu id="pending" title="Akceptacje" location={location} />)}
        />
        <SecureRoute
          permission={subscriptionEmployeeSubscriptionItemAccept}
          exact
          path={`${match.url}/edit/:companyId/pending/benefits`}
          component={PendingBenefits}
        />

        <Route
          exact
          path={`${match.url}/edit/:companyId/banks`}
          render={() => (<CompanyTilesMenu id="companyBanks" title="Banki punktów" location={location} />)}
        />
        <SecureRoute
          permission={banksBanksPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/banks/config`}
          component={BanksConfig}
        />
        <SecureRoute
          permission={banksBanksPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/banks/management`}
          component={BankManagementListing}
        />
        <SecureRoute
          permission={banksBanksPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/banks/management/:bankId`}
          component={BankManagementEdit}
        />

        <SecureRoute
          permission={cmsDocumentPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/cms/management`}
          component={CmsManagement}
        />
        <SecureRoute
          permission={cmsDocumentPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/cms/management/:employeeGroupId`}
          component={CmsManagement}
        />

        <SecureRoute
          permission={companyApplicationPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/application`}
          component={ApplicationList}
        />
        <SecureRoute
          permission={companyApplicationPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/application/:applicationId`}
          component={ApplicationEdit}
        />
        <SecureRoute
          exact
          permission={configurationConfigurationPermissionRead}
          path={`${match.url}/edit/:companyId/configuration`}
          component={Configuration}
        />
        <SecureRoute
          exact
          permission={configurationConfigurationPermissionRead}
          path={`${match.url}/edit/:companyId/configuration/:employeeGroupId`}
          component={Configuration}
        />
        <Route
          exact
          path={`${match.url}/edit/:companyId/notification`}
          render={() => (<CompanyTilesMenu id="notification" title="Powiadomienia" location={location} />)}
        />
        <SecureRoute
          permission={notificationAppMessagePermissionRead}
          exact
          path={`${match.url}/edit/:companyId/notification/app-messages`}
          component={AppMessagesList}
        />
        <SecureRoute
          permission={notificationAppMessagePermissionRead}
          exact
          path={`${match.url}/edit/:companyId/notification/app-messages/:appMessageId`}
          component={AppMessagesEdit}
        />

        <Route
          exact
          path={`${match.url}/edit/:companyId/imports`}
          render={() => (<CompanyTilesMenu id="imports" title="Importy" location={location} />)}
        />
        <SecureRoute
          permission={employeeEmployeePermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/employee`}
          component={ImportEmployee}
        />
        <SecureRoute
          permission={subscriptionBenefitPermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/sport-cards`}
          component={ImportSportCards}
        />
        <SecureRoute
          permission={subscriptionBenefitPermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/resignation-sport-cards`}
          component={ImportSportCardsResignation}
        />
        <SecureRoute
          permission={catalogProductPermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/prepaid-cards`}
          component={ImportPrepaidCards}
        />
        <SecureRoute
          permission={subscriptionBenefitPermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/subscriptions`}
          component={ImportSubscriptions}
        />
        <SecureRoute
          permission={subscriptionBenefitPermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/resignation-subscriptions`}
          component={ImportSubscriptionsResignation}
        />
        <SecureRoute
          permission={subscriptionBenefitPermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/forms-subscriptions`}
          component={ImportSubscriptionsForms}
        />
        <SecureRoute
          permission={employeeEmployeePermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/email-fk-changes`}
          component={ImportChanges}
        />
        <SecureRoute
          permission={employeeEmployeePermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/deactivate-employee`}
          component={ImportDeactivateEmployee}
        />
        <SecureRoute
          permission={employeeEmployeeGroupPermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/groups`}
          component={ImportGroups}
        />
        <SecureRoute
          permission={employeeEmployeePermissionWrite}
          exact
          path={`${match.url}/edit/:companyId/imports/change-employee-attributes`}
          component={ImportEmployeeAttributesChanges}
        />
        <SecureRoute
          permission={companyFundingPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/imports/fundings`}
          component={ImportFundings}
        />

        <SecureRoute
          permission={companyTokenPermissionRead}
          exact
          path={`${match.url}/edit/:companyId/token_management`}
          component={TokenManagement}
        />

        <Route
          exact
          path={`${match.url}/edit/:companyId/legacy`}
          render={() => (<CompanyTilesMenu id="legacy" title="Przedawnione" location={location} />)}
        />
        <Route exact path={`${match.url}/edit/:companyId/legacy/edit-menu`} component={EditMenu} />
        <Route exact path={`${match.url}/edit/:companyId/legacy/bank-blockade`} component={BankBlockade} />
        <Route exact path={`${match.url}/edit/:companyId/legacy/legacy-data`} component={LegacyData} />
        <Route
          exact
          path={`${match.url}/edit/:companyId/legacy/system-personalization`}
          component={SystemPersonalization}
        />
        <Route
          exact
          path={`${match.url}/edit/:companyId/legacy/periodic-services-configuration`}
          component={PeriodicServicesConf}
        />
      </CompanyContextWrapper>
    </>
  );
};

const RootCompanyTilesMenu = ({
  location,
}) => {
  const companyName = useCompanyName();
  const config = CompanySubMenu.getConfig(location.pathname);
  const id = CompanySubMenu.getId(location.pathname);
  return (
    <TilesMenu
      pushToHistory
      config={config}
      title={`Zarządzanie firmą ${companyName} (ID: ${id})`}
      breadcrumbs={[rootBreadcrumb, { title: 'Lista firm', link: '/company/list' }]}
    />
  );
};

const CompanyTilesMenu = ({
  id, title, location,
}) => {
  const companyName = useCompanyName();
  const config = CompanySubMenu.getConfig(location.pathname);
  const companyId = CompanySubMenu.getId(location.pathname);
  const baseBreadcrumbs = getCompanyBaseBreadcrumbs(companyId, companyName);
  return (
    <TilesMenu
      config={config.find((el) => el.id === id).content}
      title={title}
      breadcrumbs={baseBreadcrumbs}
    />
  );
};

export default Company;
Company.propTypes = {
  match: matchPropTypes.isRequired,
  location: locationPropTypes.isRequired,
};

CompanyTilesMenu.propTypes = {
  id: PropType.string.isRequired,
  title: PropType.string.isRequired,
  location: locationPropTypes.isRequired,
};
RootCompanyTilesMenu.propTypes = {
  location: locationPropTypes.isRequired,
};
