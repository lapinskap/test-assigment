import React, { useCallback, useState } from 'react';
import Form from '../../../../../Components/Form';
import SubForm from './SubForm';
import DataLoading from '../../../../../Components/Loading/dataLoading';

export default () => {
  const [data, updateData] = useState({});

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  return (
    <DataLoading
      fetchedData={Object.keys(data).length > 0}
      isMock
      updateData={(updatedData) => updateData(updatedData)}
      endpoint="/company/manageNames/edit"
    >
      <Form
        id="standardForm"
        data={data}
        config={{
          title: 'Tytuł całego formularza (opcjonalny)',
          stickyTitle: true,
          buttons: [
            {
              size: 'lg',
              color: 'success',
              className: 'mr-2',
              text: 'Zapisz',
              onClick: () => {

              },
            },
          ],
          defaultOnChange: onChange,
          formGroups: [
            {
              title: 'Tytuł grupy (opcjonalny)',
              formElements: [
                {
                  component: <SubForm key="group_2" />,
                },
              ],
            },
          ],
        }}
      />
    </DataLoading>
  );
};
