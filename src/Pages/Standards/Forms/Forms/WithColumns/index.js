import React, { useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import Form from '../../../../../Components/Form';
import FormTitle from '../../../../../Components/Form/FormTitle';
import ButtonsList from '../../../../../Components/ButtonsList';

export default () => {
  const [data, updateData] = useState({});

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };

  return (
    <Card>
      <FormTitle
        title="Tytuł formularza"
        buttons={
          (
            <ButtonsList buttons={[
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                onClick: () => {
                },
              },
            ]}
            />
          )
        }
      />
      <CardBody>
        <Form
          id="standardForm"
          data={data}
          config={
            {
              defaultOnChange: onChange,
              groupsAsColumns: true,
              formGroups: [
                {
                  title: 'Inputy Proste',
                  formElements: [
                    {
                      id: 'input_text',
                      label: 'Input text',
                      type: 'text',
                    },
                    {
                      id: 'textarea',
                      label: 'Textarea',
                      type: 'textarea',
                      props: {
                        disabled: true,
                      },
                    },
                    {
                      id: 'number',
                      label: 'Cyfra od 1 do 10',
                      type: 'number',
                      props: {
                        max: 10,
                        min: 1,
                      },
                    },
                    {
                      id: 'password',
                      label: 'Hasło',
                      type: 'password',
                    },
                    {
                      id: 'date',
                      props: {
                        format: 'dd.MM.yy ',
                      },
                      label: 'Data (z ustawionym formatem)',
                      type: 'date',
                    },
                    {
                      id: 'time',
                      label: 'Czas',
                      type: 'date',
                    },
                  ],
                },
                {
                  title: 'Opcje',
                  formElements: [
                    {
                      id: 'boolean',
                      label: 'Boolean',
                      type: 'boolean',
                    },
                    {
                      id: 'select',
                      label: 'Select z dodaną pustą opcją',
                      type: 'select',
                      options: [
                        {
                          value: 'option_1',
                          label: 'Opcja 1',
                        },
                        {
                          value: 'option_2',
                          label: 'Opcja 2',
                        },
                        {
                          value: 'option_3',
                          label: 'Opcja 3',
                        },
                        {
                          value: 'option_4',
                          label: 'Opcja 4',
                        },
                        {
                          value: 'option_5',
                          label: 'Opcja 5',
                        },
                        {
                          value: 'option_6',
                          label: 'Opcja 6',
                        },
                      ],
                    },
                    {
                      id: 'radio',
                      label: 'Radio',
                      type: 'radio',
                      options: [
                        {
                          value: 'option_1',
                          label: 'Opcja 1',
                        },
                        {
                          value: 'option_2',
                          label: 'Opcja 2',
                        },
                        {
                          value: 'option_3',
                          label: 'Opcja 3',
                        },
                        {
                          value: 'option_4',
                          label: 'Opcja 4',
                        },
                        {
                          value: 'option_5',
                          label: 'Opcja 5',
                        },
                        {
                          value: 'option_6',
                          label: 'Opcja 6',
                        },
                      ],
                    },
                    {
                      id: 'checkbox',
                      label: 'Checkbox (z rozbiciem na 2 kolumny)',
                      type: 'checkbox',
                      props: {
                        columns: 2,
                      },
                      tooltip: {
                        content: <>Rozbicie na kolumny jest możliwe jeśli jest przynajmniej 10 opcji</>,
                      },
                      options: [
                        {
                          value: 'option_1',
                          label: 'Opcja 1',
                        },
                        {
                          value: 'option_2',
                          label: 'Opcja 2',
                        },
                        {
                          value: 'option_3',
                          label: 'Opcja 3',
                        },
                        {
                          value: 'option_4',
                          label: 'Opcja 4',
                        },
                        {
                          value: 'option_5',
                          label: 'Opcja 5',
                        },
                        {
                          value: 'option_6',
                          label: 'Opcja 6',
                        },
                        {
                          value: 'option_7',
                          label: 'Opcja 7',
                        },
                        {
                          value: 'option_8',
                          label: 'Opcja 8',
                        },
                        {
                          value: 'option_9',
                          label: 'Opcja 9',
                        },
                        {
                          value: 'option_10',
                          label: 'Opcja 10',
                        },
                        {
                          value: 'option_11',
                          label: 'Opcja 11',
                        },
                      ],
                    },
                  ],
                },
              ],
            }
          }
        />
      </CardBody>
    </Card>
  );
};
