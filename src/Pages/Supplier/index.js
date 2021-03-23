import React from 'react';
// Pages
import { match as matchPropTypes } from 'react-router-prop-types';
import List from './List';
import EditSupplier from '../Tourism/listOfSuppliers/editSupplier';
import SecureRoute from '../../utils/RoleBasedSecurity/SecurityComponents/SecureRoute';
import PdfFormsEdit from '../Tourism/listOfSuppliers/editSupplier/PdfForms/Edit';
import {
  subscriptionPdfFormFilePermissionRead,
  tourismTourismObjectPermissionRead,
} from '../../utils/RoleBasedSecurity/permissions';

const Provider = ({ match }) => (
  <>
    <SecureRoute permission={tourismTourismObjectPermissionRead} exact path={`${match.url}`} component={List} />
    <SecureRoute
      permission={tourismTourismObjectPermissionRead}
      path={`${match.url}/edit/:supplierId`}
      exact
      component={EditSupplier}
      heading="Edytuj dostawcę"
    />
    <SecureRoute
      permission={subscriptionPdfFormFilePermissionRead}
      exact
      path={`${match.url}/edit/:supplierId/pdf-forms/:pdfFormId`}
      component={PdfFormsEdit}
    />
  </>
);

export default Provider;
Provider.propTypes = {
  match: matchPropTypes.isRequired,
};
