import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';
import { LAYOUT_ONE_COLUMN, LAYOUT_TWO_COLUMNS } from '../../../../../Components/Layouts';
import Popup from '../../../../../Components/Popup/popup';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import useConfigValue from '../../../../../utils/hooks/configuration/useConfigValue';
import { subscriptionBenefitGroupPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';

export const GROUP_TYPE_SINGLE_CHOICE = 'single';
export const GROUP_TYPE_MULTI_CHOICE = 'multichoice';

export default function EditBenefitGroupPopup({
  close, subscriptionGroupId, companyId,
}) {
  const isNew = subscriptionGroupId === '-1';

  const [data, updateData] = useState(isNew ? { manualActivationIsDefault: true } : null);
  const [originalData, setOriginalData] = useState({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const submit = async () => {
    try {
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        isNew ? '/benefit-groups' : `/benefit-groups/${subscriptionGroupId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: { ...data, companyId },
        },
      );
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać grupy abonamentów.'), 'error');
    }
  };

  const manualActivationDefaultValue = useConfigValue('subscription/generalConfig/manualActivation', companyId) || false;

  const formData = { ...data } || {};
  if (data?.manualActivationIsDefault !== false) {
    formData.manualActivation = manualActivationDefaultValue;
  }
  return (
    <Popup id="editSubscriptionGroupPopup" isOpen toggle={() => close()} unmountOnClose size="lg">
      <DataLoading
        service={SUBSCRIPTION_MANAGEMENT_SERVICE}
        fetchedData={isNew || data !== null}
        updateData={(updatedData) => {
          updateData({ ...updatedData });
          setOriginalData({ ...updatedData });
        }}
        endpoint={`/benefit-groups/${subscriptionGroupId}`}
        mockDataEndpoint="/benefit-groups/edit"
        isNew={isNew}
      >
        <Form
          id="editSubscriptionGroupForm"
          data={formData}
          config={{
            defaultOnChange: onChange,
            onSubmit: submit,
            stickyTitle: true,
            isInPopup: true,
            togglePopup: close,
            title: isNew ? 'Dodaj grupę' : `Edytuj grupę ${originalData?.name}`,
            buttons: [
              {
                size: 'lg',
                color: 'primary',
                className: 'mr-2',
                text: 'Zapisz',
                type: 'submit',
                permissions: subscriptionBenefitGroupPermissionWrite,
                id: 'editBenefitGroupSubmit',
              },
            ],
            formGroups: [
              {
                formElements: [
                  {
                    layout: LAYOUT_ONE_COLUMN,
                    formElements: [
                      {
                        id: 'name',
                        type: 'text',
                        label: 'Nazwa grupy:',
                        translatable: {
                          scope: 'company-management_subscription_groupName',
                        },
                        validation: ['required'],
                      },
                      {
                        id: 'type',
                        type: 'select',
                        label: 'Sposób wyboru:',
                        options: [
                          { value: GROUP_TYPE_SINGLE_CHOICE, label: 'Jednokrotny wybór' },
                          { value: GROUP_TYPE_MULTI_CHOICE, label: 'Wielokrotny wybór' },
                        ],
                        validation: ['required'],
                      },
                      {
                        layout: LAYOUT_TWO_COLUMNS,
                        formElements: [
                          {
                            id: 'minChoices',
                            type: 'text',
                            valueFormatter: 'integer',
                            label: 'Min:',
                            depends: {
                              field: 'type',
                              value: GROUP_TYPE_MULTI_CHOICE,
                            },
                          },
                          {
                            id: 'maxChoices',
                            type: 'text',
                            valueFormatter: 'integer',
                            label: 'Max:',
                            depends: {
                              field: 'type',
                              value: GROUP_TYPE_MULTI_CHOICE,
                            },
                            validation: [{ method: 'greaterEqualThan', args: [formData.minChoices] }],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'manualActivation',
                    type: 'boolean',
                    label: 'Wymagaj ręcznej aktywacji',
                    inputSwitcher: {
                      onChange: (field, checked) => { onChange('manualActivationIsDefault', checked); },
                      disableIfChecked: true,
                      switcherValue: Boolean(data?.manualActivationIsDefault !== false),
                      label: 'Użyj wartości z ustawień firmy',
                    },
                  },
                ],
              },
              {
                formElements: [
                  {
                    id: 'pendingDay',
                    type: 'text',
                    valueFormatter: 'integer',
                    label: 'Termin, kiedy może się odbyć akceptacja w poczekalni (1-31):',
                    validation: Boolean(formData?.manualActivation) === true ? [
                      'required',
                      { method: 'greaterEqualThan', args: [1] },
                      { method: 'lessEqualThan', args: [31] },
                    ] : null,
                    props: {
                      disabled: Boolean(formData?.manualActivation) !== true,
                    },

                  },
                  {
                    id: 'benefitDescription',
                    type: 'wysiwyg',
                    label: 'Globalny opis świadczenia abonamentowego w grupie:',
                    translatable: {
                      isCms: true,
                      code: 'company-management_subscription_groupDesc',
                    },
                  },
                ],
              },
            ],
          }}
        />
      </DataLoading>
    </Popup>
  );
}

EditBenefitGroupPopup.propTypes = {
  close: PropTypes.func.isRequired,
  subscriptionGroupId: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
};
