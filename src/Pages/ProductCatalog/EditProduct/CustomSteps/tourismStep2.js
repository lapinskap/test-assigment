import React, { useCallback } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import Form from '../../../../Components/Form/index';
import { useCategoryOptions } from '../utils';
import useSuppliers from '../../../../utils/hooks/suppliers/useSuppliers';
import { catalogProductPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';

export const foreignTourismPathOptions = [
  { value: 'travelplanet', label: 'Travelplanet' },
  { value: 'another', label: 'Inne' },
];

export default function TourismBasicInfo({
  data, setData, next, title,
}) {
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data, setData]);

  const categoryOptions = useCategoryOptions();
  const suppliers = useSuppliers(true, false, true);

  const submit = async () => {
    next();
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
      >
        <Form
          id="step2Form"
          data={data}
          config={{
            stickyTitle: false,
            noCards: true,
            defaultOnChange: onChange,
            groupsAsColumns: true,
            onSubmit: submit,
            title,
            buttons: [
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                type: 'submit',
                permission: catalogProductPermissionWrite,
              },
            ],
            formGroups: [
              {
                formElements: [
                  {
                    type: 'text',
                    id: 'name',
                    label: 'Nazwa:',
                    translatable: {
                      scope: 'catalog-management_product_name',
                    },
                    validation: ['required', { method: 'minLength', args: [3] }],
                  },
                  {
                    type: 'autocomplete',
                    label: 'Kategoria biznesowa:',
                    id: 'businessCategory',
                    validation: ['required'],
                    options: categoryOptions,
                  },
                  {
                    id: 'active',
                    label: 'Aktywny',
                    type: 'boolean',
                  },
                  {
                    type: 'autocomplete',
                    label: 'Dostawca:',
                    id: 'supplierId',
                    options: suppliers,
                    validation: ['required'],
                  },
                  {
                    type: 'select',
                    label: 'Ścieżka dla turystyki zagranicznej:',
                    id: 'foreignTourismPath',
                    options: foreignTourismPathOptions,
                    validation: ['required'],
                  },
                  {
                    type: 'text',
                    id: 'facilityWebPage',
                    label: 'Strona www obiektu:',
                    validation: [{ method: 'minLength', args: [3] }],
                  },
                ],
              },
            ],
          }}
        />
      </CSSTransitionGroup>
    </>
  );
}

TourismBasicInfo.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  next: PropTypes.func,
  title: PropTypes.string,
  setData: PropTypes.func.isRequired,
};

TourismBasicInfo.defaultProps = {
  next: () => {},
  title: null,
};
