import PropTypes from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import Form from './form';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import CompanyContext from '../../../CompanyContext';

export default function CompanyData({
  companyId, active, setIsEdited, changePageTitleData,
}) {
  const [data, updateData] = useState({});
  const companyContext = useContext(CompanyContext);
  useEffect(() => {
    if (active) {
      changePageTitleData(null);
    }
  }, [active, changePageTitleData]);

  if (!active) {
    return null;
  }

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  };

  const submit = async () => {
    try {
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        `/companies/${companyId}`,
        'PATCH',
        {
          body: data,
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano dane firmy'));
      companyContext.refresh();
      setIsEdited(false);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać firmy'), 'error');
    }
  };

  return (
    <DataLoading
      service={COMPANY_MANAGEMENT_SERVICE}
      fetchedData={Object.keys(data).length > 0}
      updateData={(updatedData) => updateData(updatedData)}
      endpoint={`/companies/${companyId}`}
      mockDataEndpoint="/company/companyData/edit"
    >
      <Form
        data={data}
        submit={submit}
        onChange={onChange}
      />
    </DataLoading>
  );
}

CompanyData.propTypes = {
  active: PropTypes.bool,
  changePageTitleData: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
  setIsEdited: PropTypes.func,
};

CompanyData.defaultProps = {
  active: false,
  setIsEdited: () => {},
};
