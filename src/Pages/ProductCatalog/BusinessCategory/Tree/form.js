import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Form from '../../../../Components/Form';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import { CATALOG_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import DataLoading from '../../../../Components/Loading/dataLoading';
import { CATEGORY_TYPE_COLLECTIVE, CATEGORY_TYPE_PRODUCT } from './utils';
import {
  catalogCategoryPermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../../Components/Popup/popup';
import CopiableField from '../../../../Components/FormElements/CopiableField';

export default function TreeNodeForm({
  close, parentId, categoryId, position,
}) {
  const isNew = categoryId === '-1';
  const [data, updateData] = useState(isNew ? { active: true } : null);
  const [originalData, setOriginalData] = useState({});

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };

  const submit = async () => {
    try {
      const body = { ...data };
      if (isNew) {
        if (parentId) {
          body.parentId = parentId;
        }
        body.position = position || 1;
      }

      await restApiRequest(
        CATALOG_MANAGEMENT_SERVICE,
        isNew ? '/business-categories' : `/business-categories/${categoryId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body,
        },
      );
      dynamicNotification(__(isNew ? 'Pomyślnie dodano kategorię' : 'Pomyślnie zapisano kategorię'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać kategorii'), 'error');
    }
  };
  return (
    <>
      <Popup id="editCategoryPopup" isOpen toggle={() => close()} unmountOnClose>
        <DataLoading
          service={CATALOG_MANAGEMENT_SERVICE}
          endpoint={`/business-categories/${categoryId}`}
          fetchedData={isNew || data !== null}
          mockDataEndpoint="/catalog/business-categories/edit"
          updateData={(updatedData) => {
            updateData(updatedData);
            setOriginalData(updatedData);
          }}
        >
          <Form
            id="editCategoryForm"
            data={data || {}}
            config={{
              buttons: [
                {
                  type: ' submit',
                  permission: catalogCategoryPermissionWrite,
                },
              ],
              onSubmit: submit,
              isInPopup: true,
              togglePopup: close,
              title: isNew ? 'Dodaj kategorię' : `Edycja kategorii ${originalData.name}`,
              defaultOnChange: onChange,
              noCards: true,
              formGroups: [
                {
                  formElements: [
                    {
                      component: <CopiableField content={data?.id} label="Identyfikator" />,
                      displayCondition: !isNew,
                    },
                    {
                      id: 'name',
                      label: 'Nazwa',
                      type: 'text',
                      validation: ['required'],
                      translatable: {
                        scope: 'product-category_bussiness-category_name',
                      },
                    },
                    {
                      id: 'type',
                      label: 'Typ kategorii:',
                      type: 'select',
                      validation: ['required'],
                      options: [
                        {
                          value: CATEGORY_TYPE_PRODUCT, label: 'Kategoria posiadająca produkty',
                        },
                        {
                          value: CATEGORY_TYPE_COLLECTIVE, label: 'Kategoria posiadająca podkategorie',
                        },
                      ],
                      props: {
                        disabled: Boolean(originalData.type),
                      },
                    },
                    {
                      id: 'active',
                      label: 'Aktywny',
                      type: 'boolean',
                      tooltip: {
                        content: 'Wyłączenie kategorii powoduje wyłączenie wszystkich podkategorii.',
                      },
                    },
                    {
                      id: 'helpCenterUrl',
                      label: 'Link do centrum pomocy',
                      type: 'text',
                    },
                  ],
                },
              ],
            }}
          />
        </DataLoading>
      </Popup>
    </>
  );
}
TreeNodeForm.propTypes = {
  close: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  parentId: PropTypes.string,
  position: PropTypes.number,
  categoryId: PropTypes.string.isRequired,
};

TreeNodeForm.defaultProps = {
  parentId: null,
  position: null,
};
