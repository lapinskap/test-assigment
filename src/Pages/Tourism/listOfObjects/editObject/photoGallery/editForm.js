import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';
import { tourismTourismObjectPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../../../Components/Popup/popup';

export default function EditForm({
  close, onSave, isOpen, item,
}) {
  const [data, updateData] = useState({ ...item });
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);
  return (
    <Popup id="photoEditPopup" isOpen={isOpen} toggle={() => close()} unmountOnClose size="lg">
      <Form
        id="photoEditForm"
        data={data}
        config={{
          defaultOnChange: onChange,
          stickyTitle: true,
          isInPopup: true,
          togglePopup: close,
          title: 'Edytuj zdjęcie',
          groupsAsColumns: true,
          buttons: [
            {
              size: 'lg',
              color: 'primary',
              className: 'mr-2',
              text: 'Zapisz',
              permission: tourismTourismObjectPermissionWrite,
              type: 'submit',
              id: 'save',
            },
          ],
          onSubmit: () => {
            onSave(data);
            close();
          },
          formGroups: [
            {
              formElements: [
                {
                  component: (
                    <div key="imagePreview" className="mb-2">
                      <img src={item.src} alt={item.alt} title={item.name} style={{ maxWidth: '765px' }} />
                    </div>
                  ),
                },
                {
                  id: 'name',
                  type: 'text',
                  label: 'Tytuł:',
                },
                {
                  id: 'alt',
                  type: 'text',
                  label: 'Tekst alternatywny:',
                },
              ],
            },
          ],
        }}
      />
    </Popup>
  );
}

EditForm.propTypes = {
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isOpen: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    alt: PropTypes.string,
    height: PropTypes.number,
    src: PropTypes.string,
    width: PropTypes.number,
  }).isRequired,
};
