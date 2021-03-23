import React, { useState, useEffect } from 'react';
import { Alert } from 'reactstrap';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import Form from '../../../Components/Form/index';
import { getAttributes } from '../managingFilteringAttributes/managingAttributes';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import arrayUnique from '../../../utils/jsHelpers/arrayUnique';
import { restApiRequest, TOURISM_SERVICE } from '../../../utils/Api';
import { statusOptions } from '../listOfObjects/editObject/basicInformation';
import useOperators from '../../../utils/hooks/operator/useOperators';
import { getListingData } from '../../../Components/DataTableControlled';
import ContentLoading from '../../../Components/Loading/contentLoading';

const ATTRIBUTE_CODE_OPTION_SEPARATOR = '{||}';

export default function MassAttributeUpdate() {
  const [data, updateData] = useState({});
  const [attributesData, setAttributesData] = useState({});
  const [attributes, setAttributes] = useState([]);
  const [changedAttributesOptions, setChangedAttributesOptions] = useState({});
  const [changedValues, setChangedValues] = useState([]);
  const [tourismObjectIds, setTourismObjectIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };
  const onChangeAttribute = (key, value) => {
    const updatedData = { ...attributesData };
    const [attributeCode] = key.split(ATTRIBUTE_CODE_OPTION_SEPARATOR);
    updatedData[attributeCode] = value;
    setAttributesData(updatedData);
    onChange(key, value);
  };

  const switchCheckbox = (field, checked) => {
    if (checked) {
      setChangedValues([...changedValues, field].filter(arrayUnique));
    } else {
      setChangedValues(changedValues.filter((el) => el !== field));
    }
  };
  const { search } = history.location;
  useEffect(() => {
    const { included, excluded, filters } = getUpdateScope(search);
    setLoading(true);
    if (Array.isArray(included)) {
      setTourismObjectIds(included);
      setLoading(false);
    } else {
      getListingData(
        TOURISM_SERVICE,
        '/tourism-objects',
        filters,
        1,
        100000,
      ).then(({ data: listingData }) => {
        const ids = [];
        listingData.forEach(({ id }) => {
          if (!excluded.includes(id)) {
            ids.push(id);
          }
        });
        setTourismObjectIds(ids);
      }).catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [search]);

  const switchAttributeOption = (optionCode, attributeCode, checked) => {
    const updatedData = { ...changedAttributesOptions };
    if (!updatedData[attributeCode]) {
      updatedData[attributeCode] = [];
    }
    if (checked) {
      updatedData[attributeCode] = [...updatedData[attributeCode], optionCode].filter(arrayUnique);
    } else {
      updatedData[attributeCode] = updatedData[attributeCode].filter((el) => el !== optionCode);
    }
    setChangedAttributesOptions(updatedData);
  };
  useEffect(() => {
    getAttributes()
      .then((res) => setAttributes(res))
      .catch((e) => {
        console.error(e);
        dynamicNotification(__('Nie udało się pobrać listy atrybutów'), 'error');
      });
  }, [setAttributes]);

  const submit = async () => {
    try {
      const updatedData = {};
      changedValues.forEach((field) => {
        updatedData[field] = data[field];
      });
      const attributeOptionValues = {};
      Object.keys(changedAttributesOptions).forEach((attributeCode) => {
        const editedOptions = changedAttributesOptions[attributeCode];
        if (editedOptions.length > 0) {
          const selectedOptions = attributesData?.[attributeCode] || [];
          attributeOptionValues[attributeCode] = {};
          editedOptions.forEach((option) => {
            const selected = selectedOptions.includes(option);
            attributeOptionValues[attributeCode][option] = selected ? 1 : 0;
          });
        }
      });

      if (Object.keys(attributeOptionValues).length > 0) {
        updatedData.attributeOptionValues = attributeOptionValues;
      }

      await restApiRequest(
        TOURISM_SERVICE,
        '/tourism-objects/mass-update',
        'POST',
        {
          body: {
            ...updatedData,
            tourismObjectIds,
          },
        },
      );
      dynamicNotification(__('Pomyślnie dokonano masowej aktualizacji'));
      history.goBack();
    } catch (e) {
      console.error(e);
      dynamicNotification(__('Nie udało się dokonać masowej aktualizacji'), 'error');
    }
  };
  const attributesFields = attributes.map(({ code, options, name }) => (
    {
      type: 'checkbox',
      id: `${code}${ATTRIBUTE_CODE_OPTION_SEPARATOR}attribute`,
      label: name,
      onChange: onChangeAttribute,
      inputSwitcher: {
        onChange: (option, checked) => switchAttributeOption(option, code, checked),
        disableIfNotChecked: true,
        label: 'Zmień',
        perOption: true,
      },
      options: options.map(({ code: value, label }) => ({ value, label })),
    }
  ));
  const operators = useOperators(true);

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <PageTitle
          heading="Masowa aktualizacja atrybutów obiektów"
          breadcrumbs={[
            { title: 'Turystyka', link: '/tourism' },
            { title: 'Lista obiektów', link: '/tourism/objects' },
          ]}
        />
        <ContentLoading show={loading}>
          <Form
            id="attributeMassUpdateForm"
            data={data}
            config={{
              stickyTitle: false,
              defaultOnChange: onChange,
              title: 'OPCJE DOSTĘPNE W OBIEKCIE - MASOWA AKTUALIZACJA',
              groupsAsColumns: true,
              buttons: [
                {
                  size: 'lg',
                  color: 'success',
                  className: 'mr-2',
                  text: 'Zapisz',
                  type: 'submit',
                },
              ],
              onSubmit: submit,
              formGroups: [
                {
                  formElements: [
                    {
                      component: <Alert key="alert" color="warning">{__('Aktualizacja dotyczy {0} obiektów', [tourismObjectIds.length])}</Alert>,
                    },
                    {
                      id: 'status',
                      label: 'Status',
                      type: 'select',
                      options: statusOptions,
                      inputSwitcher: {
                        onChange: switchCheckbox,
                        disableIfNotChecked: true,
                        label: 'Zmień',
                      },
                    },
                    {
                      type: 'select',
                      id: 'guardianId',
                      label: 'Opiekun',
                      options: operators,
                      inputSwitcher: {
                        onChange: switchCheckbox,
                        disableIfNotChecked: true,
                        label: 'Zmień',
                      },
                    },
                    {
                      type: 'text',
                      id: 'statement',
                      label: 'Komunikat:',
                      inputSwitcher: {
                        onChange: switchCheckbox,
                        disableIfNotChecked: true,
                        label: 'Zmień',
                      },
                    },
                    {
                      type: 'textarea',
                      id: 'shortDescription',
                      label: 'Krótki opis:',
                      inputSwitcher: {
                        onChange: switchCheckbox,
                        disableIfNotChecked: true,
                        label: 'Zmień',
                      },
                    },
                    {
                      type: 'wysiwyg',
                      id: 'description',
                      label: 'Opis podstawowy:',
                      inputSwitcher: {
                        onChange: switchCheckbox,
                        disableIfNotChecked: true,
                        label: 'Zmień',
                      },
                    },
                    {
                      type: 'title',
                      label: 'Atrybuty',
                    },
                    ...attributesFields,
                  ],
                },
              ],
            }}
          />
        </ContentLoading>
      </CSSTransitionGroup>
    </>
  );
}

const getUpdateScope = (search) => {
  const urlParams = new URLSearchParams(search);
  const entries = urlParams.entries();
  let excluded = [];
  let included = [];
  let filters = null;
  [...entries].forEach(([field, value]) => {
    if (value) {
      if (field === 'included') {
        included = value !== 'true' ? value.split(',') : true;
      } else if (field === 'excluded') {
        excluded = value.split(',');
      } else if (field === 'filters') {
        filters = JSON.parse(value);
      }
    }
  });
  return { excluded, included, filters };
};
