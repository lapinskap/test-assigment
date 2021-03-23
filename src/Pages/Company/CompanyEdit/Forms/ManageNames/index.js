import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';
import PaymentNameEdit from './SubForms/PaymentNameEdit';
import DataLoading from '../../../../../Components/Loading/dataLoading';

export default function ManageNames({ active, setIsEdited, changePageTitleData }) {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);

  useEffect(() => {
    if (active) {
      changePageTitleData('Zarządzanie nazwami', []);
    }
  }, [active, changePageTitleData]);

  if (!active) {
    return null;
  }

  return (
    <DataLoading
      fetchedData={Object.keys(data).length > 0}
      isMock
      updateData={(updatedData) => updateData(updatedData)}
      endpoint="/company/manageNames/edit"
    >
      <Form
        id="companyManageNamesForm"
        data={data}
        config={{
          title: 'Zarządzanie nazwami',
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
          ],
          defaultOnChange: onChange,
          formGroups: [
            {
              title: 'Edycja nazw sposobów płatności (widoczne w raportach)',
              formElements: [
                {
                  component: <PaymentNameEdit key="payment_name_edit" />,
                },
              ],
            },
          ],
        }}
      />
    </DataLoading>
  );
}
ManageNames.propTypes = {
  active: PropTypes.bool,
  changePageTitleData: PropTypes.func.isRequired,
  setIsEdited: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  companyId: PropTypes.string.isRequired,
};

ManageNames.defaultProps = {
  active: false,
  setIsEdited: () => {},
};
