import React, { useState, useCallback, useEffect } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import Form from '../../../../Components/Form/index';
import { LAYOUT_TWO_COLUMNS, LAYOUT_ONE_COLUMN } from '../../../../Components/Layouts';
import { restApiRequest, TOURISM_SERVICE } from '../../../../utils/Api';
import __ from '../../../../utils/Translations';
import { dynamicNotification } from '../../../../utils/Notifications';
import DataLoading from '../../../../Components/Loading/dataLoading';
import { tourismTourismObjectPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import AnixeLanguagesTabs from './tabs/anixeLanguagesTabs';
import useConfigValue from '../../../../utils/hooks/configuration/useConfigValue';

const parseDataFromBackend = ({ ...data }) => {
  const updatedData = data;
  updatedData.useDefaultFulfilmentRules = updatedData.useDefaultFulfilmentRules == null ? true : updatedData.useDefaultFulfilmentRules;

  return updatedData;
};

export default function Description({ objectId }) {
  const [data, updateData] = useState(null);
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  useEffect(() => {
    updateData(null);
  }, [objectId]);

  const defaultFulfilmentRules = useConfigValue('tourism/default-data/fulfilment-rules');

  const submit = async () => {
    try {
      await restApiRequest(
        TOURISM_SERVICE,
        `/tourism-objects/${objectId}`,
        'PATCH',
        {
          body: {
            statement: data.statement,
            description: data.description,
            shortDescription: data.shortDescription,
            useAnixeDescription: data.useAnixeDescription,
            objectRules: data.objectRules,
            useDefaultFulfilmentRules: data.useDefaultFulfilmentRules,
            customFulfilmentRules: data.customFulfilmentRules,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano obiekt'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać obiektu'), 'error');
    }
  };
  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      />
      <DataLoading
        service={TOURISM_SERVICE}
        fetchedData={data !== null}
          // eslint-disable-next-line no-shadow
        updateData={(updatedData) => updateData(parseDataFromBackend(updatedData))}
        endpoint={`/tourism-objects/${objectId}`}
        mockDataEndpoint="/tourismObjects/edit"
        isNew={false}
      >
        <Form
          id="descriptionForm"
          data={data ? {
            ...data,
            customFulfilmentRules: data.useDefaultFulfilmentRules ? defaultFulfilmentRules : data.customFulfilmentRules,
          } : {}}
          config={{
            stickyTitle: false,
            defaultOnChange: onChange,
            title: 'OPIS OBIEKTU',
            buttons: [
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                permission: tourismTourismObjectPermissionWrite,
                type: 'submit',
                id: 'descriptionFormSubmit',
              },
            ],
            onSubmit: submit,
            formGroups: [
              {
                formElements: [
                  {
                    label: 'Komunikat:',
                    type: 'text',
                    id: 'statement',
                    translatable: {
                      scope: 'tourism:statement',
                    },
                  },
                  {
                    layout: LAYOUT_TWO_COLUMNS,
                    formElements: [
                      {
                        layout: LAYOUT_ONE_COLUMN,
                        formElements: [
                          {
                            component: <AnixeLanguagesTabs
                              key="anixeShortDescription"
                              data={data?.anixeData || {}}
                              field="shortDescription"
                              label="Krótki opis z anixe"
                              buttonLabel="Skopiuj krótki opis z ANIXE"
                              onChange={onChange}
                              withConfirmation={Boolean(data?.shortDescription)}
                            />,
                          },
                          {
                            component: <AnixeLanguagesTabs
                              key="anixeDescription"
                              data={data?.anixeData || {}}
                              field="description"
                              label="Opis podstawowy z anixe"
                              buttonLabel="Skopiuj opis podstawowy z ANIXE"
                              onChange={onChange}
                              withConfirmation={Boolean(data?.description)}
                              fieldType="wysiwyg"
                            />,
                          },
                          {
                            type: 'wysiwyg',
                            id: 'objectRules',
                            label: 'Zasady obiektu',
                            translatable: {
                              code: `tourism:object:${objectId}:objectRules`,
                              isCms: true,
                            },
                          },
                        ],
                      },
                      {
                        layout: LAYOUT_ONE_COLUMN,
                        formElements: [
                          {
                            component: <strong key="shortDescTitle" className="mb-3">KRÓTKI OPIS WŁASNY</strong>,
                          },
                          {
                            type: 'textarea',
                            id: 'shortDescription',
                            translatable: {
                              code: 'tourism:shortDescription',
                              isCms: true,
                            },
                          },
                          {
                            component: <strong key="descTitle" className="mb-3">OPIS PODSTAWOWY WŁASNY</strong>,
                          },
                          {
                            type: 'wysiwyg',
                            id: 'description',
                            label: 'Pełny opis obiektu',
                            translatable: {
                              code: 'tourism:description',
                              isCms: true,
                            },
                          },
                          {
                            type: 'wysiwyg',
                            id: 'customFulfilmentRules',
                            label: 'Zasady realizacji',
                            translatable: !data?.useDefaultFulfilmentRules ? {
                              code: `tourism:object:${objectId}:customFulfilmentRules`,
                              isCms: true,
                            } : null,
                            inputSwitcher: {
                              onChange: (id, value) => onChange('useDefaultFulfilmentRules', value),
                              disableIfChecked: true,
                              switcherValue: Boolean(data?.useDefaultFulfilmentRules),
                              label: 'Użyj domyślnych zasad realizacji',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          }}
        />
      </DataLoading>
    </>
  );
}

Description.propTypes = {
  objectId: PropTypes.string.isRequired,
};
