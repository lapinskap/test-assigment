import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import CompanyBaseDataForm from '../../../CompanyEdit/Forms/CompanyData/form';

export default () => {
  const history = useHistory();
  const [data, updateData] = useState({});

  const submit = async () => {
    try {
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        '/companies',
        'POST',
        {
          body: data,
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano firmę'));
      history.push('/company/list');
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać firmy'), 'error');
    }
  };

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };
  return (
    <CompanyBaseDataForm
      data={data}
      onChange={onChange}
      submit={submit}
    />
  );
};
