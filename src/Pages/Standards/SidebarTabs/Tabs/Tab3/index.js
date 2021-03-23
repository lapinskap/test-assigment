import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';

export default function Tab3({ data = {}, updateTabData, setIsEdited }) {
  const onChange = (key, value) => {
    updateTabData(key, value);
    setIsEdited(true);
  };

  return (
    <Form
      id="standardForm"
      data={data}
      config={
                {
                  noCards: true,
                  defaultOnChange: onChange,
                  formGroups: [
                    {
                      formElements: [
                        {
                          id: 'tab3_1',
                          label: 'Tekstowa wartość',
                          type: 'text',
                        },
                        {
                          id: 'tab3_2',
                          label: 'Hasło',
                          type: 'password',
                        },
                        {
                          id: 'tab3_3',
                          label: 'Tekstowa wartość 2',
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
Tab3.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  setIsEdited: PropTypes.func.isRequired,
  updateTabData: PropTypes.func.isRequired,
};
