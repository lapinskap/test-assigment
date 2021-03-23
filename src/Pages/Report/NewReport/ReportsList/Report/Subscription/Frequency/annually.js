import React, { useEffect } from 'react';
import { Label } from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import DateTimePicker from '../../../../../../../Components/FormElements/DateTimePicker';
import FreqDescription from './freqDescritpion';
import { subscribeFrequencyModalMock } from '../mockData';
import { dynamicNotification } from '../../../../../../../utils/Notifications';

const Annually = ({
  subscribeFrequency,
  setSubscribeFrequency,
  subscribeFrequencyInfo,
  setsubscribeFrequencyInfo,
}) => {
  const { sendDate, sendTime } = subscribeFrequencyInfo;

  const sendStartDateTime = { date: sendDate ?? new Date().toISOString().slice(0, 10), time: sendTime ?? '10:00' };
  const { date, time } = sendStartDateTime;

  const occurrence = `co roku w dniu ${date.substr(8, date.length)}.${date.substr(5, 2)}`;

  useEffect(() => {
    const subInfo1 = {
      ...subscribeFrequencyInfo, occurrence, sendDate: date, sendTime: time,
    };
    setsubscribeFrequencyInfo(subInfo1);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const handleDateTimePickerChange = (data) => {
    const selectedDate = new Date(data.date).setHours(data.time.substr(0, 2), data.time.substr(3, 5));
    const d = data.date;
    if (selectedDate < new Date()) {
      dynamicNotification('Nie można wybrać daty wstecz ', 'error');
    } else {
      const occurr = `co roku w dniu ${d.substr(8, date.length)}.${d.substr(5, 2)}`;
      const subInfo = {
        ...subscribeFrequencyInfo, sendDate: data.date, sendTime: data.time, occurrence: occurr,
      };
      setsubscribeFrequencyInfo(subInfo);
    }
  };

  const deliveryTime = new Date(Date.UTC(2000, 1, 1, 9, 0, 0));
  const timezone = deliveryTime.getTimezoneOffset() / -60;

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
      <DateTimePicker label="Data wysyłki" value={sendStartDateTime} onChange={handleDateTimePickerChange} validateField={() => { }} />
      <FreqDescription info={occurrence} />
      <text>
        Raport będzie wysyłany po godzinie
        {' '}
        {`${deliveryTime.toTimeString().substr(0, 5)}`}
        {` GMT${timezone > 0 ? '+' : ''}${timezone}`}
      </text>
    </>
  );
};

Annually.propTypes = {
  subscribeFrequency: PropTypes.objectOf.isRequired,
  setSubscribeFrequency: PropTypes.func.isRequired,
  subscribeFrequencyInfo: PropTypes.objectOf.isRequired,
  setsubscribeFrequencyInfo: PropTypes.func.isRequired,
};
export default Annually;
