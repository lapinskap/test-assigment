import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import SimpleTabs from '../../../../Components/Tabs/SimpleTabs';
import { MASTERDATA_SERVICE } from '../../../../utils/Api';
import DataLoading from '../../../../Components/Loading/dataLoading';

import EditSupplierData from './editSupplierData';
import SupplierObjectList from './supplierObjectList';
import SupplierSubscriptionList from './supplierSubscriptionList';
import PdfFormsListing from './PdfForms/Listing';

const getActiveTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : 'subscription';
  return hash.split('/')[0];
};

export default function EditSupplier({ match }) {
  const [data, updateData] = useState(null);
  const history = useHistory();
  const { supplierId } = match.params;
  const isTourismSupplier = match.url.includes('tourism');
  const activeKey = getActiveTab(history.location.hash);
  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <DataLoading
          service={MASTERDATA_SERVICE}
          fetchedData={data !== null}
          updateData={(updatedData) => updateData(updatedData.member || {})}
      // @todo change to /touristic route when /touristic/id will be allowed
          endpoint={isTourismSupplier ? `/supplierobject/nontouristic/${supplierId}` : `/supplierobject/nontouristic/${supplierId}`}
          mockDataEndpoint="/suppliers/edit"
        >
          <PageTitle
            heading={`Podgląd dostawcy ${(data && data.objectName) ? data.objectName : ''} (${supplierId})`}
            breadcrumbs={isTourismSupplier ? [{ title: 'Turystyka', link: '/tourism' },
              { title: 'Lista dostawców', link: '/tourism/suppliers' },
            ] : [
              { title: 'Lista dostawców', link: '/suppliers' },
            ]}
          />

          <SimpleTabs
            activeKey={activeKey}
            defaultActiveKey="view_supplier_data"
            tabsConfig={[
              {
                name: 'Podgląd danych dostawcy',
                key: 'view_supplier_data',
                component: <EditSupplierData data={data || {}} />,
              },
              {
                name: 'Lista obiektów turystycznych dostawcy',
                key: 'supplier_object_list',
                component: <SupplierObjectList supplierId={supplierId} />,
              },
              {
                name: 'Lista świadczeń cyklicznych dostawcy',
                key: 'supplier_subscription_list',
                component: <SupplierSubscriptionList supplierId={supplierId} />,
              },
              {
                name: 'Lista Formularzy PDF dostawcy',
                key: 'supplier_pdf_forms_list',
                component: <PdfFormsListing supplierId={supplierId} />,
              },
            ]}
          />
        </DataLoading>

      </CSSTransitionGroup>
    </>
  );
}

EditSupplier.propTypes = {
  match: matchPropTypes.isRequired,
};
