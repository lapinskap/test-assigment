import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../../Components/Form';
import ChargeUpsList from './ChargeUpsList';
import DataLoading from '../../../../../../Components/Loading/dataLoading';

export default function ChargeUps({ active, setIsEdited }) {
  const [data, updateData] = useState([]);

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);
  if (!active) {
    return null;
  }

  return (
    <DataLoading
      fetchedData={Object.keys(data).length > 0}
      isMock
      updateData={(updatedData) => updateData(updatedData)}
      endpoint="/employee/chargeUps/edit"
    >
      <Form
        id="chargeUpsForm"
        data={data}
        config={{
          title: 'Doładowania punktów',
          stickyTitle: true,
          buttons: [],
          defaultOnChange: onChange,
          formGroups: [
            {
              formElements: [
                {
                  component: <ChargeUpsList data={data} key="charge_ups_list" />,
                },
              ],
            },
          ],
        }}
      />
    </DataLoading>
  );
}
ChargeUps.propTypes = {
  active: PropTypes.bool,
  setIsEdited: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  employeeId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  companyId: PropTypes.string.isRequired,
};
ChargeUps.defaultProps = {
  active: false,
  setIsEdited: () => null,
};
