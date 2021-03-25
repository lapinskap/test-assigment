/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
import moment from 'moment';
import { DAY_START, weeklyAppointments } from './consts';

export const createHourSlots = (startDate = '2021-01-05T8:00:00') => {
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

  // why wouldn't we use date object here?
  // because comparing two date objects always returns false

  return excludeCurrentAppointments(startDate, hourSlots);
};

export const createDateListToCheck = (dateRange) => {
  const dateListToCheck = [];
  const startDate = dateRange.from;
  const lastDate = dateRange.to;
  const currDate = moment(`${startDate} ${DAY_START}`);

  dateListToCheck.push(moment(`${startDate} ${DAY_START}`).toDate());
  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    dateListToCheck.push(currDate.clone().toDate());
  }
  dateListToCheck.push(moment(`${lastDate} ${DAY_START}`).toDate());
  return dateListToCheck;
};

export const excludeCurrentAppointments = (startDate, hourSlots) => {
  // for selected day
  const freeHourSlots = hourSlots;

  const today = moment(startDate).format('YYYY-MM-DD');
  const timeSlotsToExclude = [];

  weeklyAppointments.map((appointment) => {
    if (appointment.from.includes(today)) {
      const formatedAppoitmentSlot = formatAppoitmentToHour(appointment.from);
      return timeSlotsToExclude.push(formatedAppoitmentSlot);
    }
    return appointment;
  });

  if (timeSlotsToExclude.length > 0) {
    timeSlotsToExclude.map((slot) => {
      const indexToRemove = freeHourSlots.indexOf(slot);
      return freeHourSlots.splice(indexToRemove, 1);
    });
  }

  // in HH:mm format
  return freeHourSlots;
};

export const formatAppoitmentToHour = (appointment) => {
  const formattedAppointment = moment(appointment).format('HH:mm');

  return formattedAppointment;
};
