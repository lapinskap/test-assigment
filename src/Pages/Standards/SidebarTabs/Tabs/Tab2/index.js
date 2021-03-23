import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';

export default function Tab2({ data = {}, updateTabData, setIsEdited }) {
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
                          id: 'tab2_1',
                          label: 'Textarea',
                          type: 'textarea',
                        },
                        {
                          id: 'tab2_2',
                          label: 'Przełacznik',
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
Tab2.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  setIsEdited: PropTypes.func.isRequired,
  updateTabData: PropTypes.func.isRequired,
};
