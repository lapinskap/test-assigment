import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';

export default function Form2({ active, setIsEdited }) {
  const [data, updateData] = useState({});
  if (!active) {
    return null;
  }

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  };

  return (
    <Form
      id="standardForm"
      data={data}
      config={
                {
                  title: 'Formularz 2',
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
                      title: 'Grupa inputów',
                      formElements: [
                        {
                          id: 'fullName',
                          dataOldSk: 'fullName',
                          label: 'Pole 1',
                          type: 'textarea',
                        },

                      ],
                    },
                  ],
                }
            }
    />
  );
}
Form2.propTypes = {
  active: PropTypes.bool,
  setIsEdited: PropTypes.func.isRequired,
};
Form2.defaultProps = {
  active: false,
};
