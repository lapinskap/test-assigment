import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, CardTitle, Row, CustomInput, Button,
} from 'reactstrap';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';
import { weeklyAppointments, searchRange } from './consts';

export const findFreeTimeslots = () => {
  const datesToCheck = searchRange;
  // create time slots

  // const start = moment().startOf('day');

  // exclude slots
  // datesToCheck.split(weeklyAppointments);

  // update input state
  return [];
};

export const createHourSlots = (startDate) => {
  // 08:00 - 18:00
  const times = 10 * 2; // 10 hours * 30 mins in an hour
  const hourSlots = [];
  // eslint-disable-next-line no-plusplus
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

console.log(createHourSlots('2021-01-04T08:00:00'));

export default function Main() {
  const [selectedDate, setSelectedDate] = useState([]);
  const [dateRange, updateDateRange] = useState([]);

  const onChangeDate = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    findFreeTimeslots();
  }, []);

  return (
    <>
      <Card>
        <CardTitle className="col-sm-12 m-3">New appointment</CardTitle>
        <CardBody className="col-sm-12 ml-3">
          <p>Select date:</p>
          <Row>
            <DatePicker onChange={(date) => onChangeDate(date)} />
            <CustomInput
              type="select"
              className="col-sm-4"
            />
          </Row>
          <div>
            {selectedDate}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
