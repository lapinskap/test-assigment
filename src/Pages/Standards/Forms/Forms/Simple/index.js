import React, { useCallback, useState } from 'react';
import Form from '../../../../../Components/Form';
import useCompanyGroupsOptions from '../../../../../utils/hooks/company/useCompanyGroupsOptions';

export default () => {
  const [data, updateData] = useState({});

  const options = useCompanyGroupsOptions('a43275e4-eeb2-11ea-adc1-0242ac1200021', true, true, true, true);

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };

  const onRangeChange = useCallback((key, value) => {
    const updatedData = { ...data };
    const { from, to } = value;
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    updateData(updatedData);
  }, [data]);

  return (
    <Form
      id="standardForm"
      data={data}
      config={
                {
                  title: 'Nagłówek "Sticky"',
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
                      title: 'Inputy Proste',
                      tooltip: {
                        content: <>Tooltip na grupie</>,
                      },
                      formElements: [
                        {
                          id: 'input_text',
                          label: 'Input text',
                          type: 'text',
                        },
                        {
                          id: 'autocomplete',
                          label: 'Company options',
                          type: 'autocomplete',
                          options,
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
                        {
                          id: 'datetime',
                          label: 'Czas i data',
                          type: 'datetime',
                        },
                        {
                          id: 'file',
                          label: 'Plik',
                          type: 'file',
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
                            { value: 'option_1', label: 'Opcja 1' },
                            { value: 'option_2', label: 'Opcja 2' },
                            { value: 'option_3', label: 'Opcja 3' },
                            { value: 'option_4', label: 'Opcja 4' },
                            { value: 'option_5', label: 'Opcja 5' },
                            { value: 'option_6', label: 'Opcja 6' },
                          ],
                        },
                        {
                          id: 'radio',
                          label: 'Radio',
                          type: 'radio',
                          options: [
                            { value: 'option_1', label: 'Opcja 1' },
                            { value: 'option_2', label: 'Opcja 2' },
                            { value: 'option_3', label: 'Opcja 3' },
                            { value: 'option_4', label: 'Opcja 4' },
                            { value: 'option_5', label: 'Opcja 5' },
                            { value: 'option_6', label: 'Opcja 6' },
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
                            { value: 'option_1', label: 'Opcja 1' },
                            { value: 'option_2', label: 'Opcja 2' },
                            { value: 'option_3', label: 'Opcja 3' },
                            { value: 'option_4', label: 'Opcja 4' },
                            { value: 'option_5', label: 'Opcja 5' },
                            { value: 'option_6', label: 'Opcja 6' },
                            { value: 'option_7', label: 'Opcja 7' },
                            { value: 'option_8', label: 'Opcja 8' },
                            { value: 'option_9', label: 'Opcja 9' },
                            { value: 'option_10', label: 'Opcja 10' },
                            { value: 'option_11', label: 'Opcja 11' },
                          ],
                        },
                      ],

                    },
                    {
                      title: 'Zakresy',
                      formElements: [
                        {
                          id: 'numberRange',
                          label: 'Zakres cyfry',
                          type: 'numberRange',
                          onChange: onRangeChange,
                        },
                        {
                          id: 'dateRange',
                          label: 'Zakres dat',
                          type: 'dateRange',
                          onChange: onRangeChange,
                        },
                        {
                          id: 'datetimeRange',
                          label: 'Zakres dat z czasem',
                          type: 'datetimeRange',
                        },
                      ],
                    },
                    {
                      title: 'Inne',
                      formElements: [
                        {
                          id: 'depends_parent',
                          label: 'Pola zależne (rodzic)',
                          type: 'boolean',
                          tooltip: {
                            content: (
                              <>
                                Jeśli pole ma być zależne od kilku pól wówczas pole depends może być tablicą obiektów [
                                {'{field, value}'}
                                ]
                              </>
                            ),
                          },
                          props: {
                            min: 10,
                            max: 100,
                          },
                        },
                        {
                          id: 'depends_child',
                          label: 'Pola zależne (dziecko)',
                          type: 'text',
                          depends: {
                            field: 'depends_parent',
                            value: true,
                          },
                        },
                        {
                          id: 'wysiwyg',
                          label: 'Wysiwyg',
                          tooltip: {
                            content: <>Wysokość można zdefiniować poprzez props.height</>,
                          },
                          type: 'wysiwyg',
                        },
                        {
                          id: 'button',
                          label: 'Przycisk',
                          type: 'button',
                          onChange: () => {},
                        },
                        {
                          id: 'title',
                          label: 'Tytuł',
                          type: 'title',
                          props: {
                            withLines: true,
                          },
                        },
                        {
                          id: 'staticValue',
                          label: 'Wartośc nieedytowalna',
                          type: 'staticValue',
                        },
                      ],
                    },
                  ],
                }
            }
    />
  );
};
