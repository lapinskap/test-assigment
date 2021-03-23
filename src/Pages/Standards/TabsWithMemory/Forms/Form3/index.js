import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';

export default function Form3({ active, setIsEdited }) {
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
                  title: 'Formularz 3',
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
                          id: 'input',
                          dataOldSk: 'input',
                          label: 'Input 1',
                          type: 'boolean',
                        },
                      ],
                    },
                  ],
                }
            }
    />
  );
}
Form3.propTypes = {
  active: PropTypes.bool,
  setIsEdited: PropTypes.func.isRequired,
};
Form3.defaultProps = {
  active: false,
};
