import React, { useState, useCallback } from 'react';
import { Loader as LoaderAnim } from 'react-loaders';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import { Alert, Input } from 'reactstrap';
import Form from '../../../../Components/Form';
import ContentLoading from '../../../../Components/Loading/contentLoading';
import { LAYOUT_TWO_COLUMNS } from '../../../../Components/Layouts';
import LanguageTabs from './languageTabs';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { restApiRequest, DICTIONARY_SERVICE, TRANSLATOR_SERVICE } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import DataLoading from '../../../../Components/Loading/dataLoading';
import __ from '../../../../utils/Translations';
import uniqueId from '../../../../utils/jsHelpers/uniqueId';
import { fileToBase64 } from '../../../../utils/Parsers/fileToBase64';
import { allowedExtensions } from '../../../../utils/Validation';
import {
  dictionaryDictionaryItemsImportWrite,
  dictionaryDictionaryPermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import SecurityWrapper from '../../../../utils/RoleBasedSecurity/SecurityComponents/SecuirityWrapper';

const listingPath = '/administration/dictionary';

export default function DictionaryEdit({ match }) {
  const editId = +match.params.editId;
  const isNew = +editId === -1;
  const history = useHistory();
  const [data, updateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [items, updateItems] = useState(null);
  const spinner = <LoaderAnim color="#545cd8" type="line-scale" active />;
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const submit = async () => {
    try {
      const method = isNew ? 'POST' : 'PATCH';
      const path = isNew ? '/dictionaries' : `/dictionaries/${editId}`;
      const body = { ...data };
      if (!isNew) {
        body.itemsJson = items.map(({ key, value }, index) => ({ key, value, position: index + 1 }));
      }

      const response = await restApiRequest(
        DICTIONARY_SERVICE,
        path,
        method,
        {
          body,
        },
        data,
      );
      if (!isNew) {
        await saveTranslations(data.code, items);
      }
      dynamicNotification(__('Pomyślnie zapisano słownik'));
      if (isNew) {
        updateItems([]);
        history.push(`/administration/dictionary/${response.id}`);
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać słownika'), 'error');
    }
  };

  const importFromFile = async (file) => {
    try {
      setLoading(true);
      const requestData = {
        file: await fileToBase64(file),
        dictionaryId: editId,
      };
      await restApiRequest(
        DICTIONARY_SERVICE,
        '/import-items-csv',
        'POST',
        {
          body: requestData,
          returnNull: true,
        },
        null,
      );
      updateData(null);
      dynamicNotification(__('Pomyślnie zaimportowane dane'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zaimportować danych'), 'error');
    }
    setLoading(false);
  };

  const isSystemic = Boolean(data && data.systemic);
  const additionalGroups = !isNew ? [
    {
      title: 'Pozycje',
      formElements: [
        {
          id: 'items',
          component: <LanguageTabs key="items" items={items} updateItems={updateItems} isSystemic={isSystemic} />,
          validation: [{
            method: 'customValidation',
            args: [(formData) => itemsValidator(formData, history)],
          }],
        },
      ],
    },
  ] : [];

  const formData = data ? {
    ...data,
    items,
  } : {};

  return (
    <>
      <PageTitle
        heading={isNew ? 'Dodaj słownik' : 'Edytuj słownik'}
        breadcrumbs={[{ title: 'Lista słowników', link: '/administration/dictionary' }]}
      />
      <ContentLoading
        message={spinner}
        show={loading}
      >
        <DataLoading
          service={DICTIONARY_SERVICE}
          fetchedData={data !== null}
          // eslint-disable-next-line no-shadow
          updateData={({ itemsJson, ...data }) => {
            updateData(data);
            fetchTranslations(data.code, itemsJson.sort((a, b) => a.position - b.position))
              .then((updatedItems) => updateItems(updatedItems.map((item) => ({ ...item, tmpId: uniqueId() }))));
          }}
          endpoint={`/dictionaries/${editId}`}
          mockDataEndpoint="/dictionaries/edit"
          isNew={isNew}
        >
          <Form
            id="dictionaryForm"
            data={formData}
            config={{
              defaultOnChange: onChange,
              stickyTitle: true,
              title: isNew ? 'Dodaj słownik' : 'Edytuj słownik',
              onSubmit: submit,
              buttons: [
                {
                  size: 'lg',
                  color: 'success',
                  className: 'mr-2',
                  text: 'Zapisz',
                  type: 'submit',
                  id: 'dictionarySubmit',
                  permission: dictionaryDictionaryPermissionWrite,
                },
                {
                  size: 'lg',
                  color: 'success',
                  className: 'mr-2',
                  text: 'Eksportuj',
                  id: 'dictionaryExport',
                  onClick: () => dynamicNotification(__('Ten przycisk nic jeszcze nie robi')),
                },
                {
                  size: 'lg',
                  color: 'light',
                  className: 'mr-2',
                  text: 'Wróć',
                  id: 'dictionaryBack',
                  href: listingPath,
                },
              ],
              formGroups: [
                {
                  formElements: [
                    {
                      displayCondition: isSystemic,
                      component: (
                        <Alert
                          key="is-systemic-warning"
                          color="warning"
                        >
                          {__('Słownik systemowy! Możliwośc edycji wyłącznie wartości pozycji słownika')}
                        </Alert>
                      ),
                    },
                    {
                      layout: LAYOUT_TWO_COLUMNS,
                      formElements: [
                        {
                          id: 'code',
                          type: 'text',
                          label: 'Kod:',
                          validation: ['required'],
                          props: {
                            disabled: isSystemic,
                          },
                        },
                        {
                          id: 'type',
                          type: 'select',
                          label: 'Typ słownika:',
                          options: [
                            { value: 'description', label: 'Opis' },
                            { value: 'cancelConditions', label: 'Warunki anulacji' },
                            { value: 'tags', label: 'Tagi' },
                          ],
                          props: {
                            disabled: isSystemic,
                          },
                        },
                        {
                          id: 'name',
                          type: 'text',
                          label: 'Nazwa:',
                          validation: ['required'],
                          props: {
                            disabled: isSystemic,
                          },
                        },
                        {
                          component: (
                            <SecurityWrapper
                              permission={dictionaryDictionaryItemsImportWrite}
                              key="importCsvComponent"
                              disable
                            >
                              <Input
                                data-t1="importCsv"
                                type="file"
                                id="importCsv"
                                name="importCsv"
                                onChange={(e) => {
                                  const { files } = e.target;
                                  if (files && files.length && !allowedExtensions(files, ['csv'])) {
                                    importFromFile(files[0]);
                                  }
                                }}
                                label="Wybierz plik"
                              />
                            </SecurityWrapper>
                          ),
                        },
                      ],
                    },
                  ],
                },
                ...additionalGroups,
              ],
            }}
          />
        </DataLoading>
      </ContentLoading>
    </>
  );
}

const fetchTranslations = async (dictionaryCode, items) => {
  try {
    const response = await restApiRequest(
      TRANSLATOR_SERVICE,
      '/dictionary-records',
      'GET',
      {
        params: {
          dictionaryCode,
        },
      },
      [],
    );
    return items.map((item) => {
      const updatedItem = { ...item };
      Object.keys(response).forEach((lang) => {
        Object.keys(response[lang]).forEach((phrase) => {
          if (phrase === updatedItem.value) {
            updatedItem[`value_${lang}`] = response[lang][phrase];
          }
        });
      });
      return updatedItem;
    });
  } catch (e) {
    console.error(e);
    dynamicNotification(__('Nie udało się pobrać tłumaczeń do słownika'), 'warning');
  }
  return items;
};

async function saveTranslations(dictionaryCode, items) {
  try {
    const data = {};
    items.forEach((item) => {
      data[item.value] = {};
      Object.keys(item).forEach((key) => {
        const match = key.match(/value_(\w\w)/);
        if (match && match[1]) {
          data[item.value][match[1]] = item[key];
        }
      });
    });

    await restApiRequest(
      TRANSLATOR_SERVICE,
      '/dictionary',
      'POST',
      {
        body: {
          dictionaryCode,
          data,
        },
        returnNull: true,
      },
      null,
    );
  } catch (e) {
    console.error(e);
    dynamicNotification(__('Nie udało się zapisać tłumaczeń słownika'), 'warning');
  }
}

const itemsValidator = (data, history) => {
  const result = {};
  const alreadyExist = [];
  let changeTab = null;
  if (data) {
    data.forEach((item) => {
      if (!item.key) {
        result[item.tmpId] = {
          key: __('Klucz nie może być pusty'),
        };
      } else if (alreadyExist.includes(item.key)) {
        result[item.tmpId] = {
          key: __('Klucz musi być unikalny'),
        };
      } else {
        alreadyExist.push(item.key);
      }
      if (!item.value) {
        result[item.tmpId] = {
          value: __('Wartość w domyślnym języku nie może być pusta'),
        };
        changeTab = 'pl';
      }
    });
  }
  if (changeTab) {
    history.push({ hash: changeTab });
  }
  return Object.keys(result).length ? result : null;
};

DictionaryEdit.propTypes = {
  match: matchPropTypes.isRequired,
};
