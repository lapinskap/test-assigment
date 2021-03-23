import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Form from '../../../../../../Components/Form';
import AvailableBenefits from './availableBenefits';
import AvailableBenefitsClusters from './availableBenefitsClusters';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import useEmployeeGroups from '../../../../../../utils/hooks/company/useEmployeeGroups';

export default function General({ companyId, isNew, setIsEdited }) {
  const history = useHistory();
  const [data, updateData] = useState({ available_benefits: {} });
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, false, !companyId);
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);

  return (
    <DataLoading
      fetchedData={Object.keys(data).length > 0}
      isMock
      isNew={isNew}
      updateData={(updatedData) => updateData(updatedData)}
      endpoint="/company/benefitsCluster/edit"
    >
      <Form
        id="benefitsClusterForm"
        data={data}
        config={{
          title: 'Edycja zgrupowania benefitów',
          stickyTitle: true,
          buttons: [
            {
              size: 'lg',
              color: 'success',
              className: 'mr-2',
              text: 'Zapisz',
              onClick: () => {
                setIsEdited(false);
              },
            },
            {
              size: 'lg',
              color: 'info',
              className: 'mr-2',
              text: 'Wróć',
              onClick: () => {
                history.push(`/company/edit/${companyId}/products/clusters-benefits`);
              },
            },
          ],
          defaultOnChange: onChange,
          formGroups: [
            {
              title: 'Podstawowe dane',
              formElements: [
                {
                  id: 'name',
                  dataOldSk: 'name',
                  label: 'Nazwa',
                  type: 'text',
                },
                {
                  id: 'visible',
                  dataOldSk: 'visible',
                  label: 'Pokaż kropkę na liście',
                  type: 'boolean',
                },
                {
                  id: 'description',
                  dataOldSk: 'description',
                  label: 'Grupa pracowników',
                  type: 'select',
                  options: employeeGroups,
                },
                {
                  id: 'name',
                  dataOldSk: 'name',
                  label: 'Opis',
                  type: 'wysiwyg',
                },
              ],
            },
            {
              title: 'Dostępne produkty',
              formElements: [
                {
                  component: <AvailableBenefits
                    data={data}
                    onChange={(id, value) => {
                      if (data.available_benefits) {
                        data.available_benefits[id] = value;
                        onChange('available_benefits', { ...data.available_benefits });
                      }
                    }}
                    key="available_benefits"
                  />,
                },
              ],
            },
            {
              title: 'Dostępne zgrupowania produkty',
              formElements: [
                {
                  component: <AvailableBenefitsClusters
                    data={data}
                    key="available_benefits_cluster"
                  />,
                },
              ],
            },
          ],
        }}
      />
    </DataLoading>
  );
}

General.propTypes = {
  companyId: PropTypes.string.isRequired,
  isNew: PropTypes.bool,
  setIsEdited: PropTypes.func.isRequired,
};

General.defaultProps = {
  isNew: false,
};
