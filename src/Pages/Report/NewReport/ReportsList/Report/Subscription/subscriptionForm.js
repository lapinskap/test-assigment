import React from 'react';
import { Button, Label } from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import FreqDescription from './Frequency/freqDescritpion';

const SubscriptionForm = ({
  subscribeMethodDropDown,
  subscribeFrequencyDropDown,
  setSubscribeMethod,
  setSubscribeFrequency,
  setNote,
  setIsOpenDataMailModal,
  clickSubscribe,
  occurrence,
  subscribeInfo,
  isEdit,
  clickFrequencyEdit,
  isSaving,
  isGetBlockBtn,
}) => {
  const subScribeBtn = () => {
    const buttonText = isEdit ? 'Zapisz' : 'Ustaw';
    const buttonSavingText = isEdit ? 'Zapisywanie' : 'Ustawianie';
    return isSaving ? (
      <Button color="success" onClick={clickSubscribe} disabled>
        <FontAwesomeIcon icon={faSpinner} spin />
        {' '}
        {buttonSavingText}
        {' '}
        wysyłki...
      </Button>
    )
      : (
        <Button className="mx-1" color="success" onClick={clickSubscribe} disabled={isGetBlockBtn}>
          {buttonText}
          {' '}
          wysyłkę
        </Button>
      );
  };
  const { subscribeMethod, subscribeFrequency, note } = subscribeInfo;
  return (
    <div className="col-md-12">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <div className="col-md-3">
            <Label>Sposób wysyłki</Label>
            <Select
              defaultValue={{ label: 'Wybierz...', value: -1 }}
              name="subscriptionMethod"
              className="basic-select"
              classNamePrefix="select"
              options={subscribeMethodDropDown}
              onChange={setSubscribeMethod}
              value={subscribeMethod.subscribeMethod}
            />
          </div>
          <div className="col-md-3">
            <Label>Częstotliwość</Label>
            <Select
              defaultValue={{ label: 'Wybierz...', value: -1 }}
              name="frequency"
              className="basic-select"
              classNamePrefix="select"
              options={subscribeFrequencyDropDown}
              onChange={setSubscribeFrequency}
              value={subscribeFrequency.subscribeFrequency}
            />
          </div>
          <div className="col-md-6">
            <Label>Notatka</Label>
            <input className="form-control" type="text" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <div className="row subscription-info">
          <div className="col-md-8">
            <FreqDescription info={occurrence} />
          </div>
          <div className="col-md-4 text-right">
            <Button className="mx-1" color="secondary" onClick={() => setIsOpenDataMailModal(true)}>Edytuj dane maila</Button>
            {isEdit && <Button className="mx-1" color="secondary" onClick={clickFrequencyEdit}>Edytuj częstotliwość</Button>}
            {subScribeBtn()}
          </div>
        </div>
      </form>
    </div>
  );
};
SubscriptionForm.propTypes = {
  subscribeMethodDropDown: PropTypes.arrayOf(PropTypes.array),
  subscribeFrequencyDropDown: PropTypes.arrayOf(PropTypes.array),
  setSubscribeMethod: PropTypes.func.isRequired,
  setSubscribeFrequency: PropTypes.func.isRequired,
  note: PropTypes.string.isRequired,
  setNote: PropTypes.func.isRequired,
  setIsOpenDataMailModal: PropTypes.func.isRequired,
  clickSubscribe: PropTypes.func.isRequired,
  occurrence: PropTypes.string.isRequired,
  subscribeInfo: PropTypes.objectOf.isRequired,
  isEdit: PropTypes.bool.isRequired,
  clickFrequencyEdit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isGetBlockBtn: PropTypes.bool.isRequired,
};

SubscriptionForm.defaultProps = {
  subscribeMethodDropDown: [],
  subscribeFrequencyDropDown: [],

};

export default SubscriptionForm;
