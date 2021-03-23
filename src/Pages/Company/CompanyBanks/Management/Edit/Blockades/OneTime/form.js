import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { dynamicNotification } from '../../../../../../../utils/Notifications';
import __ from '../../../../../../../utils/Translations';
import Form from '../../../../../../../Components/Form';
import Popup from '../../../../../../../Components/Popup/popup';

export default function BlockadeForm({
  isOpen, close, blockadeId,
}) {
  const [data, updateData] = useState({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);
  const onRangeChange = useCallback((key, value) => {
    const updatedData = { ...data };
    const { from, to } = value;
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    updateData(updatedData);
  }, [data]);
  const submit = async () => {
    try {
      // await restApiRequest(
      //   COMPANY_MANAGEMENT_SERVICE,
      //   '/attachments',
      //   'POST',
      //   {
      //     body: {
      //       companyId: parseInt(companyId, 10),
      //       attachmentType: data.attachmentType,
      //       language: data.language,
      //       name: data.name,
      //       description: data.description,
      //       file: await fileToBase64(data.file[0]),
      //     },
      //   },
      //   data,
      // );
      dynamicNotification(__('Pomyślnie zapisano blokadę'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać załącznika'), 'error');
    }
  };

  return (
    <>
      <Popup id="oneTimeBlockadePopup" isOpen={isOpen} toggle={() => close()} unmountOnClose>
        <Form
          id="oneTimeBlockadeForm"
          data={data}
          config={{
            isInPopup: true,
            togglePopup: close,
            onSubmit: submit,
            title: blockadeId === -1 ? 'Dodaj blokadę jednorazową dla Bank Premiowy' : 'Edycja blokady jednorazowej dla Bank Premiowy',
            buttons: [
              {
                size: 'lg',
                color: 'primary',
                className: 'mr-2',
                text: 'Zapisz',
                type: 'submit',
                id: 'companyBanksBlockadesSubmit',
              },
            ],
            defaultOnChange: onChange,
            formGroups: [
              {
                formElements: [
                  {
                    id: 'blockade',
                    label: 'Blokada',
                    type: 'dateRange',
                    onChange: onRangeChange,
                    validation: ['rangeRequiredBoth'],
                  },
                ],
              },
            ],
          }}
        />
      </Popup>
    </>
  );
}

BlockadeForm.propTypes = {
  blockadeId: PropTypes.number.isRequired,
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
