import React from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Once from './once';
import Weekly from './weekly';
import Monthly from './monthly';
import Annually from './annually';
import { subscribeFrequencyModalMock } from '../mockData';

const FrequencyModal = ({
  isOpen, toggle,
  subscribeFrequencyInfo,
  setsubscribeFrequencyInfo,
  saveFrequency,
  subscribeFrequency,
  setSubscribeFrequency,
}) => {
  const close = () => toggle(false);

  const frequencySelect = initialFreqencySelect(subscribeFrequency);

  const handleSaveClick = () => {
    saveFrequency();
  };
  const renderPeriodContent = () => {
    switch (frequencySelect.value) {
      case 'once': return (
        <Once
          subscribeFrequency={frequencySelect}
          setSubscribeFrequency={setSubscribeFrequency}
          subscribeFrequencyInfo={subscribeFrequencyInfo}
          setsubscribeFrequencyInfo={setsubscribeFrequencyInfo}
        />
      );
      case 'weekly': return (
        <Weekly
          subscribeFrequency={frequencySelect}
          setSubscribeFrequency={setSubscribeFrequency}
          subscribeFrequencyInfo={subscribeFrequencyInfo}
          setsubscribeFrequencyInfo={setsubscribeFrequencyInfo}
        />
      );
      case 'monthly': return (
        <Monthly
          subscribeFrequency={frequencySelect}
          setSubscribeFrequency={setSubscribeFrequency}
          subscribeFrequencyInfo={subscribeFrequencyInfo}
          setsubscribeFrequencyInfo={setsubscribeFrequencyInfo}
        />
      );
      case 'annually': return (
        <Annually
          subscribeFrequency={frequencySelect}
          setSubscribeFrequency={setSubscribeFrequency}
          subscribeFrequencyInfo={subscribeFrequencyInfo}
          setsubscribeFrequencyInfo={setsubscribeFrequencyInfo}
        />
      );
      default: return (
        <Once
          subscribeFrequency={frequencySelect}
          setSubscribeFrequency={setSubscribeFrequency}
          subscribeFrequencyInfo={subscribeFrequencyInfo}
          setsubscribeFrequencyInfo={setsubscribeFrequencyInfo}
        />
      );
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} toggle={close} unmountOnClose size="lg">
        <ModalHeader toggle={close}>Częstotliwość</ModalHeader>
        <ModalBody>
          {renderPeriodContent()}
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleSaveClick}>Zapisz</Button>
        </ModalFooter>
      </Modal>
    </>

  );
};
FrequencyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  subscribeFrequency: PropTypes.objectOf.isRequired,
  subscribeFrequencyInfo: PropTypes.objectOf.isRequired,
  setsubscribeFrequencyInfo: PropTypes.func.isRequired,
  saveFrequency: PropTypes.func.isRequired,
  setSubscribeFrequency: PropTypes.func.isRequired,
};

export default FrequencyModal;

const initialFreqencySelect = (subscribeFrequency) => {
  const result = subscribeFrequencyModalMock.find((x) => x.value === subscribeFrequency.value) ?? { label: 'Nie wybrano...', value: -1 };

  return result;
};
