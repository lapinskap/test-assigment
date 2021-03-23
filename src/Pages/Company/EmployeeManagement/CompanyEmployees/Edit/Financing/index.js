import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../../Components/Form';
// import DataLoading from '../../../../../../Components/Loading/dataLoading';
import FinancingPopup from './popup';
import { employeeEmployeePermissionWrite } from '../../../../../../utils/RoleBasedSecurity/permissions';

export default function Financing({ active, setIsEdited, employeeId }) {
  const [data, updateData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);
  if (!active) {
    return null;
  }

  const closePopup = () => setIsOpen(false);

  return (
  // <DataLoading
  //   fetchedData={Object.keys(data).length > 0}
  //   isMock
  //   updateData={(updatedData) => updateData(updatedData)}
  //   endpoint="/employee/financing/edit"
  // >
    <>
      <Form
        id="financingForm"
        data={data}
        config={{
          title: 'Dofinansowania pracownika',
          stickyTitle: true,
          buttons: [
            {
              size: 'lg',
              color: 'success',
              className: 'mr-2',
              text: 'Przydziel dofinansowanie',
              permission: employeeEmployeePermissionWrite,
              onClick: () => {
                setIsOpen(true);
              },
            },
          ],
          defaultOnChange: onChange,
          formGroups: [
            {
              title: 'Dofinansowania',
              formElements: [
                {
                  type: 'select',
                  label: 'Wybierz dofinansowanie:',
                  id: 'financingType',
                  options: [
                    { value: 'type1', label: 'dofinansowanie kolonii' },
                    { value: 'type2', label: 'dofinansowanie wyjazdu krajowego' },
                    { value: 'type3', label: 'dofinansowanie wyjazdu za granicę' },
                  ],
                },
                {
                  type: 'text',
                  label: 'Stan banku punktów ZFŚS:',
                  id: 'bankPoints',
                },
                {
                  type: 'text',
                  label: 'Kwota dofinansowania:',
                  id: 'amount',
                  validation: ['required'],
                },
                {
                  type: 'text',
                  label: 'Komentarz:',
                  id: 'comment',
                },
              ],
            },
          ],
        }}
      />
      {isOpen ? <FinancingPopup close={closePopup} employeeId={employeeId} isOpen={isOpen} data={data} /> : null}
    </>
  // </DataLoading>
  );
}
Financing.propTypes = {
  active: PropTypes.bool,
  setIsEdited: PropTypes.func,
  employeeId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  companyId: PropTypes.string.isRequired,
};
Financing.defaultProps = {
  active: false,
  setIsEdited: () => null,
};
