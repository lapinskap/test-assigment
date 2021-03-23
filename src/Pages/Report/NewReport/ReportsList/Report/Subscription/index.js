import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ToggleSwitch from '../../../../../../Components/FormElements/ToggleSwitch';
import {
  subscribeMethodMock, subscribeFrequencyMock, formatDropdownMock, ahrsDropdownMock,
} from './mockData';
import SendMethodModal from './sendMethodModal';
import SubscriptionForm from './subscriptionForm';
import FrequencyModal from './Frequency';
import {
  isMockView, restApiRequest, REPORT_SERVICE,
} from '../../../../../../utils/Api';
import { dynamicNotification } from '../../../../../../utils/Notifications';

const Subscription = ({
  isEdit, subscribeFunc, subscribeData, reportId, isSaving, setSubscribeDataToEditSend, isGetBlockBtn, isAhr,
}) => {
  const [checkSub, setCheckSub] = useState(isEdit);
  const [isOpenDataMailModal, setIsOpenDataMailModal] = useState(false);
  const [isOpenFrequencyModal, setIsOpenFrequencyModal] = useState(false);

  const [subscribeMethod, setSubscribeMethod] = useState({ label: 'Nie wybrano', value: -1 });
  const [subscribeFrequency, setSubscribeFrequency] = useState({ label: 'Nie wybrano', value: -1 });

  const [subscribeInfo, setsubscribeInfo] = useState(subscribeData);
  const [subscribeInfoModal, setsubscribeInfoModal] = useState(subscribeData);

  const [subscribeMethodOptions, setSubscribeMethodOptions] = useState([]);
  const [formatOptions, setFormatOptions] = useState([]);
  const [ahrsList, setAhrsList] = useState([]);

  useEffect(() => {
    fetchSubscribeMethodDropdown();
    fetchSubscribeFormatDropdown();
    fetchAhrsListDropdown();
  }, []);

  useEffect(() => {
    setSubscribeMethod(subscribeData.subscribeMethod.subscribeMethod);
    setSubscribeFrequency(subscribeData.subscribeFrequency.subscribeFrequency);

    setsubscribeInfo(subscribeData);
    setsubscribeInfoModal(subscribeData);
  }, [subscribeData]);

  useEffect(() => {
    if (isEdit) { setSubscribeDataToEditSend(subscribeInfo); }
  }, [isEdit, subscribeInfo, setSubscribeDataToEditSend]);

  const handleChangeSubscribeMethod = (val) => {
    setSubscribeMethod(val);

    setIsOpenDataMailModal(true);
  };

  const handleChangeFrequency = (val) => {
    setSubscribeFrequency(val);
    setIsOpenFrequencyModal(true);
  };

  const saveFrequency = () => {
    const subscribeFrequencyData = { ...subscribeInfo };
    subscribeFrequencyData.subscribeFrequency = subscribeInfoModal.subscribeFrequency;
    subscribeFrequencyData.subscribeFrequency.subscribeFrequency = subscribeFrequency;

    setsubscribeInfo(subscribeFrequencyData);
    setIsOpenFrequencyModal(false);
  };

  const clickSubscribe = () => {
    const data = subscribeInfo;
    subscribeFunc(data);
  };

  const closeFrequencyModal = () => {
    const subInfo = { ...subscribeInfo };

    setsubscribeInfoModal(subInfo);
    setIsOpenFrequencyModal(false);
  };

  const closeSendMethodModal = () => {
    const subInfo = { ...subscribeInfo };

    setsubscribeInfoModal(subInfo);
    setIsOpenDataMailModal(false);
  };

  const handleNoteChange = (val) => {
    const subinfo = { ...subscribeInfo, note: val };
    const subinfoModal = { ...subscribeInfoModal, note: val };

    setsubscribeInfo(subinfo);
    setsubscribeInfoModal(subinfoModal);
  };

  const handleFrequencyInfoChange = (data) => {
    const subinfoModal = { ...subscribeInfoModal, subscribeFrequency: data };

    setsubscribeInfoModal(subinfoModal);
  };

  const handleClickEditFrequency = () => {
    setIsOpenFrequencyModal(true);
  };

  const handleSubscribeMethodSave = (data) => {
    const subMethod = { ...subscribeInfo.subscribeMethod.subscribeMethod, label: subscribeMethod.label, value: subscribeMethod.value };

    const subinfo = { ...subscribeInfo, subscribeMethod: data };
    subinfo.subscribeMethod.subscribeMethod = subMethod;

    const subinfoModal = { ...subscribeInfoModal, subscribeMethod: data };
    subinfoModal.subscribeMethod.subscribeMethod = subMethod;

    setsubscribeInfo(subinfo);
    setsubscribeInfoModal(subinfoModal);
    setIsOpenDataMailModal(false);
  };

  const fetchSubscribeMethodDropdown = () => {
    fetchData(setSubscribeMethodOptions,
      '/dropdown/subscriptionmethod',
      REPORT_SERVICE,
      'GET',
      {},
      subscribeMethodMock,
      'Błąd podczas pobierania listy metod wysyłki');
  };

  const fetchSubscribeFormatDropdown = () => {
    fetchData(setFormatOptions,
      '/dropdown/format',
      REPORT_SERVICE,
      'GET',
      {},
      formatDropdownMock,
      'Błąd podczas pobierania listy dostępnych formatów');
  };

  const fetchAhrsListDropdown = () => {
    fetchData(setAhrsList,
      '/dropdown/ahremail',
      REPORT_SERVICE,
      'GET',
      {},
      ahrsDropdownMock,
      'Błąd podczas pobierania listy ahr-ów.');
  };
  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <ToggleSwitch
            handleChange={(isOn) => setCheckSub(isOn)}
            checked={checkSub}
            label="Włącz wysyłkę raportu"
            disabled={isEdit}
          />
        </div>
      </div>
      <div className="row">
        {checkSub
          && (
            <SubscriptionForm
              subscribeMethodDropDown={subscribeMethodOptions}
              subscribeFrequencyDropDown={subscribeFrequencyMock}
              subscribeInfo={subscribeInfo}
              setSubscribeMethod={handleChangeSubscribeMethod}
              setSubscribeFrequency={handleChangeFrequency}
              setNote={handleNoteChange}
              setIsOpenDataMailModal={setIsOpenDataMailModal}
              clickSubscribe={clickSubscribe}
              occurrence={subscribeInfo.subscribeFrequency.occurrence}
              isEdit={isEdit}
              clickFrequencyEdit={handleClickEditFrequency}
              isSaving={isSaving}
              isGetBlockBtn={isGetBlockBtn}
            />
          )}
        <SendMethodModal
          isOpen={isOpenDataMailModal}
          toggle={closeSendMethodModal}
          subscribeMethod={subscribeMethod}
          subscribeMethodInfo={subscribeInfoModal.subscribeMethod}
          handleSubscribeMethodSave={handleSubscribeMethodSave}
          reportId={reportId}
          formatDropdown={formatOptions}
          isAhr={isAhr}
          ahrsList={ahrsList}
        />
        <FrequencyModal
          isOpen={isOpenFrequencyModal}
          toggle={closeFrequencyModal}
          subscribeFrequencyDropDown={subscribeFrequencyMock}
          subscribeFrequencyInfo={subscribeInfoModal.subscribeFrequency}
          subscribeFrequency={subscribeFrequency}
          setSubscribeFrequency={setSubscribeFrequency}
          setsubscribeFrequencyInfo={handleFrequencyInfoChange}
          saveFrequency={saveFrequency}
        />
      </div>
    </>
  );
};

Subscription.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  subscribeFunc: PropTypes.func.isRequired,
  subscribeData: PropTypes.objectOf.isRequired,
  reportId: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  setSubscribeDataToEditSend: PropTypes.func.isRequired,
  isAhr: PropTypes.bool.isRequired,
  isGetBlockBtn: PropTypes.bool.isRequired,
};
export default Subscription;

const fetchData = async (updateData, endpoint, service, method, { headers, params, body }, mockData, error) => {
  if (isMockView()) {
    updateData(mockData);
  } else {
    try {
      const result = await restApiRequest(service, endpoint, method, { headers, params, body }, {});
      updateData(result);
    } catch (e) {
      console.error(e);
      dynamicNotification(error || e.message || 'błąd', 'error');
    }
  }
};
