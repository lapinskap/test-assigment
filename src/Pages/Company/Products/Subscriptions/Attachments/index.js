import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import {
  Card, CardBody, ModalHeader,
} from 'reactstrap';
import __ from '../../../../../utils/Translations';
import AttachmentList from './attachmentsList';
import Popup from '../../../../../Components/Popup/popup';
import BenefitsContext from '../utils/benefitsContext';
import { getUserConfirmationPopup } from '../../../../../Components/UserConfirmationPopup';

export default function AttachmentPopup({
  benefit, close, benefitAttachments, employeeGroupId,
}) {
  const { employeeGroups } = useContext(BenefitsContext);
  const [attachments, setAttachments] = useState([]);
  const [hasUnsavedAttachment, setHasUnsavedAttachment] = useState(false);
  const [isBenefitRefreshRequired, setIsBenefitRefreshRequired] = useState(false);
  const employeeGroupName = employeeGroupId ? employeeGroups.find((item) => item.value === employeeGroupId)?.label : '';
  useEffect(() => {
    setAttachments(employeeGroupId
      ? benefitAttachments.filter((attachment) => attachment.employeeGroup === employeeGroupId)
      : benefitAttachments);
  }, [benefitAttachments, employeeGroupId]);

  const closePopup = () => {
    if (hasUnsavedAttachment) {
      getUserConfirmationPopup(
        __('Załącznik nie został zapisany. Wprowadzone zmiany zostaną utracone.'),
        (confirm) => confirm && close(isBenefitRefreshRequired),
        __('Czy na pewno chcesz opuścić popup?'),
      );
    } else {
      close(isBenefitRefreshRequired);
    }
  };

  return (
    <>
      <Popup id="attachmentEditPopup" isOpen toggle={closePopup} unmountOnClose size="xxl">
        <ModalHeader toggle={closePopup}>
          {__('Załączniki dla benefitu {0}', [benefit.name])}
          {' '}
          {employeeGroupName ? `(${__('Grupa pracownicza: {0}', [employeeGroupName])})` : ''}
        </ModalHeader>
        <Card>
          <CardBody>
            <AttachmentList
              hasUnsavedAttachment={hasUnsavedAttachment}
              setHasUnsavedAttachment={setHasUnsavedAttachment}
              setIsBenefitRefreshRequired={setIsBenefitRefreshRequired}
              setData={setAttachments}
              data={attachments}
              employeeGroupId={employeeGroupId}
              benefitId={benefit.id}
            />
          </CardBody>
        </Card>
      </Popup>
    </>
  );
}

AttachmentPopup.propTypes = {
  close: PropTypes.func.isRequired,
  employeeGroupId: PropTypes.string,
  benefitAttachments: PropTypes.arrayOf(PropTypes.shape({})),
  benefit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

AttachmentPopup.defaultProps = {
  benefitAttachments: [],
  employeeGroupId: null,
};
