import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader as LoaderAnim } from 'react-loaders';
import Form from '../../../Components/Form';
import ContentLoading from '../../../Components/Loading/contentLoading';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import { restApiRequest, TOURISM_SERVICE } from '../../../utils/Api';
import { ATTRIBUTE_IRI_PREFIX } from './utils';
import { tourismTourismAttributePermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../Components/Popup/popup';

export default function AddAttribute({
  close, isOpen, attributeId, attributeName,
}) {
  const [data, updateData] = useState({});
  const isNew = attributeId === -1;
  const spinner = <LoaderAnim color="#545cd8" type="line-scale" active />;
  const [isLoading, setIsLoading] = useState(false);
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const onSave = async () => {
    try {
      setIsLoading(true);
      await restApiRequest(
        TOURISM_SERVICE,
        isNew ? '/tourism-attributes' : '/tourism-attribute-options',
        'POST',
        {
          body: isNew ? {
            name: data.name,
          } : {
            attribute: `${ATTRIBUTE_IRI_PREFIX}/${attributeId}`,
            label: data.name,
          },
        },
        data,
      );
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać atrybutu'), 'error');
    }
    setIsLoading(false);
  };

  return (
    <Popup id="addAttributePopup" isOpen={isOpen} toggle={() => close()} unmountOnClose size="lg">
      <ContentLoading
        message={spinner}
        show={isLoading}
      >
        <Form
          id="addAttributeForm"
          data={data}
          config={{
            defaultOnChange: onChange,
            stickyTitle: true,
            isInPopup: true,
            togglePopup: close,
            title: isNew ? 'Dodawanie atrybutu' : 'Dodawanie wartości atrybutu',
            groupsAsColumns: true,
            buttons: [
              {
                size: 'lg',
                color: 'link',
                onClick: () => {
                  close();
                },
                className: 'mr-2',
                text: 'Anuluj',
              },
              {
                size: 'lg',
                color: 'primary',
                type: 'submit',
                permission: tourismTourismAttributePermissionWrite,
                className: 'mr-2',
                text: 'Zapisz',
              },
            ],
            onSubmit: onSave,
            formGroups: [
              {
                formElements: [
                  {
                    component:
  <h6 style={{ color: '#007bff' }}>
    <strong>
      Dodajesz
      { isNew ? ' atrybut' : ` wartość atrybutu dla: ${attributeName}`}
      {' '}
    </strong>
  </h6>,
                  },
                  {
                    id: 'name',
                    type: 'text',
                    label: isNew ? 'Nazwa atrybutu' : 'Nazwa wartości atrybutu:',
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

AddAttribute.propTypes = {
  close: PropTypes.func.isRequired,
  attributeId: PropTypes.string.isRequired,
  isOpen: PropTypes.func.isRequired,
  attributeName: PropTypes.string,
};

AddAttribute.defaultProps = {
  attributeName: '',
};
