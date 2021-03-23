import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';

export default function Tab1({ data = {}, updateTabData, setIsEdited }) {
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
                      title: 'Alarm powiadamiający o deficycie kodów',
                      formElements: [
                        {
                          id: 'codesDeficitLimit',
                          dataOldSk: 'codesDeficitLimit',
                          label: 'Limit',
                          type: 'number',
                          tooltip: {
                            type: 'info',
                            content: <>Limit kodów poniżej którego ma być wysłany alarm</>,
                          },
                        },
                        {
                          id: 'codesDeficitDays',
                          dataOldSk: 'codesDeficitDays',
                          label: 'Dni przed',
                          type: 'number',
                          tooltip: {
                            type: 'info',
                            content: (
                              <>
                                W przypdaku wysyłania alarmu o deficycie kodów brane są pod uwagę kody,
                                <br />
                                których data ważności jest dłuższy niż 'teraz' + ten parametr
                              </>
                            ),
                          },
                        },
                        {
                          id: 'codesDeficitEmail',
                          dataOldSk: 'codesDeficitEmail',
                          label: 'E-mail',
                          type: 'text',
                          tooltip: {
                            type: 'info',
                            content: <span>Kliknij "Start"</span>,
                          },
                        },
                      ],
                    },
                  ],
                }
}
    />
  );
}
Tab1.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  setIsEdited: PropTypes.func.isRequired,
  updateTabData: PropTypes.func.isRequired,
};
