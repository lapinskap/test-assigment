import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';

export default function Form1({ active, setIsEdited }) {
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
                  title: 'Formularz 1',
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
                          label: 'Input 1',
                          type: 'text',
                        },
                        {
                          id: 'shortName',
                          dataOldSk: 'shortName',
                          label: 'Input 2',
                          type: 'text',
                        },
                      ],
                    },
                  ],
                }
            }
    />
  );
}

Form1.propTypes = {
  active: PropTypes.bool,
  setIsEdited: PropTypes.func.isRequired,
};
Form1.defaultProps = {
  active: false,
};
