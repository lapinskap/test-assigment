import React, { useEffect } from 'react';
import { Label } from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import DateTimePicker from '../../../../../../../Components/FormElements/DateTimePicker';
import FreqDescription from './freqDescritpion';
import { subscribeFrequencyModalMock } from '../mockData';
import { dynamicNotification } from '../../../../../../../utils/Notifications';

const Once = ({
  subscribeFrequency,
  setSubscribeFrequency,
  subscribeFrequencyInfo,
  setsubscribeFrequencyInfo,
}) => {
  const { sendDate, sendTime } = subscribeFrequencyInfo;

  const sendStartDateTime = { date: sendDate ?? new Date().toISOString().slice(0, 10), time: sendTime ?? '10:00' };
  const occurrence = `raz w dniu ${sendStartDateTime.date}`;

  useEffect(() => {
    const { date, time } = sendStartDateTime;
    const subInfo1 = {

      ...subscribeFrequencyInfo, occurrence, sendDate: date, sendTime: time,
    };
    setsubscribeFrequencyInfo(subInfo1);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const handleDateTimePickerChange = (data) => {
    const now = new Date();
    const selectedDate = new Date(data.date).setHours(data.time.substr(0, 2), data.time.substr(3, 5));

    if (selectedDate < now) {
      dynamicNotification('Nie można wybrać daty wstecz ', 'error');
    } else {
      const { date, time } = data;
      const occurr = `raz w dniu ${date}`;
      const subInfo = {
        ...subscribeFrequencyInfo, sendDate: date, sendTime: time, occurrence: occurr,
      };
      setsubscribeFrequencyInfo(subInfo);
    }
  };
  return (
    <>
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-3">
            <Label>Powtarzaj</Label>
          </div>
          <div className="col-md-6 freq-select">
            <Select
              name="frequencySelect"
              className="basic-select"
              classNamePrefix="select"
              options={subscribeFrequencyModalMock}
              onChange={setSubscribeFrequency}
              value={subscribeFrequency}
            />
          </div>
        </div>
      </div>
      <br />
      <DateTimePicker label="Data wysyłki" onChange={handleDateTimePickerChange} value={sendStartDateTime} validateField={() => { }} />
      <FreqDescription info={occurrence} />
    </>
  );
};
Once.propTypes = {
  subscribeFrequency: PropTypes.objectOf.isRequired,
  setSubscribeFrequency: PropTypes.func.isRequired,
  subscribeFrequencyInfo: PropTypes.objectOf.isRequired,
  setsubscribeFrequencyInfo: PropTypes.func.isRequired,
};

export default Once;
