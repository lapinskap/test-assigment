import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { daysArrayMock } from '../mockData';

const WeekSelect = ({ dayArray, setDaysInWeek }) => {
  const [days] = useState(getDaysState(dayArray));

  const handleClickDay = (day) => {
    const arr = [...days];
    const elIndex = arr.findIndex((x) => x.day === day);

    arr[elIndex].isSelected = !arr[elIndex].isSelected;
    setDaysInWeek(arr);
  };

  const renderDayCircle = () => days.map((item) => {
    const { isSelected, dayLetter, day } = item;
    const selectedClass = isSelected ? 'active-day' : '';
    return (
      <>
        <button type="button" key={day} className={`day-of-week-circle ${selectedClass}`} onClick={() => handleClickDay(day)}>{dayLetter}</button>
      </>
    );
  });

  return (
    <div className="">
      <div className="week-circle-container">
        {renderDayCircle()}
      </div>
    </div>
  );
};

WeekSelect.propTypes = {
  dayArray: PropTypes.arrayOf.isRequired,
  setDaysInWeek: PropTypes.func.isRequired,
};

export default WeekSelect;

const daysArray = daysArrayMock;

const getDaysState = (dayArraySelection) => {
  const arr = [];
  daysArray.map((item) => arr.push({ ...item }));

  dayArraySelection.forEach((item) => {
    const elIndex = arr.findIndex((x) => x.day === item.day);
    arr[elIndex].isSelected = item.isSelected;
  });

  return arr;
};
