/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
import * as moment from 'moment';

export const createHourSlots = (startDate = '2021-01-05T8:00:00') => {
  // 08:00 - 18:00
  const times = 10 * 2; // 10 hours * 30 mins in an hour
  const hourSlots = [];
  for (let i = 0; i < times; i++) {
    const slot = moment(startDate)
      .add(30 * i, 'minutes')
      .format('HH:mm');

    hourSlots.push(slot);
  }

  const LunchTimeStartIndex = hourSlots.indexOf('12:00');
  if (LunchTimeStartIndex > -1) {
    hourSlots.splice(LunchTimeStartIndex, 2);
  }

  return hourSlots;
};

export const createDateListToCheck = (dateRange) => {
  const dateListToCheck = [];
  const start = dateRange.from;
  const end = dateRange.to;

  for (let arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
    dateListToCheck.push(new Date(dt));
  }

  return dateListToCheck;
};

export const createFreeDateSlots = (date, hourSlots) => {
  // for specific day
  const freeDateSlots = [];
  for (let i; i < hourSlots.length; i++) {
    freeDateSlots.push(moment(`${date} ${hourSlots[i]}`));
  }

  return freeDateSlots;
};

export const excludeCurrentAppointments = (allHourSlots, appointments) => {
  const freeHourSlots = [];

  allHourSlots.map((slot) => {
    if (!appointments.includes(slot)) {
      return freeHourSlots.push(slot);
    }
    return freeHourSlots;
  });

  return freeHourSlots;
};
