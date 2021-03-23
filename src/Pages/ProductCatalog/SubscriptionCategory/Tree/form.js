import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Form from '../../../../Components/Form';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../utils/Api';
import DataLoading from '../../../../Components/Loading/dataLoading';
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
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        isNew ? '/benefit-categories' : `/benefit-categories/${categoryId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body,
        },
      );
      dynamicNotification(__('Pomyślnie zapisano kategorię'));
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
          service={SUBSCRIPTION_MANAGEMENT_SERVICE}
          endpoint={`/benefit-categories/${categoryId}`}
          fetchedData={isNew || data !== null}
          mockDataEndpoint="/catalog/benefit-categories/edit"
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
                        scope: 'product-category_subscription-category_name',
                      },
                    },
                    {
                      id: 'active',
                      label: 'Aktywny',
                      type: 'boolean',
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
