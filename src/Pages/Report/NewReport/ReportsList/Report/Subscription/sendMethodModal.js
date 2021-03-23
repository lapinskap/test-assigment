import React, { useState, useEffect, useContext } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input,
} from 'reactstrap';
import Select, { Creatable } from 'react-select';
import PropTypes from 'prop-types';
import RbsContext from '../../../../../../utils/RoleBasedSecurity/RbsContext';

import TextEditor from '../../../../../../Components/FormElements/Wysiwyg';

const SendMethodModal = ({
  isOpen, toggle, subscribeMethod, subscribeMethodInfo, handleSubscribeMethodSave, formatDropdown, ahrsList,
}) => {
  const close = () => {
    setSendInfoData(subscribeMethodInfo);
    toggle(false);
  };

  const [sendInfoData, setSendInfoData] = useState({
    ...subscribeMethodInfo,
  });

  useEffect(() => {
    setSendInfoData(subscribeMethodInfo);
  }, [subscribeMethodInfo]);

  const rbsContext = useContext(RbsContext);
  const { userInfo } = rbsContext;
  const isAhr = userInfo.isAhr();
  const email = userInfo.getEmail();
  const userId = userInfo.getId();

  const handleChange = (e) => {
    const { name, value } = e.target;

    const obj = { ...sendInfoData, [name]: value };
    setSendInfoData(obj);
  };

  const handleFormatSelectChange = (data) => {
    setSendInfoData({ ...sendInfoData, format: data });
  };

  const handleRecipientsChange = (data) => setSendInfoData({ ...sendInfoData, recipients: data });
  const handleAhrsChange = (data) => setSendInfoData({ ...sendInfoData, ahrList: data });

  const handleHiddenRecipientsChange = (data) => setSendInfoData({ ...sendInfoData, hiddenRecipients: data });

  const handleMessageChange = (id, data) => {
    setSendInfoData({ ...sendInfoData, messageContent: data });
  };

  const handleSaveClick = () => {
    handleSubscribeMethodSave(sendInfoData);
  };

  const handleBlurRecipients = (e) => {
    const data = e.target.value;
    const newData = { ...sendInfoData };

    if (data !== '') newData.recipients.push({ label: data, value: data });
  };

  const handleBlurHiddenRecipients = (e) => {
    const data = e.target.value;
    const newData = { ...sendInfoData };

    if (data !== '') newData.hiddenRecipients.push({ label: data, value: data });
  };

  const title = subscribeMethod.value === -1 ? 'Edycja danych' : subscribeMethod.label;// : subscribeMethod.label;

  const formatRender = () => {
    if (subscribeMethod.value === '2') {
      return (
        <div className="col-md-12">
          <Label>Format</Label>
          <Select
            name="format"
            className="basic-select"
            classNamePrefix="select"
            options={formatDropdown}
            onChange={handleFormatSelectChange}
            value={sendInfoData.format}
          />
        </div>
      );
    }

    return '';
  };

  const recipientsRender = () => {
    const result = [];
    const addRecpients = (val, ahr) => result.push(
      <div className="col-md-12">
        <Label>Adresaci</Label>
        <Creatable
          isMulti
          name="recipients"
          onChange={handleRecipientsChange}
          options={[]}
          onBlur={handleBlurRecipients}
          value={val}
          isDisabled={ahr}
          placeholder="Wybierz z listy lub wpisz"
        />
      </div>,
    );

    const addHiddenRecipients = (val, ahr) => result.push(
      <div className="col-md-12">
        <Label>Adresaci ukryci</Label>
        <Creatable
          isMulti
          name="hiddenRecipients"
          onChange={handleHiddenRecipientsChange}
          options={[]}
          onBlur={handleBlurHiddenRecipients}
          value={val}
          isDisabled={ahr}
          placeholder="Wybierz z listy lub wpisz"
        />
      </div>,
    );

    if (!isAhr) {
      result.push(
        <div className="col-md-12">
          <Label>Lista AHR</Label>
          <Select
            isMulti
            name="recipients"
            onChange={handleAhrsChange}
            options={ahrsList}
            value={sendInfoData.ahrList}
            placeholder="Wybierz..."
          />
        </div>,
      );
    }

    if (isAhr) {
      if (subscribeMethod.value === '1') {
        // addRecpients(sendInfoData.recipients, true);
        addRecpients([{ label: email, value: userId }], true);
      } else {
        // addRecpients(sendInfoData.recipients, true);
        addRecpients([{ label: email, value: userId }], true);
      }
    } else if (subscribeMethod.value === '1') {
      addRecpients(sendInfoData.recipients, false);
      addHiddenRecipients(sendInfoData.hiddenRecipients, false);
    }

    return result;
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={close} unmountOnClose size="lg">
        <ModalHeader toggle={close}>{title}</ModalHeader>
        <ModalBody>
          <form>
            <div className="row">
              <div className="col-md-6">
                <div className="col-md-12">
                  <Label>Tytuł wiadomości*</Label>
                  <Input
                    type="text"
                    name="messageTitle"
                    id="messageTitle"
                    value={sendInfoData.messageTitle}
                    onChange={handleChange}
                  />
                </div>
                {recipientsRender()}
                {formatRender()}
              </div>
              <div className="col-md-6">
                <div className="col-md-12">
                  <TextEditor label="Treść wiadomości" value={sendInfoData.messageContent} onChange={handleMessageChange} />
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleSaveClick}>Zapisz</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

SendMethodModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  subscribeMethod: PropTypes.objectOf.isRequired,
  subscribeMethodInfo: PropTypes.func.isRequired,
  handleSubscribeMethodSave: PropTypes.func.isRequired,
  formatDropdown: PropTypes.arrayOf.isRequired,
  ahrsList: PropTypes.arrayOf.isRequired,
};

export default SendMethodModal;
