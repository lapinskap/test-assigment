import React, { useEffect } from 'react';
import { Label } from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import DateTime from '../../../../../../../Components/FormElements/DatePicker';
import { daysArrayMock, subscribeFrequencyModalMock } from '../mockData';
import FreqDescription from './freqDescritpion';
import { dynamicNotification } from '../../../../../../../utils/Notifications';
import WeekSelect from './weekSelect';

const Weekly = ({
  subscribeFrequency,
  setSubscribeFrequency,
  subscribeFrequencyInfo,
  setsubscribeFrequencyInfo,
}) => {
  const repeatEveryVal = subscribeFrequencyInfo.repeatEvery ?? 1;
  const dateVal = subscribeFrequencyInfo.sendStartDate ?? new Date();

  const { dayOfWeek } = subscribeFrequencyInfo;
  const occurrence = getOccurrence(dayOfWeek, repeatEveryVal);

  useEffect(() => {
    const subInfo1 = {
      ...subscribeFrequencyInfo, occurrence,
    };
    setsubscribeFrequencyInfo(subInfo1);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const handleRepeatEveryChange = (data) => {
    const occur = getOccurrence(dayOfWeek, data.value);

    const subInfo = { ...subscribeFrequencyInfo, repeatEvery: data.value, occurrence: occur };
    setsubscribeFrequencyInfo(subInfo);
  };

  const handleDatePickerChange = (data) => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (data < today) {
      dynamicNotification('Nie można wybrać daty wstecz ', 'error');
    } else {
      const subInfo = { ...subscribeFrequencyInfo, sendStartDate: data.toISOString().slice(0, 10) };
      setsubscribeFrequencyInfo(subInfo);
    }
  };

  const handleDayInWeekChange = (data) => {
    const occur = getOccurrence(data, repeatEveryVal);
    const subInfo = { ...subscribeFrequencyInfo, dayOfWeek: data, occurrence: occur };
    setsubscribeFrequencyInfo(subInfo);
  };

  const deliveryTime = new Date(Date.UTC(2000, 1, 1, 9, 0, 0));
  const timezone = deliveryTime.getTimezoneOffset() / -60;

  return (
    <>
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-offset-2 col-md-3">
            <Label>Powtarzaj co</Label>
          </div>
          <div className="col-md-2 freq-select">
            <Select
              name="frequencySelect"
              className="basic-select"
              classNamePrefix="select"
              options={repeatOptions}
              onChange={handleRepeatEveryChange}
              value={repeatOptions.find((x) => x.value === repeatEveryVal) ?? { label: 1, value: '1' }}
            />
          </div>
          <div className="col-md-5 freq-select">
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
      <WeekSelect
        dayArray={dayOfWeek}
        setDaysInWeek={handleDayInWeekChange}
      />
      <DateTime label="Data startu wysyłki" onChange={handleDatePickerChange} value={dateVal} validateField={() => { }} />
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

Weekly.propTypes = {
  subscribeFrequency: PropTypes.objectOf.isRequired,
  setSubscribeFrequency: PropTypes.func.isRequired,
  subscribeFrequencyInfo: PropTypes.objectOf.isRequired,
  setsubscribeFrequencyInfo: PropTypes.func.isRequired,
};
export default Weekly;

const repeatOptions = [
  { label: 1, value: '1' },
  { label: 2, value: '2' },
  { label: 3, value: '3' },
];

const getOccurrence = (days, repeat) => {
  const arr = days.filter((x) => x.isSelected === true);
  let dayStr = '';

  arr.forEach((item) => {
    const itemMock = daysArrayMock.find((x) => x.day === item.day);

    dayStr += `${itemMock.daypl} `;
  });

  if (arr.length > 0) {
    return `co ${repeat} tydzień w dniu ${dayStr}`;
  }
  return '';
};
