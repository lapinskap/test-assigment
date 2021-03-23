import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import FreqDescription from './freqDescritpion';
import { subscribeFrequencyModalMock } from '../mockData';
import {
  isMockView, restApiRequest, REPORT_SERVICE,
} from '../../../../../../../utils/Api';
import { dynamicNotification } from '../../../../../../../utils/Notifications';

const Monthly = ({
  subscribeFrequency,
  setSubscribeFrequency,
  subscribeFrequencyInfo,
  setsubscribeFrequencyInfo,
}) => {
  useEffect(() => {
    fetchSendigDaysOptions();
  }, []);

  const [sendingDaysOptions, setSendingDaysOptions] = useState([]);

  const fetchSendigDaysOptions = () => {
    fetchData(setSendingDaysOptions,
      '/dropdown/sendingdays',
      REPORT_SERVICE,
      'GET',
      {},
      dayOfSendOptions,
      'Błąd podczas pobierania listy dni wysyłki(miesięcznie)');
  };

  const {
    repeatEvery, sendMonthStart, daysSendAmount, daysToSend,
  } = subscribeFrequencyInfo;
  const occurrence = getOccurrence(daysToSend, repeatEvery);

  useEffect(() => {
    const subInfo1 = {
      ...subscribeFrequencyInfo, occurrence,
    };
    setsubscribeFrequencyInfo(subInfo1);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const handleRepeatEveryChange = (data) => {
    const occur = getOccurrence(daysToSend, data.value);
    const subInfo = { ...subscribeFrequencyInfo, repeatEvery: data.value, occurrence: occur };
    setsubscribeFrequencyInfo(subInfo);
  };

  const handleMonthSendStart = (data) => {
    const subInfo = { ...subscribeFrequencyInfo, sendMonthStart: data };

    setsubscribeFrequencyInfo(subInfo);
  };

  const handleDaySendSelectChange = (index, data) => {
    let subInfo = {};
    if (typeof (daysToSend.find((x) => x.index === index)) === 'undefined') {
      const objToAdd = { index, select: data };

      subInfo = { ...subscribeFrequencyInfo, daysToSend: [...daysToSend, objToAdd] };
    } else {
      const elemIndex = daysToSend.findIndex((el) => el.index === index);
      const arr = [...daysToSend];
      arr[elemIndex] = { ...arr[elemIndex], select: data };

      subInfo = { ...subscribeFrequencyInfo, daysToSend: arr };
    }
    subInfo.occurrence = getOccurrence(subInfo.daysToSend, repeatEvery);

    setsubscribeFrequencyInfo(subInfo);
  };

  const handleDaySendInputChange = (data) => {
    const subInfo = { ...subscribeFrequencyInfo, daysToSend: [{ index: 'more', select: { label: data, value: data } }] };
    subInfo.occurrence = getOccurrence(subInfo.daysToSend, repeatEvery);

    setsubscribeFrequencyInfo(subInfo);
  };

  const handleDaysSendAmount = (data) => {
    const subInfo = { ...subscribeFrequencyInfo, daysSendAmount: data, daysToSend: [] };
    setsubscribeFrequencyInfo(subInfo);
  };

  const renderDaysToSend = () => {
    const dayValue = daysSendAmount.value;

    if (dayValue === 'more') {
      const days = typeof (daysToSend[0]) === 'undefined' ? { label: '', value: '' } : daysToSend[0].select;
      return (
        <>
          <Label>Dni wysłania</Label>
          <Input onChange={(e) => handleDaySendInputChange(e.target.value)} value={days.value} />
          <br />
        </>
      );
    }

    const sendInMonthArr = [];

    for (let index = 1; index <= Number(dayValue); index += 1) {
      let dayLabel = 'Pierwszy';
      if (index === 2) { dayLabel = 'Drugi'; }
      if (index === 3) { dayLabel = 'Trzeci'; }

      sendInMonthArr.push({ label: dayLabel, day: index.toString() });
    }
    return sendInMonthArr.map((item) => {
      const days = typeof (daysToSend.find((x) => x.index === item.day)) === 'undefined' ? { label: '', value: '' }
        : daysToSend.find((x) => x.index === item.day).select;
      return (
        <>
          <Label>
            {item.label}
            {' '}
            dzień wysłania
          </Label>
          <Select
            name={`${item.index}DaySendSelect`}
            className="basic-select"
            classNamePrefix="select"
            options={sendingDaysOptions}
            onChange={(data) => handleDaySendSelectChange(item.day, data)}
            value={days}
          />
          <br />
        </>
      );
    });
  };

  const deliveryTime = new Date(Date.UTC(2000, 1, 1, 9, 0, 0));
  const timezone = deliveryTime.getTimezoneOffset() / -60;

  return (
    <>
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-3">
            <Label>Powtarzaj co</Label>
          </div>
          <div className="col-md-2 freq-select">
            <Select
              name="frequencySelect"
              className="basic-select"
              classNamePrefix="select"
              options={repeatOptions}
              onChange={handleRepeatEveryChange}
              value={repeatOptions.find((x) => x.value === repeatEvery) ?? { label: 1, value: '1' }}
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
      <Label>Ilość wysyłek w miesiącu</Label>
      <Select
        name="daysinMonthSelect"
        className="basic-select"
        classNamePrefix="select"
        options={daysInMonthOptions}
        onChange={handleDaysSendAmount}
        value={daysSendAmount}
      />
      <br />
      {renderDaysToSend()}
      <Label>Miesiąc startu wysyłki</Label>
      <Select
        name="monthStartSendSelect"
        className="basic-select"
        classNamePrefix="select"
        options={monthsOptions}
        onChange={handleMonthSendStart}
        value={monthsOptions.find((x) => x.value === sendMonthStart.value)}
        placeholder="Wybierz miesiąc"
      />
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

Monthly.propTypes = {
  subscribeFrequency: PropTypes.objectOf.isRequired,
  setSubscribeFrequency: PropTypes.func.isRequired,
  subscribeFrequencyInfo: PropTypes.objectOf.isRequired,
  setsubscribeFrequencyInfo: PropTypes.func.isRequired,
};
export default Monthly;

const getOccurrence = (daysToSend, repeat) => {
  let dayStr = '';
  const repeatStr = repeat ?? '1';

  daysToSend.forEach((item) => {
    dayStr += `${item.select.label}, `;
  });

  if (daysToSend.length > 0) {
    return `co ${repeatStr} miesiąc: ${dayStr}`;
  }
  return '';
};

const repeatOptions = [
  { label: 1, value: '1' },
  { label: 2, value: '2' },
  { label: 3, value: '3' },
  { label: 4, value: '4' },
  { label: 5, value: '5' },
  { label: 6, value: '6' },
];

const daysInMonthOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: 'więcej', value: 'more' },

];

const monthsOptions = [
  { value: '1', label: 'styczeń' },
  { value: '2', label: 'luty' },
  { value: '3', label: 'marzec' },
  { value: '4', label: 'kwiecień' },
  { value: '5', label: 'maj' },
  { value: '6', label: 'czerwiec' },
  { value: '7', label: 'lipiec' },
  { value: '8', label: 'sierpień' },
  { value: '9', label: 'wrzesień' },
  { value: '10', label: 'październik' },
  { value: '11', label: 'listopad' },
  { value: '12', label: 'grudzień' },
];

const dayOfSendOptions = [
  { label: 'pierwszy dzień roboczy miesiąca', value: '41' },
  { label: 'ostatni dzień roboczy miesiąca', value: '42' },
  { label: 'ostatni dzień miesiąca', value: '43' },

  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' },
  { label: '20', value: '20' },
  { label: '21', value: '21' },
  { label: '22', value: '22' },
  { label: '23', value: '23' },
  { label: '24', value: '24' },
  { label: '25', value: '25' },
  { label: '26', value: '26' },
  { label: '27', value: '27' },
  { label: '28', value: '28' },
  { label: '29', value: '29' },
  { label: '30', value: '30' },
  { label: '31', value: '31' },
];

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
