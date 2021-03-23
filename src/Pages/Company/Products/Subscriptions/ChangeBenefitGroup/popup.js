import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';
import Popup from '../../../../../Components/Popup/popup';
import { IRI_PREFIX as BENEFIT_GROUP_IRI_PREFIX } from '../../../../../utils/hooks/benefit/useBenefitGroups';
import __ from '../../../../../utils/Translations';

export default function ChangeBenefitGroupPopup({
  close, benefit, groups,
}) {
  const currentGroupId = benefit.benefitGroup.replace(`${BENEFIT_GROUP_IRI_PREFIX}/`, '');
  const [data, updateData] = useState({ groupId: currentGroupId });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(groups.map(({ id, name }) => ({ label: name, value: id })));
  }, [groups]);

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const submit = () => {
    if (data.groupId !== currentGroupId) {
      close(data.groupId);
    } else {
      close();
    }
  };

  return (
    <Popup id="chargeDownPopup" isOpen toggle={() => close()} unmountOnClose size="lg">
      <Form
        id="chargeDownForm"
        data={data}
        config={{
          defaultOnChange: onChange,
          stickyTitle: true,
          isInPopup: true,
          togglePopup: close,
          title: __('Zmień grupę dla abonamentu {0}', [benefit.name]),
          onSubmit: submit,
          buttons: [
            {
              id: 'changeBenefitGroupCancel',
              text: 'Wróć',
              type: 'button',
              color: 'light',
              onClick: () => close(),
            },
            {
              id: 'changeBenefitGroupSubmit',
              text: 'Zapisz',
              type: 'submit',
            },
          ],
          formGroups: [
            {
              formElements: [
                {
                  id: 'groupId',
                  type: 'select',
                  label: 'Grupa abonamentów',
                  options,
                  validation: ['required'],
                },
              ],
            },
          ],
        }}
      />
    </Popup>
  );
}

ChangeBenefitGroupPopup.propTypes = {
  close: PropTypes.func.isRequired,
  benefit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    benefitGroup: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};
