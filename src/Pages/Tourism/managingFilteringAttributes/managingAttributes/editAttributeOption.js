import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../Components/Form';
import ContentLoading from '../../../../Components/Loading/contentLoading';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import { restApiRequest, TOURISM_SERVICE } from '../../../../utils/Api';
import { ATTRIBUTE_IRI_PREFIX } from '../utils';
import { tourismTourismAttributePermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../../Components/Popup/popup';

export default function EditAttributeOption({
  close, optionItem, attributeValueId, attributeName, attributeId,
}) {
  const [data, updateData] = useState(optionItem || {});
  const [isLoading, setIsLoading] = useState(false);
  const isNew = !optionItem;
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const onSave = async () => {
    try {
      setIsLoading(true);
      const body = {
        label: data.label,
        code: data.code,
      };
      if (isNew) {
        body.attribute = `${ATTRIBUTE_IRI_PREFIX}${attributeId}`;
      }

      await restApiRequest(
        TOURISM_SERVICE,
        isNew ? '/tourism-attribute-options' : `/tourism-attribute-options/${attributeValueId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body,
        },
        data,
      );
      setIsLoading(false);
      close(true);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać atrybutu'), 'error');
    }
  };
  return (
    <Popup id="editAttributeOptionPopup" isOpen toggle={() => close()} unmountOnClose size="lg">
      <ContentLoading show={isLoading}>
        <Form
          id="attributeOptionForm"
          data={data}
          config={{
            defaultOnChange: onChange,
            stickyTitle: true,
            isInPopup: true,
            togglePopup: close,
            title: isNew ? 'Dodawanie wartości atrybutu' : 'Edycja wartości atrybutu',
            groupsAsColumns: true,
            buttons: [
              {
                size: 'lg',
                color: 'light',
                onClick: () => {
                  close();
                },
                className: 'mr-2',
                text: 'Anuluj',
              },
              {
                size: 'lg',
                color: 'primary',
                className: 'mr-2',
                text: 'Zapisz',
                type: 'submit',
                permission: tourismTourismAttributePermissionWrite,
              },
            ],
            onSubmit: onSave,
            formGroups: [
              {
                formElements: [
                  {
                    component: (
                      <h6 key="title" style={{ color: '#007bff' }}>
                        <strong>
                          {isNew ? __('Dodajesz wartośc atrybutu') : __('Edytujesz wartośc atrybutu')}
                          :
                          {' '}
                          {attributeName}
                        </strong>
                      </h6>
                    ),
                  },
                  {
                    id: 'label',
                    type: 'text',
                    label: 'Nazwa wartości atrybutu',
                    validation: ['required'],
                  },
                ],
              },
            ],
          }}
        />
      </ContentLoading>
    </Popup>
  );
}

EditAttributeOption.propTypes = {
  close: PropTypes.func.isRequired,
  optionItem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }),
  attributeValueId: PropTypes.number.isRequired,
  attributeName: PropTypes.string.isRequired,
  attributeId: PropTypes.number.isRequired,
};

EditAttributeOption.defaultProps = {
  optionItem: null,
};
